addTyping();

try {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  removeTyping();

  chat.messages.push({
    role: 'ai',
    text: data.reply || "No response"
  });

} catch (err) {
  removeTyping();

  chat.messages.push({
    role: 'ai',
    text: "Error: server not responding"
  });
}

save();
render();
