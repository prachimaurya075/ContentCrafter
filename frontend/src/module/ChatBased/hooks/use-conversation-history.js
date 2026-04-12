import { useCallback, useState, useEffect } from "react";

const STORAGE_PREFIX = "chatbased_conversation_";

export const useConversationHistory = (channelId) => {
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage when channel changes
  useEffect(() => {
    if (channelId) {
      const storageKey = `${STORAGE_PREFIX}${channelId}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed);
          console.log(`[ConversationHistory] Loaded ${parsed.length} messages`);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("[ConversationHistory] Failed to load:", error);
        setMessages([]);
      }
    }
  }, [channelId]);

  const addMessage = useCallback(
    (text, role = "user", metadata = {}, forceChannelId = null) => {
      const targetChannelId = forceChannelId || channelId;
      if (!targetChannelId) return;

      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text,
        role,
        timestamp: new Date().toISOString(),
        ...metadata,
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        const storageKey = `${STORAGE_PREFIX}${targetChannelId}`;
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (error) {
          console.error("[ConversationHistory] Failed to save:", error);
        }
        return updated;
      });

      return newMessage;
    },
    [channelId]
  );

  const updateMessage = useCallback(
    (messageId, updates) => {
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
        if (channelId) {
          const storageKey = `${STORAGE_PREFIX}${channelId}`;
          try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          } catch (error) {
            console.error("[ConversationHistory] Failed to update:", error);
          }
        }
        return updated;
      });
    },
    [channelId]
  );

  const clearHistory = useCallback(() => {
    if (channelId) {
      const storageKey = `${STORAGE_PREFIX}${channelId}`;
      try {
        localStorage.removeItem(storageKey);
        setMessages([]);
      } catch (error) {
        console.error("[ConversationHistory] Failed to clear:", error);
      }
    }
  }, [channelId]);

  const getConversationContext = useCallback(() => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role,
        content: m.text,
      }));
  }, [messages]);

  return {
    messages,
    addMessage,
    updateMessage,
    clearHistory,
    getConversationContext,
  };
};
