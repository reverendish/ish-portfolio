"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";

const SIMULATED = `Hi Dave, it was great working with you on the boiler installation!

If you were happy with the job, we'd really appreciate a quick Google review — takes 30 seconds and helps us a lot.

[GOOGLE REVIEW LINK]

Thanks! — Chelmer Gas`;

export default function ReviewRequest() {
  const [form, setForm] = useState({ customer: "", job: "", businessName: "" });
  const [result, setResult] = useState(SIMULATED);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runReal = async () => {
    if (!form.customer || !form.job) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "review", inputs: form }) });
      const data = await res.json();
      setResult(data.result);
    } catch { setResult("Something went wrong. Try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", marginBottom: "12px" };

  return (
    <ToolShell
      title="Review Request Generator"
      tag="Reputation automation"
      description="Enter a customer's name, the job you did, and your business name. Get a warm, personalised WhatsApp or SMS message ready to copy-paste."
    >
      <div style={{ display: "grid", gap: "24px" }}>
        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "20px", fontSize: "0.95rem" }}>Job details</h3>
          <input placeholder="Customer name (e.g. Dave)" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} style={inputStyle} />
          <input placeholder="What job did you do? (e.g. boiler installation)" value={form.job} onChange={e => setForm(f => ({ ...f, job: e.target.value }))} style={inputStyle} />
          <input placeholder="Your business name (e.g. Chelmer Gas)" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} style={{ ...inputStyle, marginBottom: 0 }} />
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <button onClick={() => setResult(SIMULATED)} style={{ flex: 1, padding: "11px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--muted)", fontSize: "0.875rem", cursor: "pointer" }}>
              Show example
            </button>
            <button onClick={runReal} disabled={loading || !form.customer} style={{ flex: 2, padding: "11px", background: form.customer ? "#a78bfa" : "var(--surface-2)", color: form.customer ? "#000" : "var(--faint)", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem", cursor: form.customer ? "pointer" : "default", transition: "all 0.2s" }}>
              {loading ? "Generating..." : "Generate with AI →"}
            </button>
          </div>
        </div>

        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.95rem" }}>Message</h3>
            <button onClick={copy} style={{ fontSize: "0.8rem", padding: "6px 14px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "6px", color: copied ? "#a78bfa" : "var(--muted)", cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap", minHeight: "80px" }}>
            {loading ? <span style={{ color: "#a78bfa" }}>▋ Generating...</span> : result}
          </div>
        </div>

        <div style={{ padding: "20px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "#a78bfa" }}>Customised version</strong> — I can connect this directly to your job management system (Jobber, Tradify, ServiceM8, etc.) so it sends automatically 24 hours after a job is marked complete.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
