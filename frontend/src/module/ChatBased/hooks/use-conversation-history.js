import { useCallback, useState, useEffect } from "react";

const STORAGE_PREFIX = "chatbased_conversation_";

const normalizeMessages = (list) => {
  const normalized = [];
  const normalizeText = (value) => String(value || "").trim().toLowerCase();
  const isSameMessage = (a, b) => {
    if (!a || !b) return false;
    return (
      a.role === b.role &&
      normalizeText(a.text) === normalizeText(b.text) &&
      Boolean(a?.metadata?.isError) === Boolean(b?.metadata?.isError)
    );
  };

  for (const message of list || []) {
    const previous = normalized[normalized.length - 1];
    const isDuplicate =
      previous &&
      previous.role === message?.role &&
      normalizeText(previous.text) === normalizeText(message?.text) &&
      Boolean(previous?.metadata?.isStreaming) === Boolean(message?.metadata?.isStreaming) &&
      Boolean(previous?.metadata?.isError) === Boolean(message?.metadata?.isError);

    if (!isDuplicate) {
      normalized.push(message);

      // Collapse accidental duplicated turns: A,B,A,B -> A,B
      if (normalized.length >= 4) {
        const a1 = normalized[normalized.length - 4];
        const b1 = normalized[normalized.length - 3];
        const a2 = normalized[normalized.length - 2];
        const b2 = normalized[normalized.length - 1];

        if (isSameMessage(a1, a2) && isSameMessage(b1, b2)) {
          normalized.splice(normalized.length - 2, 2);
        }
      }
    }
  }

  return normalized;
};

export const useConversationHistory = (channelId) => {
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage when channel changes
  useEffect(() => {
    if (channelId) {
      const storageKey = `${STORAGE_PREFIX}${channelId}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = normalizeMessages(JSON.parse(stored));
          setMessages(parsed);
          localStorage.setItem(storageKey, JSON.stringify(parsed));
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
        const baseMessages = forceChannelId
          ? (() => {
              try {
                const stored = localStorage.getItem(
                  `${STORAGE_PREFIX}${targetChannelId}`
                );
                return stored ? normalizeMessages(JSON.parse(stored)) : [];
              } catch (error) {
                console.error("[ConversationHistory] Failed to read base:", error);
                return [];
              }
            })()
          : prev;
        const lastMessage = baseMessages[baseMessages.length - 1];
        const lastTimestamp = new Date(lastMessage?.timestamp || 0).getTime();
        const normalizedIncomingText = String(text || "").trim().toLowerCase();
        const normalizedLastText = String(lastMessage?.text || "").trim().toLowerCase();
        const isRapidDuplicate =
          lastMessage &&
          lastMessage.role === role &&
          normalizedLastText === normalizedIncomingText &&
          Date.now() - lastTimestamp < 5000;

        if (isRapidDuplicate) {
          return baseMessages;
        }
        const updated = normalizeMessages([...baseMessages, newMessage]);
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
    (messageId, updates, forceChannelId = null) => {
      const targetChannelId = forceChannelId || channelId;
      if (!targetChannelId) return;

      setMessages((prev) => {
        const baseMessages =
          forceChannelId && forceChannelId !== channelId
            ? (() => {
                try {
                  const stored = localStorage.getItem(
                    `${STORAGE_PREFIX}${targetChannelId}`
                  );
                  return stored ? normalizeMessages(JSON.parse(stored)) : [];
                } catch (error) {
                  console.error("[ConversationHistory] Failed to read update base:", error);
                  return [];
                }
              })()
            : prev;
        const updated = normalizeMessages(
          baseMessages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          )
        );
        const storageKey = `${STORAGE_PREFIX}${targetChannelId}`;
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (error) {
          console.error("[ConversationHistory] Failed to update:", error);
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
