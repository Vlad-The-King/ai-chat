export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: [
            { role: "user", content: message }
          ],
          max_tokens: 200
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error ||
      "No response";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: err.message || "Server error"
    });
  }
}
