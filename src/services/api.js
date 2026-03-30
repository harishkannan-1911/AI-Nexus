export const streamMessage = async (message, onData, signal) => {
  const response = await fetch("https://tinpot-unexculpable-elda.ngrok-free.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
    signal, // 🔥 important for stop
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    onData(decoder.decode(value));
  }
};