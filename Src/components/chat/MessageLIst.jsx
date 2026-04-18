import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

function TypingIndicator() {
  return (
    <div className="apex-message apex-msg-ai">
      <div className="apex-avatar">⚡</div>
      <div className="apex-ai-body">
        <div className="apex-typing">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function UserMessage({ text, img }) {
  return (
    <div className="apex-message apex-msg-user">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, maxWidth: "72%" }}>
        {img && (
          <img
            src={`data:${img.mediaType};base64,${img.data}`}
            style={{ maxHeight: 110, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}
            alt="uploaded"
          />
        )}
        {text && <div className="apex-bubble-user">{text}</div>}
      </div>
    </div>
  );
}

function AIMessage({ text, error }) {
  if (error) {
    return (
      <div className="apex-message apex-msg-ai">
        <div className="apex-avatar">⚡</div>
        <div className="apex-ai-body">
          <div className="apex-err">⚠️ {error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="apex-message apex-msg-ai">
      <div className="apex-avatar">⚡</div>
      <div className="apex-ai-body">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages.map((msg, i) => {
        if (msg.role === "user") return <UserMessage key={i} text={msg.text} img={msg.img} />;
        if (msg.typing) return <TypingIndicator key={i} />;
        return <AIMessage key={i} text={msg.text} error={msg.error} />;
      })}
      <div ref={bottomRef} />
    </>
  );
}
