export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("OPENAI RAW RESPONSE:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({
        reply: data.error?.message || "OpenAI API error"
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "Empty response from AI"
    });

  } catch (err) {
    return res.status(500).json({
      reply: err.message || "Server error"
    });
  }
}
