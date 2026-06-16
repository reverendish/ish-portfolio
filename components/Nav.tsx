"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useContactModal } from "./ContactModalProvider";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle = {
    fontSize: "0.875rem",
    color: "var(--muted)" as const,
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s ease",
  };

  return (
    <nav
      aria-label="Primary navigation"
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
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <Link href="/" style={{ fontWeight: 700, fontSize: "1.6rem", letterSpacing: "-0.03em", color: "var(--text)", textDecoration: "none" }}>
        ish
      </Link>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a
          href="#about"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
        >
          About
        </a>
        <a
          href="#tools"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
        >
          Work
        </a>
        <ThemeToggle />
        <button
          onClick={openModal}
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--accent-fg)",
            background: "var(--accent)",
            padding: "8px 18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Get in touch
        </button>
      </div>
    </nav>
  );
}
