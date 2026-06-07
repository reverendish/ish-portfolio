"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";

const SIMULATED = `Hey Jake, fellow Colchester person here.

Saw your post about the TikTok ad work — I build scripts and content briefs with AI, might save you a few hours a week.

Worth a quick chat?`;

export default function OutreachAgent() {
  const [form, setForm] = useState({ name: "", business: "", context: "" });
  const [result, setResult] = useState(SIMULATED);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runDemo = () => {
    setResult(SIMULATED);
  };

  const runReal = async () => {
    if (!form.name || !form.business) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "outreach", inputs: form }) });
      const data = await res.json();
      setResult(data.result);
    } catch { setResult("Something went wrong. Try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", marginBottom: "12px" };

  return (
    <ToolShell
      title="Outreach Agent"
      tag="Sales automation"
      description="Paste in a prospect's name, their business, and what they posted or what they do. Get a short, personalised pitch back in seconds."
    >
      <div style={{ display: "grid", gap: "24px" }}>
        {/* Inputs */}
        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "20px", fontSize: "0.95rem" }}>Prospect details</h3>
          <input placeholder="Their name (e.g. Jake Tokley)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <input placeholder="Their business (e.g. TikTok ads, Colchester)" value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} style={inputStyle} />
          <textarea rows={3} placeholder="What they posted / what they do (e.g. looking for local businesses to film UGC for)" value={form.context} onChange={e => setForm(f => ({ ...f, context: e.target.value }))} style={{ ...inputStyle, resize: "vertical", marginBottom: 0 }} />
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <button onClick={runDemo} style={{ flex: 1, padding: "11px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--muted)", fontSize: "0.875rem", cursor: "pointer" }}>
              Show example
            </button>
            <button onClick={runReal} disabled={loading || !form.name} style={{ flex: 2, padding: "11px", background: form.name ? "var(--accent)" : "var(--surface-2)", color: form.name ? "#000" : "var(--faint)", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem", cursor: form.name ? "pointer" : "default", transition: "all 0.2s" }}>
              {loading ? "Generating..." : "Generate with AI →"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.95rem" }}>Output</h3>
            <button onClick={copy} style={{ fontSize: "0.8rem", padding: "6px 14px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "6px", color: copied ? "var(--accent)" : "var(--muted)", cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap", minHeight: "80px" }}>
            {loading ? <span style={{ color: "var(--accent)" }}>▋ Generating...</span> : result}
          </div>
        </div>

        {/* How to use */}
        <div style={{ padding: "20px", background: "var(--accent-dim)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--accent)" }}>Customised version</strong> — for your business, I&apos;d train this on your tone of voice, typical client types, and what you actually offer. It can pull from a prospect list automatically and output 20+ messages in one go.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
