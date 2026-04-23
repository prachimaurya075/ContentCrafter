import React, { useState, useRef, useEffect, useMemo } from "react";
import { useConversationHistory } from "../hooks/use-conversation-history";
import { useConversationSync } from "../hooks/use-conversation-sync";
import { ImprovedChatMessage } from "./improved-message";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  SidebarOpen,
  Trash2,
  SendHorizontal,
  AlertCircle,
  MoreVertical,
  Pin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const ImprovedChatInterface = ({
  channelId,
  onNewChat,
  onToggleSidebar,
  onBack,
  backendUrl,
  currentUser,
  onChannelCreated,
  inputText,
  onInputTextChange,
  onPinActiveChat,
  onArchiveActiveChat,
  onDeleteActiveChat,
}) => {
  const { messages, addMessage, updateMessage, clearHistory, getConversationContext } =
    useConversationHistory(channelId);
  const { updateConversationPreview } = useConversationSync();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingChannelId, setPendingChannelId] = useState(null);
  const sendLockRef = useRef(false);
  const lastSubmissionRef = useRef({ prompt: "", timestamp: 0 });
  const activeSubmissionKeysRef = useRef(new Set());
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const dedupedMessages = useMemo(() => {
    const normalizeText = (value) => String(value || "").trim().toLowerCase();
    const out = [];

    for (const msg of messages) {
      const prev = out[out.length - 1];
      const sameAsPrev =
        prev &&
        prev.role === msg.role &&
        normalizeText(prev.text) === normalizeText(msg.text) &&
        Boolean(prev.isError) === Boolean(msg.isError);

      if (sameAsPrev) {
        continue;
      }

      out.push(msg);

      // Remove repeated turn patterns: user+assistant,user+assistant
      if (out.length >= 4) {
        const a1 = out[out.length - 4];
        const b1 = out[out.length - 3];
        const a2 = out[out.length - 2];
        const b2 = out[out.length - 1];
        const repeatedTurn =
          a1.role === a2.role &&
          b1.role === b2.role &&
          normalizeText(a1.text) === normalizeText(a2.text) &&
          normalizeText(b1.text) === normalizeText(b2.text);

        if (repeatedTurn) {
          out.splice(out.length - 2, 2);
        }
      }
    }

    return out;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (channelId && dedupedMessages.length > 0) {
      updateConversationPreview(channelId, dedupedMessages);
    }
  }, [channelId, dedupedMessages, updateConversationPreview]);

  useEffect(() => {
    if (channelId && pendingChannelId === channelId) {
      setPendingChannelId(null);
    }
  }, [channelId, pendingChannelId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [inputText]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        onToggleSidebar?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggleSidebar]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || sendLockRef.current) return;

    const normalizedPrompt = inputText.trim();
    const now = Date.now();
    const isImmediateDuplicate =
      lastSubmissionRef.current.prompt === normalizedPrompt &&
      now - lastSubmissionRef.current.timestamp < 4000;

    if (isImmediateDuplicate) {
      return;
    }

    lastSubmissionRef.current = {
      prompt: normalizedPrompt,
      timestamp: now,
    };

    sendLockRef.current = true;

    let effectiveChannelId = channelId || pendingChannelId;
    if (!effectiveChannelId) {
      effectiveChannelId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      if (onChannelCreated) {
        const createdChannelId = onChannelCreated(effectiveChannelId);
        if (createdChannelId) {
          effectiveChannelId = createdChannelId;
        }
      }
    }

    const userMessage = normalizedPrompt;
    const submissionKey = `${effectiveChannelId}::${userMessage.toLowerCase()}`;

    if (activeSubmissionKeysRef.current.has(submissionKey)) {
      sendLockRef.current = false;
      return;
    }

    activeSubmissionKeysRef.current.add(submissionKey);

    onInputTextChange("");
    setError(null);

    try {
      setIsLoading(true);

      const userMsg = addMessage(userMessage, "user", {}, effectiveChannelId);
      const assistantMsg = addMessage("", "assistant", { isStreaming: true }, effectiveChannelId);

      if (!userMsg?.id || !assistantMsg?.id) {
        throw new Error("Failed to create messages");
      }

      const response = await fetch(`${backendUrl}/api/v1/chat/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: effectiveChannelId,
          message: userMessage,
          conversation_history: getConversationContext(),
          user_id: currentUser?.id,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          return;
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        updateMessage(assistantMsg.id, {
          text: fullResponse,
          isStreaming: false,
        }, effectiveChannelId);
      }
    } catch (err) {
      console.error("[ImprovedChat] Error:", err);
      setError(err.message || "Failed to send message");
      addMessage(
        err.message || "Error getting response",
        "assistant",
        { isError: true },
        effectiveChannelId
      );
    } finally {
      setIsLoading(false);
      sendLockRef.current = false;
      activeSubmissionKeysRef.current.delete(submissionKey);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const isEmpty = dedupedMessages.length === 0;

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#0f0f0f] to-[#1a1a1a]">
      <div className="shrink-0 flex items-center justify-between px-4 py-4 border-b border-blue-500/10 bg-linear-to-r from-blue-500/5 to-teal-500/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onBack}
              className="hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleSidebar}
            className="hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <SidebarOpen className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-semibold bg-linear-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              AI Content Assistant
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">How can I help?</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              const newChannelId = onNewChat?.();
              if (newChannelId) {
                setPendingChannelId(newChannelId);
              }
              toast.success("Started a new chat.");
            }}
            className="hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onPinActiveChat}>
                <Pin className="mr-2 h-4 w-4" />
                Pin chat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDeleteActiveChat}
                className="text-red-400 focus:text-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            x
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-strong">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold bg-linear-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text mb-1">
                How can I help?
              </h2>
              <p className="text-gray-300 text-sm max-w-xl">
                Generate high-quality content instantly - blogs, captions, emails, scripts, and more.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                What would you like to create today?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-6">
              {[
                {
                  label: "1. Blog Generator",
                  description: "Write a complete blog post in seconds.",
                  prompt:
                    "Blog on AI in healthcare",
                },
                {
                  label: "2. Social Media Posts",
                  description: "Create captions, hashtags & viral posts.",
                  prompt:
                    "Create a LinkedIn post about ___",
                },
                {
                  label: "3. Script & Story Writer",
                  description: "Generate engaging scripts with hooks.",
                  prompt:
                    "Reel script for motivation",
                },
                {
                  label: "4. Content Improver",
                  description: "Rewrite, fix grammar & make it better.",
                  prompt:
                    "Improve this paragraph",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onInputTextChange(item.prompt)}
                  className="text-left p-3 rounded-lg border border-blue-500/20 bg-linear-to-r from-blue-500/5 to-teal-500/5 hover:from-blue-500/15 hover:to-teal-500/15 text-sm text-gray-300 hover:text-blue-300 hover:border-blue-400/40 transition-all duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-[14px]">{item.label}</span>
                    {item.description && (
                      <p className="text-[12px] text-gray-400">{item.description}</p>
                    )}
                    <p className="text-[11px] text-blue-300/90">e.g., "{item.prompt}"</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 py-4 px-2">
            {dedupedMessages.map((msg) => (
              <ImprovedChatMessage
                key={msg.id}
                message={msg}
                isStreaming={msg.metadata?.isStreaming}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 py-4 px-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-teal-500 rounded flex items-center justify-center shrink-0 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="shrink-0 px-4 py-3 border-t border-blue-500/10 bg-linear-to-r from-blue-500/5 to-teal-500/5 backdrop-blur-sm"
      >
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => onInputTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your content idea... (e.g., Instagram caption for travel, blog on AI, email for internship)"
            disabled={isLoading}
            className="min-h-11 max-h-30 w-full resize-none rounded-lg bg-[#1a1a1a] border border-blue-500/20 focus:border-blue-400/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none disabled:opacity-50 p-3 transition-all"
            style={{ fontFamily: "inherit" }}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="shrink-0 bg-linear-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-lg px-4 py-2 font-medium shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center px-1 mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
          <p className="text-xs text-gray-500">
            {dedupedMessages.length} message{dedupedMessages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </form>
    </div>
  );
};

export default ImprovedChatInterface;
