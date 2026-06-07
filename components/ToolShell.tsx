"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  title: string;
  tag: string;
  description: string;
  children: ReactNode;
}

export default function ToolShell({ title, tag, description, children }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "80px" }}>
      {/* Minimal nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 40px", height: "60px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", textDecoration: "none" }}>ish.</Link>
        <Link href="/" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>← Back</Link>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", background: "var(--accent-dim)", border: "1px solid var(--accent)",
            color: "var(--accent)", fontSize: "0.75rem", padding: "4px 12px", borderRadius: "100px",
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px",
          }}>{tag}</div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "12px" }}>{title}</h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "520px" }}>{description}</p>
        </div>

        {/* Tool content */}
        {children}

        {/* Footer CTA */}
        <div style={{
          marginTop: "64px", padding: "32px", background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", textAlign: "center",
        }}>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Want this set up and customised for your business?
          </p>
          <Link href="/#contact" style={{
            display: "inline-block", background: "var(--accent)", color: "#000", fontWeight: 700,
            padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem",
          }}>
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
