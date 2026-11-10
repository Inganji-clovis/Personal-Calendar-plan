"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="center">
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <h2 className="brand-font" style={{ fontSize: 24, marginBottom: 8 }}>
          Something went wrong
        </h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          An unexpected error interrupted this view. Your data is safe. You can try again.
        </p>
        <button className="primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
