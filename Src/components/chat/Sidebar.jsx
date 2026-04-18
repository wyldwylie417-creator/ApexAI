import { useState } from "react";

export default function Sidebar({ chats, currentChatId, onNewChat, onLoadChat, onDeleteChat }) {
  const sorted = Object.values(chats).sort((a, b) => b.created - a.created);

  return (
    <div id="sidebar" style={{
      width: 260,
      background: '#0f0f1a',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
    }}>
      <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="apex-logo" style={{ fontSize: 15 }}>⚡ Apex AI</div>
        <button
          onClick={onNewChat}
          style={{
            width: '100%', padding: '9px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.11)', background: '#16162a',
            color: '#eeeef8', fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.color = '#a78bfa'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = '#eeeef8'; }}
        >
          ✏️ New Chat
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {sorted.length === 0 ? (
          <div style={{ fontSize: 12, color: '#6666aa', padding: '12px 8px', textAlign: 'center' }}>No chats yet</div>
        ) : (
          <>
            <div style={{ fontSize: 10, color: '#6666aa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px', fontWeight: 600 }}>Recent</div>
            {sorted.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                active={chat.id === currentChatId}
                onLoad={onLoadChat}
                onDelete={onDeleteChat}
              />
            ))}
          </>
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#6666aa', textAlign: 'center' }}>
        🔒 Next-gen AI · Always free
      </div>
    </div>
  );
}

function ChatItem({ chat, active, onLoad, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onLoad(chat.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 10px', borderRadius: 9, cursor: 'pointer', gap: 8,
        background: active ? '#1e1e35' : hovered ? '#16162a' : 'transparent',
        border: active ? '1px solid rgba(255,255,255,0.11)' : '1px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        flex: 1, fontSize: 13,
        color: active || hovered ? '#eeeef8' : '#6666aa',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        💬 {chat.title}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
        style={{
          background: 'transparent', border: 'none', color: '#6666aa',
          cursor: 'pointer', fontSize: 12, padding: '2px 4px', borderRadius: 4,
          opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f76a6a'}
        onMouseLeave={e => e.currentTarget.style.color = '#6666aa'}
      >
        ✕
      </button>
    </div>
  );
}
