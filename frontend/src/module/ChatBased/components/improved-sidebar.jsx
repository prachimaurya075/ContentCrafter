import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  History,
  MessageSquare,
  Pin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

export const ImprovedSidebar = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectChannel,
  currentUser,
  onInsertComposerText,
}) => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [showRecentsPanel, setShowRecentsPanel] = useState(true);

  useEffect(() => {
    const loadConversations = () => {
      const stored = localStorage.getItem("chatbased_conversations");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setConversations(
            parsed.sort((a, b) => {
              if (Boolean(a.pinned) !== Boolean(b.pinned)) {
                return a.pinned ? -1 : 1;
              }
              return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            })
          );
        } catch (error) {
          console.error("[ImprovedSidebar] Load error:", error);
        }
      }
    };

    loadConversations();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "chatbased_conversations") {
        loadConversations();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events to handle same-window updates
    const handleCustomUpdate = () => {
      loadConversations();
    };
    
    window.addEventListener("conversationsUpdated", handleCustomUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("conversationsUpdated", handleCustomUpdate);
    };
  }, []);

  useEffect(() => {
    const syncRecent = () => {
      try {
        const searches = JSON.parse(
          localStorage.getItem("chat_recent_searches") || "[]"
        );
        const prompts = JSON.parse(
          localStorage.getItem("chat_recent_prompts") || "[]"
        );
        setRecentSearches(searches.slice(0, 5));
        setRecentPrompts(prompts.slice(0, 5));
      } catch (error) {
        console.error("Unable to load recent items", error);
      }
    };

    syncRecent();
    window.addEventListener("chatRecentUpdated", syncRecent);
    window.addEventListener("storage", syncRecent);
    return () => {
      window.removeEventListener("chatRecentUpdated", syncRecent);
      window.removeEventListener("storage", syncRecent);
    };
  }, []);

  const handleNewChat = () => {
    onNewChat();
    setSelectedId(null);
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedId(conversationId);
    onSelectChannel(conversationId);
  };

  const sortConversations = (list) =>
    [...list].sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) {
        return a.pinned ? -1 : 1;
      }
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });

  const persistConversations = (updated) => {
    const sorted = sortConversations(updated);
    setConversations(sorted);
    localStorage.setItem("chatbased_conversations", JSON.stringify(sorted));
    window.dispatchEvent(new Event("conversationsUpdated"));
    return sorted;
  };

  const safeClipboardWriteText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_error) {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.top = "-1000px";
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        return ok;
      } catch (fallbackError) {
        console.error("[ImprovedSidebar] Clipboard copy failed:", fallbackError);
        return false;
      }
    }
  };

  const handlePinConversation = (e, conversationId) => {
    e.stopPropagation();
    persistConversations(
      conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              pinned: !c.pinned,
              lastUpdated: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== conversationId);
    persistConversations(updated);
    localStorage.removeItem(`chatbased_conversation_${conversationId}`);
    
    if (selectedId === conversationId) {
      if (updated.length > 0) {
        // Select the first remaining conversation
        const nextId = updated[0].id;
        setSelectedId(nextId);
        onSelectChannel(nextId);
      } else {
        // No conversations left, create a new one
        setSelectedId(null);
        onNewChat();
      }
    }
  };

  const handleShareConversation = async (e, conversation) => {
    e.stopPropagation();

    let messages = [];
    try {
      const raw = localStorage.getItem(`chatbased_conversation_${conversation.id}`);
      messages = raw ? JSON.parse(raw) : [];
    } catch (_error) {
      messages = [];
    }

    const title = conversation.title || "New Conversation";
    const transcript = (messages || [])
      .map((m) => {
        const who = m?.role === "user" ? "User" : "Assistant";
        const text = (m?.text || "").trim();
        if (!text) return null;
        return `${who}: ${text}`;
      })
      .filter(Boolean)
      .join("\n\n");

    const shareText = transcript ? `${title}\n\n${transcript}` : title;
    await safeClipboardWriteText(shareText);
  };

  const filteredConversations = conversations.filter((conversation) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const title = (conversation.title || "").toLowerCase();
    if (title.includes(query)) return true;

    try {
      const raw = localStorage.getItem(`chatbased_conversation_${conversation.id}`);
      if (!raw) return false;
      const msgs = JSON.parse(raw);
      return msgs.some((msg) => (msg.text || "").toLowerCase().includes(query));
    } catch (_error) {
      return false;
    }
  });

  const renderConversationRow = (conversation) => (
    <div
      key={conversation.id}
      className="relative group rounded-lg border border-transparent hover:border-blue-500/20"
    >
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          onClick={() => handleSelectConversation(conversation.id)}
          className={cn(
            "flex-1 text-left rounded-md px-2 py-2 transition-all duration-200",
            selectedId === conversation.id
              ? "bg-linear-to-r from-blue-500/20 to-teal-500/20 border-l border-l-blue-400/50 text-white"
              : "text-gray-300 hover:bg-blue-500/10 border-l border-l-transparent hover:border-l-blue-500/20"
          )}
          title={conversation.title}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {conversation.title || "New Conversation"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {conversation.messageCount
                  ? `${conversation.messageCount} messages`
                  : "No messages"}
                {" • "}
                {formatDate(conversation.lastUpdated)}
              </p>
            </div>
            {conversation.pinned && (
              <Pin className="mt-0.5 h-3.5 w-3.5 text-blue-300" />
            )}
          </div>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
          onClick={(e) => handleDeleteConversation(e, conversation.id)}
          title="Delete conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-blue-500/10 z-40 transition-transform duration-300 lg:relative flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-500/10 bg-linear-to-r from-blue-500/5 to-teal-500/5">
          <h2 className="text-lg font-semibold bg-linear-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">Conversations</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="lg:hidden hover:bg-blue-500/10 text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={handleNewChat}
          className="m-4 bg-linear-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>

        <div className="px-4 pb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history and messages"
              className="w-full rounded-lg border border-blue-500/20 bg-[#171717] py-2 pl-9 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-strong px-2 pb-2 pr-1">
          <div className="space-y-1.5">
            {(recentSearches.length > 0 || recentPrompts.length > 0) && showRecentsPanel && (
              <div className="mb-2 space-y-3 rounded-lg border border-blue-500/15 bg-blue-500/5 p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">Quick Recents</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-gray-400"
                    onClick={() => setShowRecentsPanel(false)}
                  >
                    Hide
                  </Button>
                </div>
                {recentSearches.length > 0 && (
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                      <Search className="h-3 w-3" />
                      Recent Searches
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => onInsertComposerText?.(item)}
                          className="w-full truncate rounded px-2 py-1 text-left text-xs text-gray-300 hover:bg-blue-500/10"
                          title="Insert in composer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {recentPrompts.length > 0 && (
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                      <Clock3 className="h-3 w-3" />
                      Recent Prompts
                    </div>
                    <div className="space-y-1">
                      {recentPrompts.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => onInsertComposerText?.(item)}
                          className="w-full truncate rounded px-2 py-1 text-left text-xs text-gray-300 hover:bg-blue-500/10"
                          title="Insert in composer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!showRecentsPanel && (recentSearches.length > 0 || recentPrompts.length > 0) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mb-2 h-7 w-full justify-start text-xs text-gray-400"
                onClick={() => setShowRecentsPanel(true)}
              >
                <History className="mr-2 h-3.5 w-3.5" />
                Show Recents
              </Button>
            )}

            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-gray-300 hover:bg-blue-500/10"
            >
              <span className="flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                History
              </span>
              {showHistory ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            {showHistory && filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-blue-500/30 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {searchQuery ? "No matching history found" : "No conversations yet"}
                </p>
              </div>
            ) : (
              showHistory && filteredConversations.map(renderConversationRow)
            )}

            {/* Archived section removed per design – only active history is shown */}
          </div>
        </div>

        <div className="border-t border-blue-500/10 bg-linear-to-r from-blue-500/5 to-teal-500/5 p-4 space-y-2">
          <div className="text-xs text-gray-500">Signed in as</div>
          <div className="text-sm font-medium text-blue-300">
            {currentUser?.email || currentUser?.name || "User"}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
    </>
  );
};

export default ImprovedSidebar;
