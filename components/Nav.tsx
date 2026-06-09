"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 40px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <Link href="/" style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--text)", textDecoration: "none" }}>
        ish.
      </Link>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <Link href="/#tools" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>Tools</Link>
        <Link href="/#projects" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>Projects</Link>
        <Link
          href="/#contact"
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#000",
            background: "var(--accent)",
            padding: "8px 18px",
            borderRadius: "6px",
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
        >
          Get in touch
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
