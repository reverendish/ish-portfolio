"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";

const SIMULATED = `**Professional**
Another successful boiler installation completed in Chelmsford today. If your heating's been unreliable this winter, now's the time to sort it. Get in touch for a free quote. 🔧
#Plumber #BoilerInstallation #Essex #Chelmsford #HeatingEngineer

**Relatable**
Sometimes the best part of the job is knowing a family's going to wake up to a warm house tomorrow morning. Did a full boiler swap in Chelmsford today — job done. 🏠
#PlumberLife #Essex #TradesLife

**Engagement**
❓ Quick question — how old is your boiler? Most manufacturers recommend a replacement after 10-12 years. Drop a comment with the age of yours and I'll tell you if you're due an upgrade!
#Chelmsford #Plumber #HomeImprovement`;

export default function SocialPosts() {
  const [form, setForm] = useState({ businessType: "", update: "" });
  const [result, setResult] = useState(SIMULATED);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runReal = async () => {
    if (!form.update) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool: "social", inputs: form }) });
      const data = await res.json();
      setResult(data.result);
    } catch { setResult("Something went wrong. Try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", marginBottom: "12px" };

  return (
    <ToolShell
      title="Social Post Generator"
      tag="Content automation"
      description="Tell it what you did today and your business type. Get 3 ready-to-post captions — professional, relatable, and one designed to drive comments."
    >
      <div style={{ display: "grid", gap: "24px" }}>
        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "20px", fontSize: "0.95rem" }}>What happened today?</h3>
          <input placeholder="Business type (e.g. plumber, cleaning company, café)" value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} style={inputStyle} />
          <textarea rows={3} placeholder="What did you do today? (e.g. fitted a boiler in Chelmsford, completed a 3-bedroom end-of-tenancy clean)" value={form.update} onChange={e => setForm(f => ({ ...f, update: e.target.value }))} style={{ ...inputStyle, resize: "vertical", marginBottom: 0 }} />
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <button onClick={() => setResult(SIMULATED)} style={{ flex: 1, padding: "11px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--muted)", fontSize: "0.875rem", cursor: "pointer" }}>
              Show example
            </button>
            <button onClick={runReal} disabled={loading || !form.update} style={{ flex: 2, padding: "11px", background: form.update ? "#f59e0b" : "var(--surface-2)", color: form.update ? "#000" : "var(--faint)", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.875rem", cursor: form.update ? "pointer" : "default", transition: "all 0.2s" }}>
              {loading ? "Generating..." : "Generate with AI →"}
            </button>
          </div>
        </div>

        <div style={{ padding: "28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.95rem" }}>3 captions</h3>
            <button onClick={copy} style={{ fontSize: "0.8rem", padding: "6px 14px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "6px", color: copied ? "#f59e0b" : "var(--muted)", cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap", minHeight: "100px" }}>
            {loading ? <span style={{ color: "#f59e0b" }}>▋ Generating...</span> : result}
          </div>
        </div>

        <div style={{ padding: "20px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "#f59e0b" }}>Customised version</strong> — I can build a weekly pipeline that generates a full week of posts from a simple Monday morning form, formatted for Facebook, Instagram, and LinkedIn automatically.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
