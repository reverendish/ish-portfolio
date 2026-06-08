import { NextRequest, NextResponse } from "next/server";

const prompts: Record<string, (i: Record<string, string>) => string> = {
  outreach: (i) => `Write a short cold email (under 70 words) from Ish, a developer based in Colchester who builds AI automations for small businesses. The recipient's name is ${i.name} and they run ${i.business}. Additional context: ${i.context}. Rules: address them by first name only, sound like a real person not a marketer, no em dashes, no "I hope this finds you well", no buzzwords like "streamline" or "leverage", be specific about what you could help with based on their business type, end with one simple low-pressure question. Do not mention AI explicitly in the opening line.`,

  review: (i) => `Write a WhatsApp/SMS message asking ${i.customer} for a Google review after a ${i.job} job. From ${i.businessName}. Keep it under 50 words. Warm, personal, not pushy. Include a placeholder [GOOGLE REVIEW LINK].`,

  social: (i) => `Write 3 short social media captions for a ${i.businessType} business. Today's update: "${i.update}". Write one professional, one casual/relatable, one with a question to boost engagement. Include relevant hashtags. Under 150 words each.`,

  quote: (i) => `Format a professional quote for a small business. Client: ${i.client}. Job: ${i.job}. Price: £${i.price}. Notes: ${i.notes || "none"}. Make it look clean and professional, include a validity date 30 days from today (use approximate date), and a simple payment terms line. Plain text format.`,
};

export async function POST(req: NextRequest) {
  const { tool, inputs } = await req.json();

  const prompt = prompts[tool]?.(inputs);
  if (!prompt) return NextResponse.json({ error: "Unknown tool" }, { status: 400 });

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "Something went wrong.";
  return NextResponse.json({ result: text });
}
