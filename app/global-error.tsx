"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#06120d", color: "#f8fff7", fontFamily: "system-ui, sans-serif", padding: 24 }}>
          <div style={{ maxWidth: 560, textAlign: "center", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 28, padding: 32 }}>
            <h1>Cricket AI Studio encountered an error</h1>
            <p style={{ color: "#9bb5a4", lineHeight: 1.7 }}>Please retry the request. If this continues, review the production logs and monitoring dashboard.</p>
            <button onClick={reset} style={{ marginTop: 20, borderRadius: 999, border: 0, padding: "12px 18px", fontWeight: 700, background: "#b7f95a", color: "#07110c" }}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
