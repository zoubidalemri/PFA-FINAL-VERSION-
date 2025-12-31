// src/pages/ChatbotPage.jsx
import { useState } from "react";

function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour, je suis ton conseiller IA. Veux-tu une orientation de carrière ou un changement de poste ?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { from: "user", text: input.trim() },
      {
        from: "bot",
        text:
          "Merci pour ta question. Plus tard, je te proposerai des parcours et des formations adaptées à ton profil.",
      },
    ];
    setMessages(newMessages);
    setInput("");
  };

  return (
    <div className="page chatbot-page">
      <header className="page-header">
        <h1>Conseiller IA</h1>
        <p>Pose tes questions sur ton orientation ou ton évolution.</p>
      </header>

      <main className="page-content chatbot-container">
        <div className="chat-window">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`chat-bubble chat-bubble-${
                m.from === "bot" ? "bot" : "user"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Écris ton message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn-primary" type="submit">
            Envoyer
          </button>
        </form>
      </main>
    </div>
  );
}

export default ChatbotPage;
