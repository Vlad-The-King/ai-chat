export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 200,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();

    let reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      data?.error ||
      "No response";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: err.message || "Server error"
    });
  }
}
