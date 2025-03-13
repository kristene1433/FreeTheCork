// components/ChatWidget.tsx
import { useState } from 'react';

export default function ChatWidget() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.answer) setResponse(data.answer);
    } catch (error) {
      console.error('Error calling chat API:', error);
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <label>Ask the AI Sommelier:</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Suggest a wine for spicy food"
        />
        <button type="submit">Send</button>
      </form>
      {response && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
