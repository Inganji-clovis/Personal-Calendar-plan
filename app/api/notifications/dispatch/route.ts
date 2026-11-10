import { NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/serverAuth";
import { rateLimit, clientKey } from "@/lib/rateLimit";

const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const hasAfricaTalking = Boolean(
    process.env.AFRICASTALKING_API_KEY && process.env.AFRICASTALKING_USERNAME
  );
  const hasTwilio = Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  );
  const hasResend = Boolean(process.env.RESEND_API_KEY);

  return NextResponse.json({
    status: "ok",
    inAppEngine: "active",
    gateways: {
      sms: {
        configured: hasAfricaTalking || hasTwilio,
        provider: hasAfricaTalking ? "africas_talking" : hasTwilio ? "twilio" : "none",
        notes: hasAfricaTalking || hasTwilio
          ? "SMS provider credentials detected."
          : "Provider setup required: Set AFRICASTALKING_API_KEY and AFRICASTALKING_USERNAME in environment variables."
      },
      email: {
        configured: hasResend,
        provider: hasResend ? "resend" : "none",
        notes: hasResend
          ? "Email provider credentials detected."
          : "Provider setup required: Set RESEND_API_KEY in environment variables."
      }
    }
  });
}

export async function POST(request: Request) {
  try {
    // 1. Authentication — SMS/email cost real money, so require a session when
    //    auth is configured.
    const auth = await verifyRequestAuth(request);
    if (auth.configured && !auth.userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // 2. Strict rate limiting (outbound messaging is the most abusable endpoint).
    const rl = rateLimit(clientKey(request, auth.userId), auth.userId ? 10 : 3, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before dispatching again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
      );
    }

    // 3. Input validation.
    const body = await request.json().catch(() => ({}));
    const { channel, to, message, subject } = body || {};

    if (channel !== "sms" && channel !== "email") {
      return NextResponse.json(
        { error: "Invalid channel. Allowed channels: 'sms' or 'email'." },
        { status: 400 }
      );
    }
    if (typeof to !== "string" || typeof message !== "string" || !to.trim() || !message.trim()) {
      return NextResponse.json(
        { error: "Recipient ('to') and 'message' are required fields." },
        { status: 400 }
      );
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message exceeds the 1000 character limit." }, { status: 400 });
    }
    if (channel === "sms" && !PHONE_RE.test(to.trim())) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }
    if (channel === "email" && !EMAIL_RE.test(to.trim())) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    // 4. SMS Dispatch via Africa's Talking (Rwanda / East Africa)
    if (channel === "sms") {
      const apiKey = process.env.AFRICASTALKING_API_KEY;
      const username = process.env.AFRICASTALKING_USERNAME;
      const isSandbox = username?.toLowerCase() === "sandbox";

      if (!apiKey || !username) {
        return NextResponse.json({
          success: false,
          provider: "africas_talking",
          status: "unconfigured",
          message:
            "SMS dispatch blocked: Server missing AFRICASTALKING_API_KEY and AFRICASTALKING_USERNAME. External SMS is not pretend-active until telco credentials and airtime credit are provisioned."
        }, { status: 503 });
      }

      const endpoint = isSandbox
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";

      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("to", to.trim());
      formData.append("message", message);
      if (process.env.AFRICASTALKING_SENDER_ID) {
        formData.append("from", process.env.AFRICASTALKING_SENDER_ID);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apiKey: apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: formData.toString()
      });

      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        console.error("[notifications/dispatch] Africa's Talking error", response.status);
        return NextResponse.json({ success: false, provider: "africas_talking", error: "SMS gateway rejected the request." }, { status: 502 });
      }
      return NextResponse.json({ success: true, provider: "africas_talking", data: responseData });
    }

    // 5. Email Dispatch via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        provider: "resend",
        status: "unconfigured",
        message:
          "Email dispatch blocked: Server missing RESEND_API_KEY. Add your Resend API key to environment variables."
      }, { status: 503 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to.trim()],
        subject: typeof subject === "string" && subject.trim() ? subject.slice(0, 200) : "INGANJI LIFE OS Alert",
        text: message
      })
    });

    const responseData = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("[notifications/dispatch] Resend error", response.status);
      return NextResponse.json({ success: false, provider: "resend", error: "Email gateway rejected the request." }, { status: 502 });
    }
    return NextResponse.json({ success: true, provider: "resend", data: responseData });
  } catch (err) {
    console.error("[notifications/dispatch] Unexpected error", err);
    return NextResponse.json({ error: "Internal notification dispatcher error." }, { status: 500 });
  }
}
