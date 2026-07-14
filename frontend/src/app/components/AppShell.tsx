import React from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        Bank API Gateway Admin Console
      </header>
      <main style={{ flex: 1, padding: 16 }}>{children}</main>
      <footer style={{ padding: 16, borderTop: "1px solid #eee" }}>
        Â© {new Date().getFullYear()}
      </footer>
    </div>
  );
}
