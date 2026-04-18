import { useRef } from "react";

export default function InputSection({ input, setInput, imgData, setImgData, onSend, busy, onClear }) {
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const loadImg = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      setImgData({ data: ev.target.result.split(",")[1], mediaType: f.type });
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const clearImg = () => setImgData(null);

  return (
    <div className="apex-input-section">
      <div className="apex-input-box">
        <div className="apex-input-left">
          {imgData && (
            <div className="apex-img-preview-wrap">
              <img src={`data:${imgData.mediaType};base64,${imgData.data}`} alt="preview" />
              <button onClick={clearImg}>✕</button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Ask anything. No limits."
            rows={1}
          />
        </div>
        <div className="apex-btns">
          <button className="apex-icon-btn" title="Upload image" onClick={() => fileRef.current.click()}>🖼️</button>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={loadImg} />
          <button className="apex-icon-btn" title="Clear chat" onClick={onClear}>🗑️</button>
          <button
            className="apex-send-btn"
            onClick={() => onSend(input)}
            disabled={busy || (!input.trim() && !imgData)}
          >
            ➤
          </button>
        </div>
      </div>
      <div className="apex-hint-row">Enter to send · Shift+Enter for new line · Upload images for analysis</div>
    </div>
  );
}
