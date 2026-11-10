"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1120",
          color: "#e2e8f0",
          fontFamily:
            "'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Application error</h2>
          <p style={{ color: "#94a3b8", marginBottom: 20 }}>
            INGANJI LIFE OS hit a critical error while loading. Please reload the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#10b981",
              color: "#04231a",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
