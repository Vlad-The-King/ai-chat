export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "You are VladGPT, a smart AI.\nUser: " + message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data); // IMPORTANT pentru debug

    let reply = "No response";

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      reply = parts.map(p => p.text).join("");
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Error: " + err.message });
  }
}
