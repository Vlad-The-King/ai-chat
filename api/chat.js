export default async function handler(req, res) {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase();

    // 👉 detectare întrebare despre nume
    const isNameQuestion =
      msg.includes("cum te numesti") ||
      msg.includes("ce nume ai") ||
      msg.includes("cine esti") ||
      msg.includes("who are you") ||
      msg.includes("what is your name");

    if (isNameQuestion) {
      return res.status(200).json({
        reply: "I am VladGPT Pro"
      });
    }

    // 👉 GROQ REQUEST
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are VladGPT Pro, a smart and helpful AI assistant.
You can use **bold text** when appropriate.
`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();

    console.log("GROQ RESPONSE:", data);

    let reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI error";

    // 👉 CONVERT **text** -> HTML <b>text</b>
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>");

    return res.status(200).json({ reply });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(500).json({
      reply: "Server error"
    });
  }
}
