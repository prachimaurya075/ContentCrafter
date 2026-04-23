import React, { useState, useEffect } from "react";
import { ImprovedChatInterface } from "./components/chat-interface";
import { ImprovedSidebar } from "./components/improved-sidebar";
import { ThemeProvider } from "./providers/theme-provider";
import { v4 as uuidv4 } from "uuid";

const sortConversations = (list) =>
  [...list].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }

    return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
  });

const normalizeConversations = (list) => {
  const byId = new Map();

  for (const conversation of list) {
    if (!conversation?.id) continue;
    byId.set(conversation.id, {
      ...byId.get(conversation.id),
      ...conversation,
    });
  }

  return sortConversations(Array.from(byId.values()));
};

const ImprovedChatBasedModule = ({ user, onClose, onBack }) => {
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!user) {
    return null;
  }

  // Load first conversation on mount
  useEffect(() => {
    if (!activeChannelId) {
      const stored = localStorage.getItem("chatbased_conversations");
      if (stored) {
        try {
          const parsed = normalizeConversations(JSON.parse(stored));
          if (parsed.length > 0) {
            setActiveChannelId(parsed[0].id);
          }
        } catch (error) {
          console.error("[ImprovedChatBasedModule] Load error:", error);
        }
      }
    }
  }, []);

  const handleNewChat = () => {
    const newChannelId = `ch_${uuidv4()}`;
    setActiveChannelId(newChannelId);
    setInputText("");
    
    // Save to conversations list
    const conversations = normalizeConversations(
      JSON.parse(localStorage.getItem("chatbased_conversations") || "[]")
    );
    const newConversation = {
      id: newChannelId,
      title: "New Conversation",
      lastUpdated: new Date().toISOString(),
    };
    const updated = normalizeConversations([newConversation, ...conversations]);
    localStorage.setItem("chatbased_conversations", JSON.stringify(updated));
    window.dispatchEvent(new Event("conversationsUpdated"));
    return newChannelId;
  };

  const handleChannelCreated = (channelId) => {
    setActiveChannelId(channelId);
    
    // Save to conversations list
    const conversations = normalizeConversations(
      JSON.parse(localStorage.getItem("chatbased_conversations") || "[]")
    );
    const newConversation = {
      id: channelId,
      title: "New Conversation",
      lastUpdated: new Date().toISOString(),
    };
    const updated = normalizeConversations([newConversation, ...conversations]);
    localStorage.setItem("chatbased_conversations", JSON.stringify(updated));
    window.dispatchEvent(new Event("conversationsUpdated"));
    return channelId;
  };

  const handleChannelSelect = (channelId) => {
    setActiveChannelId(channelId);
    setSidebarOpen(false);
  };

  const handleInsertFromSidebar = (text) => {
    if (!text?.trim()) return;
    setInputText((prev) => {
      const prefix = prev.trim() ? `${prev.trim()} ` : "";
      return `${prefix}${text.trim()}`;
    });
  };

  const updateConversationList = (updater) => {
    const conversations = normalizeConversations(JSON.parse(
      localStorage.getItem("chatbased_conversations") || "[]"
    ));
    const updated = updater(conversations);
    const normalized = normalizeConversations(updated);
    localStorage.setItem("chatbased_conversations", JSON.stringify(normalized));
    window.dispatchEvent(new Event("conversationsUpdated"));
    return normalized;
  };

  const handlePinActiveChat = () => {
    if (!activeChannelId) return;
    updateConversationList((conversations) =>
      conversations.map((conversation) =>
        conversation.id === activeChannelId
          ? {
              ...conversation,
              pinned: !conversation.pinned,
              lastUpdated: new Date().toISOString(),
            }
          : conversation
      )
    );
  };

  const handleArchiveActiveChat = () => {
    if (!activeChannelId) return;
    const updated = updateConversationList((conversations) =>
      conversations.map((conversation) =>
        conversation.id === activeChannelId
          ? {
              ...conversation,
              archived: true,
              pinned: false,
              lastUpdated: new Date().toISOString(),
            }
          : conversation
      )
    );

    const next = updated.find((conversation) => !conversation.archived);
    setActiveChannelId(next?.id || null);
  };

  const handleDeleteActiveChat = () => {
    if (!activeChannelId) return;

    const deletedId = activeChannelId;
    const updated = updateConversationList((conversations) =>
      conversations.filter((conversation) => conversation.id !== deletedId)
    );
    localStorage.removeItem(`chatbased_conversation_${deletedId}`);

    const next = updated.find((conversation) => !conversation.archived);
    setActiveChannelId(next?.id || null);
    setInputText("");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="fixed inset-0 bg-gray-900 z-50 flex overflow-hidden">
        {sidebarOpen && (
          <ImprovedSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onNewChat={handleNewChat}
            onSelectChannel={handleChannelSelect}
            currentUser={user}
            onInsertComposerText={handleInsertFromSidebar}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <ImprovedChatInterface
            channelId={activeChannelId}
            onNewChat={handleNewChat}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onBack={onBack}
            backendUrl={backendUrl}
            currentUser={user}
            onChannelCreated={handleChannelCreated}
            inputText={inputText}
            onInputTextChange={setInputText}
            onPinActiveChat={handlePinActiveChat}
            onArchiveActiveChat={handleArchiveActiveChat}
            onDeleteActiveChat={handleDeleteActiveChat}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ImprovedChatBasedModule;
