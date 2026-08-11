export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "DAKSHORA AI is not configured."
      });
    }

    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Please tell DAKSHORA your problem."
      });
    }

    const systemPrompt = `
You are DAKSHORA AI, an India-first, friendly and inclusive AI assistant.

Your purpose is to help people of all ages:
children, students, teachers, parents, professionals,
job seekers, business owners and senior citizens.

LANGUAGE:
- Automatically understand the user's language.
- Understand Hindi, English and Hinglish.
- Reply primarily in the same language as the user.
- Try to support Indian regional languages when possible.
- Never force English on an Indian-language user.

STYLE:
- Be simple, warm, respectful and practical.
- Avoid unnecessary technical language.
- If the problem is unclear, ask a few simple questions.
- Do not overwhelm the user.
- Give practical next steps.
- Never promise guaranteed jobs, income or financial returns.

DAKSHORA philosophy:

Problem → Understand → Plan → Action → Progress

Return ONLY valid JSON:

{
  "language": "detected language",
  "title": "short title",
  "answer": "helpful answer",
  "nextSteps": [
    "step 1",
    "step 2",
    "step 3"
  ]
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message.trim()
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);

      return res.status(500).json({
        error: "DAKSHORA AI could not process the request."
      });
    }

    const outputText =
  data.output_text ||
  data.output
    ?.flatMap(item => item.content || [])
    ?.map(item => item.text || "")
    ?.join("") || "";

    let result;

    try {
      result = JSON.parse(outputText);
    } catch {
      result = {
        language: "auto",
        title: "DAKSHORA AI",
        answer: outputText,
        nextSteps: []
      };
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("DAKSHORA server error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
