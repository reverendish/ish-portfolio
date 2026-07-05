"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useContactModal } from "./ContactModalProvider";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const linkStyle = {
    fontSize: "0.8rem",
    color: "#5b5648" as const,
    textDecoration: "none",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    transition: "color 0.2s ease",
  };

  const navLinks = (
    <>
      <Link
        href="/writing"
        style={linkStyle}
        onMouseEnter={e => (e.currentTarget.style.color = "#141414")}
        onMouseLeave={e => (e.currentTarget.style.color = "#5b5648")}
        onClick={() => setMenuOpen(false)}
      >
        Writing
      </Link>
      <ThemeToggle />
    </>
  );

  return (
    <nav
      aria-label="Primary navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 clamp(16px, 4vw, 40px)",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        borderBottom: scrolled ? "1px solid #e5ddce" : "1px solid transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <Link href="/" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em", color: "#141414", textDecoration: "none" }}>
        ish
      </Link>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {!isMobile && navLinks}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "transparent",
              border: "1px solid #ddd3bf",
              borderRadius: "4px",
              padding: "6px 8px",
              cursor: "pointer",
              color: "#5b5648",
              fontSize: "1.1rem",
              lineHeight: 1,
              fontFamily: "monospace",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
        <button
          onClick={() => { openModal(); setMenuOpen(false); }}
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

      {isMobile && menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            right: 0,
            background: "#ffffff",
            borderBottom: "1px solid #e5ddce",
            padding: "16px clamp(16px, 4vw, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {navLinks}
        </div>
      )}
    </nav>
  );
}
