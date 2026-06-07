"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";

const SIMULATED = `QUOTE — ref #2026-047
─────────────────────────────────
Prepared by: Your Business Name
Date: 7 June 2026
Valid until: 7 July 2026

CLIENT
Sarah Mills
sarah@email.com

WORK DESCRIPTION
Full kitchen refit including removal of existing units,
supply and fit of new cabinetry, worktops, and tiling.

─────────────────────────────────
TOTAL (excl. VAT):   £3,200.00
VAT (20%):           £640.00
TOTAL (incl. VAT):   £3,840.00
─────────────────────────────────

PAYMENT TERMS
50% deposit required on acceptance.
Remaining balance due on completion.

To accept this quote, reply to this message or call us directly.`;

export default function QuoteBuilder() {
  const [form, setForm] = useState({ client: "", job: "", price: "", notes: "" });
  const [result, setResult] = useState(SIMULATED);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runReal = async () => {
    if (!form.client || !form.job || !form.price) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "quote", inputs: form }) });
      const data = await res.json();
      setResult(data.result);
    } catch { setResult("Something went wrong. Try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", marginBottom: "12px" };

  const ready = form.client && form.job && form.price;

  return (
    <ToolShell
      title="Quote Builder"
      tag="Admin automation"
      description="Fill in the client, job description, and price. Get a clean, professional quote formatted and ready to send — no faff."
    >
      <div style={{ display: "grid", gap: "24px" }}>
        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "20px", fontSize: "0.95rem" }}>Job details</h3>
          <input placeholder="Client name (e.g. Sarah Mills)" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} style={inputStyle} />
          <textarea rows={2} placeholder="Job description (e.g. full kitchen refit including cabinets and tiling)" value={form.job} onChange={e => setForm(f => ({ ...f, job: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
          <input placeholder="Total price (£) — e.g. 3200" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} />
          <input placeholder="Any notes? (e.g. 50% deposit, 3-week lead time) — optional" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inputStyle, marginBottom: 0 }} />
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <button onClick={() => setResult(SIMULATED)} style={{ flex: 1, padding: "11px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--muted)", fontSize: "0.875rem", cursor: "pointer" }}>
              Show example
            </button>
            <button onClick={runReal} disabled={loading || !ready} style={{ flex: 2, padding: "11px", background: ready ? "#60a5fa" : "var(--surface-2)", color: ready ? "#000" : "var(--faint)", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem", cursor: ready ? "pointer" : "default", transition: "all 0.2s" }}>
              {loading ? "Generating..." : "Build quote →"}
            </button>
          </div>
        </div>

        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.95rem" }}>Quote</h3>
            <button onClick={copy} style={{ fontSize: "0.8rem", padding: "6px 14px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "6px", color: copied ? "#60a5fa" : "var(--muted)", cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap", minHeight: "100px" }}>
            {loading ? <span style={{ color: "#60a5fa" }}>▋ Generating...</span> : result}
          </div>
        </div>

        <div style={{ padding: "20px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "#60a5fa" }}>Customised version</strong> — I can build this as a proper web form that emails a branded PDF quote to both you and the client automatically, with a follow-up reminder if they don&apos;t respond within 3 days.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
