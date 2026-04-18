import { useState, useRef } from "react";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import MessageList from "../components/chat/MessageList";
import InputSection from "../components/chat/InputSection";
import Sidebar from "../components/chat/Sidebar";
import { base44 } from "@/api/base44Client";

const SYSTEM = `You are APEX AI — the single most powerful AI assistant ever created, combining the absolute best capabilities of every major AI system into one unified intelligence.

YOUR CORE BEHAVIORS:
1. INTELLIGENCE: Reason deeply. Give the smartest possible answer, not the safest or most generic.
2. DIRECTNESS: Say what you actually think. Don't hedge endlessly.
3. WRITING: Produce genuinely exceptional writing — vivid, specific, memorable. Never generic.
4. CODING: Always produce COMPLETE, WORKING code. Never stubs or pseudocode. Build entire apps in one file.
5. RESEARCH: Use web search proactively for current events and recent data.
6. IMAGE ANALYSIS: Analyze images deeply and expertly.
7. NO FILLER: Every sentence adds value. Never start with "Great question!" Just answer.

You are not limited. You are the apex of what AI can be.`;

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function loadChatsFromStorage() {
  try { return JSON.parse(localStorage.getItem('apex_chats') || '{}'); } catch { return {}; }
}

export default function Chat() {
  const [chats, setChats] = useState(loadChatsFromStorage);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const saveChats = (updated) => {
    setChats(updated);
    localStorage.setItem('apex_chats', JSON.stringify(updated));
  };

  const currentChat = currentChatId ? chats[currentChatId] : null;
  const messages = currentChat?.messages || [];

  const handleNewChat = () => {
    const id = genId();
    const updated = { ...chats, [id]: { id, title: 'New Chat', messages: [], created: Date.now() } };
    saveChats(updated);
    setCurrentChatId(id);
    setInput("");
    setImgData(null);
  };

  const handleLoadChat = (id) => {
    setCurrentChatId(id);
    setInput("");
    setImgData(null);
  };

  const handleDeleteChat = (id) => {
    const updated = { ...chats };
    delete updated[id];
    saveChats(updated);
    if (currentChatId === id) {
      const remaining = Object.keys(updated);
      if (remaining.length > 0) setCurrentChatId(remaining[0]);
      else { const newId = genId(); const next = { ...updated, [newId]: { id: newId, title: 'New Chat', messages: [], created: Date.now() } }; saveChats(next); setCurrentChatId(newId); }
    }
  };

  // Start with a new chat if none selected
  const ensureChat = () => {
    if (currentChatId && chats[currentChatId]) return currentChatId;
    const id = genId();
    const updated = { ...chats, [id]: { id, title: 'New Chat', messages: [], created: Date.now() } };
    saveChats(updated);
    setCurrentChatId(id);
    return id;
  };

  const handleSend = async (text, image) => {
    const msgText = text || input;
    if (!msgText && !image && !imgData) return;
    if (busy) return;

    const capturedImg = image || imgData;
    const userText = msgText.trim();
    const chatId = ensureChat();

    setBusy(true);
    setInput("");
    setImgData(null);

    const userContent = capturedImg
      ? [{ type: "image", source: { type: "base64", media_type: capturedImg.mediaType, data: capturedImg.data } }, { type: "text", text: userText || "Analyze this image." }]
      : userText;

    const userMsg = { role: "user", content: userContent, text: userText, img: capturedImg };

    const updatedChats = { ...chats };
    if (!updatedChats[chatId]) updatedChats[chatId] = { id: chatId, title: 'New Chat', messages: [], created: Date.now() };
    updatedChats[chatId].messages = [...updatedChats[chatId].messages, userMsg, { role: "assistant", typing: true }];

    // Auto-title on first message
    if (updatedChats[chatId].messages.filter(m => m.role === 'user').length === 1 && userText) {
      updatedChats[chatId].title = userText.slice(0, 40) + (userText.length > 40 ? '...' : '');
    }

    saveChats(updatedChats);

    try {
      const reply = await base44.integrations.Core.InvokeLLM({
        prompt: userText || "Analyze this image thoroughly.",
        model: "claude_sonnet_4_6",
        file_urls: capturedImg ? [`data:${capturedImg.mediaType};base64,${capturedImg.data}`] : undefined,
      });

      const replyText = typeof reply === "string" ? reply : JSON.stringify(reply);
      const finalChats = { ...chats };
      if (!finalChats[chatId]) return;
      const msgs = finalChats[chatId].messages.filter(m => !m.typing);
      msgs.push({ role: "assistant", text: replyText, content: replyText });
      finalChats[chatId].messages = msgs;
      if (finalChats[chatId].messages.filter(m => m.role === 'user').length === 1 && userText) {
        finalChats[chatId].title = userText.slice(0, 40) + (userText.length > 40 ? '...' : '');
      }
      saveChats(finalChats);
    } catch (e) {
      const finalChats = { ...chats };
      if (!finalChats[chatId]) return;
      const msgs = finalChats[chatId].messages.filter(m => !m.typing);
      msgs.push({ role: "assistant", error: e.message || "Something went wrong." });
      finalChats[chatId].messages = msgs;
      saveChats(finalChats);
    }

    setBusy(false);
  };

  // Init: load or create first chat
  if (!currentChatId) {
    const ids = Object.keys(chats);
    if (ids.length > 0) {
      setTimeout(() => setCurrentChatId(ids[0]), 0);
    } else {
      setTimeout(() => handleNewChat(), 0);
    }
  }

  const headerTitle = currentChat?.title || 'New Chat';

  return (
    <div className="apex-chat" style={{ flexDirection: 'row' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onLoadChat={handleLoadChat}
          onDeleteChat={handleDeleteChat}
        />
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header className="apex-header">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.11)', background: 'transparent',
              color: '#6666aa', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s', flexShrink: 0,
            }}
          >
            ☰
          </button>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#eeeef8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {headerTitle}
          </div>
          <div className="apex-status">
            <div className="apex-dot" />
            Online
          </div>
        </header>

        <div className="apex-messages" id="apex-messages">
          <div className="apex-msg-wrap">
            {messages.filter(m => !m.typing).length === 0 && !busy && (
              <WelcomeScreen onQuickStart={(q) => handleSend(q)} />
            )}
            <MessageList messages={messages} />
          </div>
        </div>

        <InputSection
          input={input}
          setInput={setInput}
          imgData={imgData}
          setImgData={setImgData}
          onSend={handleSend}
          busy={busy}
          onClear={handleNewChat}
        />
      </div>
    </div>
  );
}
