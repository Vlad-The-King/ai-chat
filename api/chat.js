const data = await response.json();

console.log("HF RAW:", data);

let reply = "";

if (data?.choices?.[0]?.message?.content) {
  reply = data.choices[0].message.content;
} 
else if (typeof data === "string") {
  reply = data;
} 
else if (data?.generated_text) {
  reply = data.generated_text;
} 
else if (Array.isArray(data) && data[0]?.generated_text) {
  reply = data[0].generated_text;
} 
else {
  reply = JSON.stringify(data); // fallback safe
}

return res.status(200).json({ reply });
