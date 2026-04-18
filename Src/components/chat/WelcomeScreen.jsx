export default function WelcomeScreen({ onQuickStart }) {
  // NexusAI starters
  const starters = [
    "Build me a full working expense tracker app with charts",
    "Explain quantum computing like I'm 10, then like I'm a PhD",
    "Write a viral tweet thread about AI that'll get 10k likes",
    "What's happening in AI news right now?",
  ];

  return (
    <div className="apex-welcome">
      <div className="apex-welcome-icon">⚡</div>
      <h1 className="apex-welcome-title">ApexAI</h1>
      <p className="apex-welcome-desc">
        Every AI's best ability fused into one. Smarter writing, deeper reasoning, better code, real-time answers — completely free.
      </p>
      <div className="apex-traits">
        {["🧠 Deep reasoning", "✍️ Expert writing", "💻 Full-stack code", "🔍 Web search", "🖼️ Image analysis", "🛠️ App builder"].map(t => (
          <span key={t} className="apex-trait">{t}</span>
        ))}
      </div>
      <div className="apex-starters">
        {starters.map(s => (
          <button key={s} className="apex-starter" onClick={() => onQuickStart(s)}>{s}</button>
        ))}
      </div>
    </div>
  );
}
