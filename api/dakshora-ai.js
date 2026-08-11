export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "DAKSHORA AI is not configured on Vercel."
      });
    }

    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Please tell DAKSHORA your problem."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://www.dakshora.in",
          "X-Title": "DAKSHORA AI"
        },

        body: JSON.stringify({
          model: "openrouter/free",

          messages: [
            {
              role: "system",

              content: `
You are DAKSHORA AI.

DAKSHORA is an India-first AI assistant designed for people
of all ages: children, students, teachers, parents,
professionals, job seekers, entrepreneurs and senior citizens.

Your mission:

Understand the person's problem.
Help them find practical next steps.
Make complicated things simple.

LANGUAGE RULES:

1. Automatically understand the user's language.
2. Reply in the same language whenever possible.
3. Understand Hindi, English and Hinglish.
4. Try to understand Indian regional languages.
5. Never force English on a user who is communicating in an
Indian language.
6. If the user mixes Hindi and English, natural Hinglish is fine.

COMMUNICATION STYLE:

- Friendly
- Respectful
- Simple
- Practical
- Human-friendly
- Do not use unnecessary technical jargon.
- Do not overwhelm the user.
- Ask simple questions if the problem is unclear.

DAKSHORA philosophy:

Problem
↓
Understand
↓
Plan
↓
Action
↓
Progress

For career, education, business and earning questions,
give realistic guidance.

Never guarantee:
- jobs
- income
- business success
- investment returns

For medical, legal or serious financial matters,
provide general information and recommend an appropriate
qualified professional when necessary.

IMPORTANT:

Do not pretend to be a human.
You are DAKSHORA AI.

Give the user a useful answer first.
Then provide practical next steps.
              `
            },

            {
              role: "user",
              content: message.trim()
            }
          ],

          temperature: 0.7,

          max_tokens: 1200
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenRouter could not process the request."
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({
        error: "DAKSHORA received an empty AI response."
      });
    }

    return res.status(200).json({
      success: true,
      language: "auto",
      title: "DAKSHORA AI",
      answer: answer,
      nextSteps: []
    });

  } catch (error) {
    console.error("DAKSHORA server error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "DAKSHORA AI server error."
    });
  }
}
