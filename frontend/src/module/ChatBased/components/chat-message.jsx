import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, Check, Copy, Download, ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  useAIState,
  useChannelStateContext,
  useMessageContext,
  useMessageTextStreaming,
} from "stream-chat-react";

/**
 * Clean and prepare message text for markdown rendering
 * Removes extra formatting artifacts and normalizes the text
 */
const cleanMessageText = (text) => {
  if (!text) return "";
  
  // Replace HTML entities if present
  let cleaned = text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
  
  return cleaned;
};

const ChatMessage = () => {
  const { message } = useMessageContext();
  const { channel } = useChannelStateContext();
  const { aiState } = useAIState(channel);

  const { streamedMessageText } = useMessageTextStreaming({
    text: message.text ?? "",
    renderingLetterCount: 10,
    streamingLetterIntervalMs: 50,
  });

  const isUser = !message.user?.id?.startsWith("ai-bot");
  const [copied, setCopied] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const copyToClipboard = async () => {
    if (streamedMessageText) {
      await navigator.clipboard.writeText(streamedMessageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResponse = () => {
    const responseText = displayText || "";
    if (!responseText.trim()) return;

    const blob = new Blob([responseText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `response-${message.id || Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveFeedback = () => {
    if (!feedbackType) return;

    const storageKey = "chat_response_feedback";
    const payload = {
      id: message.id,
      type: feedbackType,
      text: feedbackText.trim(),
      createdAt: new Date().toISOString(),
      content: (displayText || "").slice(0, 500),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const filtered = existing.filter((item) => item.id !== message.id);
      localStorage.setItem(storageKey, JSON.stringify([payload, ...filtered]));
      setFeedbackSaved(true);
      setTimeout(() => setFeedbackSaved(false), 1800);
    } catch (error) {
      console.error("Unable to save feedback", error);
    }
  };

  const getAiStateMessage = () => {
    switch (aiState) {
      case "AI_STATE_THINKING":
        return "Thinking...";
      case "AI_STATE_GENERATING":
        return "Generating response...";
      case "AI_STATE_EXTERNAL_SOURCES":
        return "Accessing external sources...";
      case "AI_STATE_ERROR":
        return "An error occurred.";
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Clean the message text
  const displayText = cleanMessageText(streamedMessageText || message.text || "");

  return (
    <div
      className={cn(
        "flex w-full mb-4 px-4 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[70%] sm:max-w-[60%] lg:max-w-[50%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="shrink-0 mr-3 self-end">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Message Content */}
        <div className="flex flex-col space-y-1">
          {/* Message Bubble */}
          <div
            className={cn(
"px-5 py-5 rounded-2xl text-base leading-6 transition-all duration-200 group-hover:shadow-xl hover:shadow-2xl hover:-translate-y-px hover:shadow-blue-500/10",
isUser
                ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg rounded-br-sm border border-white/20 hover:shadow-purple-500/25"
                : "bg-gray-900/95 border border-blue-500/20 shadow-lg [box-shadow:0_0_0_1px_rgba(59,130,246,0.5),0_4px_20px_rgba(59,130,246,0.15)] hover:shadow-blue-500/30 hover:border-blue-400 rounded-bl-sm backdrop-blur-sm"
            )}
          >
            {/* Message Text */}
            <div className="wrap-break-word">
              <ReactMarkdown
                skipHtml={false}
                allowedElements={[
                  "p",
                  "br",
                  "strong",
                  "em",
                  "u",
                  "h1",
                  "h2",
                  "h3",
                  "ul",
                  "ol",
                  "li",
                  "blockquote",
                  "code",
                  "pre",
                  "a",
                ]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                  ),
                  code: ({ children, inline, ...props }) => {
                    const isCodeBlock =
                      typeof children === "string" && children.includes("\n");

                    return isCodeBlock ? (
                      <pre className="p-3 rounded-md overflow-x-auto my-2 text-xs font-mono bg-black/5 dark:bg-white/5">
                        <code className="text-xs">{children}</code>
                      </pre>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-black/10 dark:bg-white/10">
                        {children}
                      </code>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="list-disc ml-4 mb-3 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-4 mb-3 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 pl-3 my-2 italic border-current/30">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-2 mt-3 first:mt-0">
                      {children}
                    </h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {displayText}
              </ReactMarkdown>
            </div>

{/* Optional AI Status Message & Sources */}
            {!isUser && getAiStateMessage() && (
              <p className="text-xs text-blue-400 italic mt-3 px-1 animate-pulse flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {getAiStateMessage()}
              </p>
            )}
            
            {/* Sources Panel - Placeholder for Perplexity-style */}
            {!isUser && (
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                  Sources <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
                </div>
                <div className="space-y-1 max-h-24 overflow-hidden">
                  <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-sm flex items-center justify-center shadow">
                      G
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-200 truncate">google.com</p>
                      <p className="text-xs text-gray-500 truncate">High confidence snippet preview...</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium px-1.5 py-0.5 bg-emerald-500/10 rounded-full">95%</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all opacity-80">
                    <div className="w-6 h-6 bg-orange-400 rounded-sm flex items-center justify-center shadow">
                      W
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-200 truncate">wikipedia.org</p>
                      <p className="text-xs text-gray-500 truncate">Secondary source content...</p>
                    </div>
                    <span className="text-orange-400 font-medium px-1.5 py-0.5 bg-orange-500/10 rounded-full">82%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Metadata */}
          <div
            className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground px-2",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <span>{formatTime(message.created_at)}</span>
            {isUser && message.status === "sent" && (
              <Check className="h-3 w-3" />
            )}
          </div>

          {/* Copy to Clipboard Button (for AI messages) */}
          {!isUser && (
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-105 mt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="h-7 w-7 p-0 rounded hover:scale-110 shadow-md hover:shadow-blue-500/20"
                title={copied ? "Copied!" : "Copy"}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={downloadResponse}
                className="h-7 w-7 p-0 rounded hover:scale-110 shadow-md hover:shadow-green-500/20"
                title="Download"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={feedbackType === "like" ? "default" : "ghost"}
                onClick={() => setFeedbackType(feedbackType === "like" ? null : "like")}
                className="h-7 w-7 p-0 rounded hover:scale-110 shadow-md hover:shadow-emerald-500/20"
                title="Like"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={feedbackType === "dislike" ? "destructive" : "ghost"}
                onClick={() => setFeedbackType(feedbackType === "dislike" ? null : "dislike")}
                className="h-7 w-7 p-0 rounded hover:scale-110 shadow-md hover:shadow-red-500/20"
                title="Dislike"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 rounded hover:scale-110 shadow-md hover:shadow-orange-500/20"
                title="Regenerate"
                onClick={() => {
                  // Trigger regenerate via channel event
                  channel.sendEvent({
                    type: "ai.regenerate",
                  });
                }}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={downloadResponse}
                className="h-7 w-7 p-0 rounded"
                title="Download response"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={feedbackType === "up" ? "secondary" : "ghost"}
                onClick={() => setFeedbackType("up")}
                className="h-7 w-7 p-0 rounded"
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant={feedbackType === "down" ? "secondary" : "ghost"}
                onClick={() => setFeedbackType("down")}
                className="h-7 w-7 p-0 rounded"
                title="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}

          {!isUser && feedbackType === "down" && (
            <div className="mt-1 px-2">
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What should be improved?"
                className="min-h-17.5 text-xs"
              />
              <div className="mt-1 flex justify-end">
                <Button size="sm" variant="outline" onClick={saveFeedback}>
                  {feedbackSaved ? "Saved" : "Submit feedback"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
