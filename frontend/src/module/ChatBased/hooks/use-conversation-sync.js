import { useCallback } from "react";

const STORAGE_PREFIX = "chatbased_conversation_";
const CONVERSATIONS_KEY = "chatbased_conversations";

export const useConversationSync = () => {
  const updateConversationPreview = useCallback((channelId, messages) => {
    try {
      const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || "[]");
      const conversationIndex = conversations.findIndex((c) => c.id === channelId);

      if (conversationIndex !== -1 && messages.length > 0) {
        // Get the first user message for the preview
        const firstUserMessage = messages.find((m) => m.role === "user");
        const preview = firstUserMessage
          ? firstUserMessage.text.substring(0, 60) + (firstUserMessage.text.length > 60 ? "..." : "")
          : "New Conversation";

        conversations[conversationIndex] = {
          ...conversations[conversationIndex],
          title: preview,
          lastUpdated: new Date().toISOString(),
          messageCount: messages.length,
        };

        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
        
        // Dispatch custom event for same-window updates
        window.dispatchEvent(new Event("conversationsUpdated"));
      }
    } catch (error) {
      console.error("[ConversationSync] Failed to update preview:", error);
    }
  }, []);

  const getConversationMessages = useCallback((channelId) => {
    try {
      const storageKey = `${STORAGE_PREFIX}${channelId}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("[ConversationSync] Failed to load messages:", error);
      return [];
    }
  }, []);

  return {
    updateConversationPreview,
    getConversationMessages,
  };
};

