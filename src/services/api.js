export const streamMessage = async (message, onData, signal) => {
  const response = await fetch(
    "https://tinpot-unexculpable-elda.ngrok-free.dev/chat-stream",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal,
    }
  );

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onData(chunk);
  }
};