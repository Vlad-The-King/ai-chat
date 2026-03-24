export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const msg = message.toLowerCase();

    // DETECT NAME QUESTIONS (multi-language basic)
    const nameQuestions = [
      "cum te numesti",
      "ce nume ai",
      "cine esti",
      "who are you",
      "what is your name",
      "your name",
      "como te llamas",
      "qui es-tu",
      "wie heißt du"
    ];

    const isNameQuestion = nameQuestions.some(q => msg.includes(q));

    // Dacă întreabă de nume → răspuns direct
    if (isNameQuestion) {

      let reply = "I am VladGPT Pro";

      if (msg.includes("cum") || msg.includes("nume")) {
        reply = "Eu sunt VladGPT Pro";
      }

      if (msg.includes("como")) {
        reply = "Soy VladGPT Pro";
      }

      if (msg.includes("qui")) {
        reply = "Je suis VladGPT Pro";
      }

      if (msg.includes("wie")) {
        reply = "Ich bin VladGPT Pro";
      }

      return res.status(200).json({ reply });
    }

    // NORMAL AI REQUEST
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
You are VladGPT Pro created by Vlad.

If the user asks your name or who you are, ALWAYS respond that your name is VladGPT Pro in the same language as the user.

You are very intelligent, clear, and helpful.
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

    const reply =
      data.choices?.[0]?.message?.content ||
      "No response";

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Error: " + err.message });
  }
}
