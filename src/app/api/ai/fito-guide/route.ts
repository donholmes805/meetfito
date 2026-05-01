import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://meetfito.com",
        "X-Title": "Meet Fito",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // Using a fast, reliable model
        messages: [
          {
            role: "system",
            content: `You are Fito Guide, a helpful and friendly AI assistant for "Meet Fito", a family-safe homeschool meetup platform. 
            Your goal is to help parents plan homeschool meetups, create co-op schedules, suggest P.E. activities, and recommend learning materials.
            Always maintain a warm, trustworthy, and community-focused tone. 
            Prioritize safety and educational value in all your suggestions.`
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
