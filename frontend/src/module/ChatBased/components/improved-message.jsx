import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Check, Copy, Download } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export const ImprovedChatMessage = ({
  message,
  isStreaming = false,
}) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (message.text) {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResponse = () => {
    if (!message.text?.trim()) return;
    const blob = new Blob([message.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `response-${message.id || Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const MessageContent = () => {
    if (message.metadata?.isError) {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 backdrop-blur-sm">
          {message.text}
        </div>
      );
    }

    return (
      <div className="prose prose-invert max-w-none text-sm prose-p:mb-2 prose-p:leading-relaxed">
        <ReactMarkdown
          components={{
            code: ({ inline, children }) => {
              if (inline) {
                return (
                  <code className="bg-blue-500/10 px-2 py-1 rounded text-blue-300 font-mono text-xs border border-blue-500/30">
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-[#1a1a1a] border border-blue-500/20 rounded-lg p-3 overflow-x-auto">
                  <code className="text-blue-100 font-mono text-xs">
                    {children}
                  </code>
                </pre>
              );
            },
            p: ({ children }) => <p className="mb-3">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-3 ml-4 space-y-1 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 ml-4 space-y-1 list-decimal">{children}</ol>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-teal-400 underline"
              >
                {children}
              </a>
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex gap-3 py-4 px-4 rounded-lg transition-all",
        isUser ? "bg-blue-500/5 ml-12 border border-blue-500/10" : "bg-teal-500/5 mr-12 border border-teal-500/10"
      )}
    >
      <div className="shrink-0 mt-1">
        {isUser ? (
          <Avatar className="h-8 w-8 bg-blue-600">
            <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
              U
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8 bg-linear-to-br from-blue-600 to-teal-500">
            <AvatarFallback className="bg-linear-to-br from-blue-600 to-teal-500 text-white flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/90">
          <MessageContent />
        </div>

        {isStreaming && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:100ms]" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:200ms]" />
            </div>
            <span className="text-xs text-blue-300">Processing...</span>
          </div>
        )}

        <div className="mt-2 text-xs text-blue-300/70">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {!isStreaming && !isUser && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              onClick={downloadResponse}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedChatMessage;
