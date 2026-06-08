"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";

interface Company {
  name: string;
  number: string;
  type: string;
  incorporated: string;
  address: string;
  sic: string;
}

type Phase = "search" | "selected" | "generated";

export default function OutreachAgent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [selected, setSelected] = useState<Company | null>(null);
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<Phase>("search");
  const [searching, setSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setResults([]);
    setSelected(null);
    setPhase("search");
    try {
      const res = await fetch(`/api/companies?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResults(data.companies || []);
      if ((data.companies || []).length === 0) setError("No active companies found. Try a different search.");
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const select = (c: Company) => {
    setSelected(c);
    setPhase("selected");
    setMessage("");
    setContext("");
  };

  const generate = async () => {
    if (!selected) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "outreach",
          inputs: {
            name: selected.name,
            business: `${selected.sic || selected.type}, ${selected.address}`,
            context: context || `Incorporated ${selected.incorporated}`,
          },
        }),
      });
      const data = await res.json();
      setMessage(data.result);
      setPhase("generated");
    } catch {
      setError("Generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    setPhase("search");
    setSelected(null);
    setResults([]);
    setQuery("");
    setMessage("");
    setContext("");
    setError("");
  };

  const box: React.CSSProperties = {
    padding: "24px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "var(--surface)",
    border: "1px solid var(--border-2)",
    borderRadius: "8px",
    color: "var(--text)",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  const btn = (active: boolean): React.CSSProperties => ({
    padding: "11px 20px",
    background: active ? "var(--accent)" : "var(--surface-2)",
    color: active ? "#000" : "var(--faint)",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "0.875rem",
    cursor: active ? "pointer" : "default",
    transition: "all 0.2s",
  });

  return (
    <ToolShell
      title="Outreach Agent"
      tag="Sales automation"
      description="Search any UK company by name, select it, and get a personalised outreach message generated from live Companies House data."
    >
      <div style={{ display: "grid", gap: "20px" }}>

        {/* Step 1: Search */}
        <div style={box}>
          <h3 style={{ fontWeight: 600, marginBottom: "16px", fontSize: "0.95rem" }}>
            {phase !== "search" ? "✓ Company selected" : "1. Search a UK company"}
          </h3>

          {phase === "search" && (
            <>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  placeholder="e.g. Acme Cleaning Colchester"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && search()}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={search} disabled={searching || !query.trim()} style={btn(!!query.trim() && !searching)}>
                  {searching ? "Searching..." : "Search →"}
                </button>
              </div>

              {error && (
                <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "#f87171" }}>{error}</p>
              )}

              {results.length > 0 && (
                <div style={{ marginTop: "16px", display: "grid", gap: "8px" }}>
                  {results.map(c => (
                    <button
                      key={c.number}
                      onClick={() => select(c)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border-2)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", marginBottom: "4px" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                        {c.address}{c.sic ? ` · ${c.sic}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {phase !== "search" && selected && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{selected.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>{selected.address}</div>
              </div>
              <button onClick={reset} style={{ fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
                Change
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Generate */}
        {phase !== "search" && (
          <div style={box}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", fontSize: "0.95rem" }}>2. Generate message</h3>
            <textarea
              rows={2}
              placeholder="Optional: add context (e.g. 'they recently expanded', 'their website looks outdated')"
              value={context}
              onChange={e => setContext(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", marginBottom: "12px" }}
            />
            <button onClick={generate} disabled={generating} style={btn(!generating)}>
              {generating ? "Generating..." : "Generate with AI →"}
            </button>
          </div>
        )}

        {/* Step 3: Output */}
        {phase === "generated" && message && (
          <div style={box}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 600, fontSize: "0.95rem" }}>3. Your message</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={generate} style={{ fontSize: "0.8rem", padding: "6px 14px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "6px", color: "var(--muted)", cursor: "pointer" }}>
                  Regenerate
                </button>
                <button onClick={copy} style={{ fontSize: "0.8rem", padding: "6px 14px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "6px", color: copied ? "var(--accent)" : "var(--muted)", cursor: "pointer" }}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap" }}>
              {message}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: "20px", background: "var(--accent-dim)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--accent)" }}>Want this for your business?</strong> — I can build a version that searches your target market automatically, generates 20+ messages in one go, and tracks replies. <a href="/#contact" style={{ color: "var(--accent)" }}>Get in touch →</a>
          </p>
        </div>

      </div>
    </ToolShell>
  );
}
