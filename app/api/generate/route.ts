import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { tool, inputs } = await req.json();

  const prompts: Record<string, (i: Record<string, string>) => string> = {
    outreach: (i) => `Write a short, casual outreach DM (under 60 words) from Ish, a developer who builds AI automations for small businesses. Target: ${i.name}, ${i.business}. What they do/posted: ${i.context}. Sound human, no em dashes, no corporate language, no "I hope this finds you well". Open with something specific about them. End with a simple question.`,

    review: (i) => `Write a WhatsApp/SMS message asking ${i.customer} for a Google review after a ${i.job} job. From ${i.businessName}. Keep it under 50 words. Warm, personal, not pushy. Include a placeholder [GOOGLE REVIEW LINK].`,

    social: (i) => `Write 3 short social media captions for a ${i.businessType} business. Today's update: "${i.update}". Write one professional, one casual/relatable, one with a question to boost engagement. Include relevant hashtags. Under 150 words each.`,

    quote: (i) => `Format a professional quote for a small business. Client: ${i.client}. Job: ${i.job}. Price: £${i.price}. Notes: ${i.notes || "none"}. Make it look clean and professional, include a validity date 30 days from today (use approximate date), and a simple payment terms line. Plain text format.`,
  };

  const prompt = prompts[tool]?.(inputs);
  if (!prompt) return NextResponse.json({ error: "Unknown tool" }, { status: 400 });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ result: text });
}
