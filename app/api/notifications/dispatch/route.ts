import { NextResponse } from "next/server";

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
    const body = await request.json();
    const { channel, to, message, subject } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Recipient ('to') and 'message' are required fields." },
        { status: 400 }
      );
    }

    // 1. SMS Dispatch via Africa's Talking (Rwanda / East Africa)
    if (channel === "sms") {
      const apiKey = process.env.AFRICASTALKING_API_KEY;
      const username = process.env.AFRICASTALKING_USERNAME;
      const isSandbox = username?.toLowerCase() === "sandbox";

      if (!apiKey || !username) {
        return NextResponse.json(
          {
            success: false,
            provider: "africas_talking",
            status: "unconfigured",
            message:
              "SMS dispatch blocked: Server missing AFRICASTALKING_API_KEY and AFRICASTALKING_USERNAME. External SMS is not pretend-active until telco credentials and airtime credit are provisioned."
          },
          { status: 503 }
        );
      }

      const endpoint = isSandbox
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";

      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("to", to);
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

      const responseData = await response.json();
      return NextResponse.json({
        success: response.ok,
        provider: "africas_talking",
        data: responseData
      });
    }

    // 2. Email Dispatch via Resend API
    if (channel === "email") {
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

      if (!resendApiKey) {
        return NextResponse.json(
          {
            success: false,
            provider: "resend",
            status: "unconfigured",
            message:
              "Email dispatch blocked: Server missing RESEND_API_KEY. Add your Resend API key to environment variables."
          },
          { status: 503 }
        );
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: subject || "INGANJI LIFE OS Alert",
          text: message
        })
      });

      const responseData = await response.json();
      return NextResponse.json({
        success: response.ok,
        provider: "resend",
        data: responseData
      });
    }

    return NextResponse.json(
      { error: "Invalid channel. Allowed channels: 'sms' or 'email'." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal notification dispatcher error." },
      { status: 500 }
    );
  }
}

