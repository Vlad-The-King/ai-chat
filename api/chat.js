export default async function handler(req, res) {
  try {
    const { message } = req.body;
    const msg = message.toLowerCase();

    // DETECT NAME QUESTIONS
    const nameQuestions = [
      "cum te numesti","ce nume ai","cine esti",
      "who are you","what is your name",
      "como te llamas","qui es-tu","wie heißt du"
    ];

    const isNameQuestion = nameQuestions.some(q => msg.includes(q));

    if (isNameQuestion) {
      let reply = "I am VladGPT Pro";

      if (msg.includes("cum") || msg.includes("nume")) reply = "Eu sunt VladGPT Pro";
      if (msg.includes("como")) reply = "Soy VladGPT Pro";
      if (msg.includes("qui")) reply = "Je suis VladGPT Pro";
      if (msg.includes("wie")) reply = "Ich bin VladGPT Pro";

      return res.status(200).json({ reply });
    }

    // GROQ REQUEST
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are VladGPT Pro, a smart AI.
Answer clearly and helpfully.
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

    console.log("GROQ RESPONSE:", data); // 🔥 IMPORTANT

    // FIX IMPORTANT
    if (!data.choices || !data.choices[0]) {
      return res.status(200).json({
        reply: "AI error (check Vercel logs)"
      });
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "Server error: " + err.message
    });
  }
}
