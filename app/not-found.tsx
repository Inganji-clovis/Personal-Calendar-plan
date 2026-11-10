import Link from "next/link";

export default function NotFound() {
  return (
    <div className="center">
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <p className="eyebrow">404</p>
        <h2 className="brand-font" style={{ fontSize: 24, marginBottom: 8 }}>
          Page not found
        </h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="primary" style={{ display: "inline-flex" }}>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
