export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: message
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      data?.error ||
      "No response";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: err.message
    });
  }
}
