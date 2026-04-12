import React, { useState, useRef, useEffect } from "react";
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
  Archive,
  Plus,
  SidebarOpen,
  Trash2,
  SendHorizontal,
  AlertCircle,
  MoreVertical,
  Pin,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

// Simple creator wizard for content-focused prompts (blog/SEO/article)


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
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardIdea, setWizardIdea] = useState("");
  const [wizardKeywords, setWizardKeywords] = useState("");
  const [wizardAudience, setWizardAudience] = useState("");
  const [wizardTone, setWizardTone] = useState("professional");
  const [activeCategory, setActiveCategory] = useState("Content");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update conversation preview when messages change
  useEffect(() => {
    if (channelId && messages.length > 0) {
      updateConversationPreview(channelId, messages);
    }
  }, [channelId, messages, updateConversationPreview]);

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

  const pushRecentItem = (storageKey, text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    try {
      const current = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const deduped = [trimmed, ...current.filter((item) => item !== trimmed)].slice(
        0,
        8
      );
      localStorage.setItem(storageKey, JSON.stringify(deduped));
      window.dispatchEvent(new CustomEvent("chatRecentUpdated"));
    } catch (storageError) {
      console.error("Unable to update recent items", storageError);
    }
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
        console.error("[ImprovedChat] Clipboard copy failed:", fallbackError);
        return false;
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // Auto-create channel if needed
    let effectiveChannelId = channelId;
    if (!effectiveChannelId) {
      effectiveChannelId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Notify parent of new channel creation
      if (onChannelCreated) {
        onChannelCreated(effectiveChannelId);
      }
    }

    let userMessage = inputText.trim();

    if (activeCategory && !userMessage.startsWith("Context:")) {
      userMessage = buildQuickPrompt(userMessage);
    }
    pushRecentItem("chat_recent_prompts", userMessage);

    onInputTextChange("");
    setError(null);

    try {
      setIsLoading(true);

      const userMsg = addMessage(userMessage, "user", {}, effectiveChannelId);
      const assistantMsg = addMessage("", "assistant", { isStreaming: true }, effectiveChannelId);

      if (!userMsg?.id || !assistantMsg?.id) {
        throw new Error("Failed to create messages");
      }

      console.log("[ImprovedChat] Sending message to backend");

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
        });
      }

      console.log("[ImprovedChat] ✅ Response completed");
    } catch (err) {
      console.error("[ImprovedChat] Error:", err);
      setError(err.message || "Failed to send message");
      addMessage(err.message || "Error getting response", "assistant", {
        isError: true,
      }, effectiveChannelId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isEmpty = messages.length === 0;

  const canGoNextFromStep = () => {
    if (wizardStep === 1) return Boolean(wizardIdea.trim());
    if (wizardStep === 2) return Boolean(wizardKeywords.trim());
    return true;
  };

  const buildWizardPrompt = () => {
    const topic = wizardIdea.trim();
    const keywords = wizardKeywords.trim();
    const audience = wizardAudience.trim() || "general audience";
    const tone = wizardTone || "professional";

    return [
      "SEO Blog Draft",
      `Topic: ${topic}. Keywords: ${keywords}. Audience: ${audience}. Tone: ${tone}.`,
      "Create a blog with: SEO title, meta description, outline, and full draft.",
      "Keep each section 150–200 words and optimize for readability.",
    ].join("\n");
  };

  const handleWizardApply = () => {
    const prompt = buildWizardPrompt();
    onInputTextChange(prompt);
    setWizardOpen(false);
    setWizardStep(1);
  };

  const handleShareConversation = async (mode = "full") => {
    try {
      let payload = "";

      if (!messages || messages.length === 0) {
        toast.error("No conversation to share yet.");
        return;
      }

      if (mode === "last") {
        const lastAssistant = [...messages]
          .reverse()
          .find((m) => m.role === "assistant" && (m.text || "").trim());
        if (!lastAssistant) {
          toast.error("No AI response to share yet.");
          return;
        }
        payload = (lastAssistant.text || "").trim();
      } else if (mode === "linkedin") {
        const lastAssistant = [...messages]
          .reverse()
          .find((m) => m.role === "assistant" && (m.text || "").trim());
        const base = lastAssistant ? (lastAssistant.text || "").trim() : "";
        payload = [
          "LinkedIn post draft from my AI writing assistant:",
          "",
          base || "[Write a short, professional update here]",
        ].join("\n");
      } else {
        payload = (messages || [])
          .map((m) => {
            const who = m?.role === "user" ? "You" : "AI";
            const text = (m?.text || "").trim();
            if (!text) return null;
            return `${who}: ${text}`;
          })
          .filter(Boolean)
          .join("\n\n");
      }

      if (!payload) {
        toast.error("Nothing to copy yet.");
        return;
      }

      const ok = await safeClipboardWriteText(payload);
      if (ok) {
        toast.success(
          mode === "linkedin"
            ? "LinkedIn-style copy ready to paste."
            : mode === "last"
            ? "Last AI response copied."
            : "Conversation copied to clipboard."
        );
      } else {
        toast.error("Could not access clipboard.");
      }
    } catch (error) {
      console.error("[ImprovedChat] Share failed", error);
      toast.error("Sharing failed. Please try again.");
    }
  };

  const buildQuickPrompt = (basePrompt) => {
    if (!activeCategory) return basePrompt;
    return `Context: This is for ${activeCategory.toLowerCase()} communication.\n` + basePrompt;
  };

  const handleRegenerateWithFeedback = async ({ message, text }) => {
    if (!message || !backendUrl || isLoading) return;

    // Auto-create channel if needed
    let effectiveChannelId = channelId;
    if (!effectiveChannelId) {
      effectiveChannelId = `ch_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      if (onChannelCreated) {
        onChannelCreated(effectiveChannelId);
      }
    }

    const feedbackInstruction =
      text && text.trim().length > 0
        ? text.trim()
        : "Improve the previous answer: make it clearer, more accurate, and more useful for the user.";

    const improvementPrompt = [
      "Improve your last answer for the same question.",
      "Use this feedback:",
      feedbackInstruction,
    ].join("\n");

    try {
      setIsLoading(true);

      const userMsg = addMessage(
        improvementPrompt,
        "user",
        { isFeedbackFollowup: true },
        effectiveChannelId
      );

      const assistantMsg = addMessage(
        "",
        "assistant",
        { isStreaming: true, isImprovedFromFeedback: true },
        effectiveChannelId
      );

      if (!userMsg?.id || !assistantMsg?.id) {
        throw new Error("Failed to create feedback messages");
      }

      const response = await fetch(`${backendUrl}/api/v1/chat/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: effectiveChannelId,
          message: improvementPrompt,
          conversation_history: getConversationContext(),
          user_id: currentUser?.id,
        }),
      });

      if (!response.ok) {
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
        });
      }
    } catch (err) {
      console.error("[ImprovedChat] Feedback regenerate error:", err);
      setError(err.message || "Failed to improve response");
      addMessage(
        err.message || "Error improving response",
        "assistant",
        { isError: true },
        effectiveChannelId
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#0f0f0f] to-[#1a1a1a]">
      {/* Header */}
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
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWizardOpen((prev) => !prev)}
            className="inline-flex text-xs text-gray-300 hover:text-blue-300 hover:bg-blue-500/10 px-2 py-1 rounded-md"
          >
            Creator Wizard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
                title="Share or copy"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs">
              <DropdownMenuItem onClick={() => handleShareConversation("full")}>
                Copy full conversation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareConversation("last")}>
                Copy last AI response
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareConversation("linkedin")}>
                Copy as LinkedIn post draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              onNewChat?.();
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

      {/* Error Alert */}
      {error && (
        <div className="mx-4 mt-3 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-strong">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
              ✨
            </div>
            <div>
              <h2 className="text-2xl font-semibold bg-linear-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text mb-1">
                Your AI writing partner
              </h2>
              <p className="text-gray-400 text-sm max-w-sm">
                From first draft to final edit, I help you write better, faster.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[12px] text-gray-300">
                {["Business", "Content", "Creative", "Social"].map((cat, index) => (
                  <React.Fragment key={cat}>
                    {index > 0 && (
                      <span className="text-gray-500">|</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={
                        "px-1 rounded-full transition-colors " +
                        (activeCategory === cat
                          ? "text-blue-300 font-medium"
                          : "text-gray-300 hover:text-blue-200")
                      }
                    >
                      {cat}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md mt-6">
              {[
                {
                  label: "Write a professional email",
                  description: "Clear, polite, and to the point.",
                  prompt:
                    "Write a professional email about [topic]. Keep it clear, polite, and under 150 words.",
                },
                {
                  label: "Draft a LinkedIn post",
                  description: "Showcase your resume, skills, or project.",
                  prompt:
                    "Write a compelling LinkedIn post about [your resume / experience / project]. Use 3–5 short lines with a strong hook in line 1.",
                },
                {
                  label: "Polish my paragraph",
                  description: "Fix tone, clarity, and flow.",
                  prompt:
                    "Rewrite the following paragraph to be clearer, more concise, and easy to read. Keep my voice and intent the same: [paste your text here]",
                },
                {
                  label: "Hooks for Instagram Reels",
                  description: "Quick, scroll-stopping first lines.",
                  prompt:
                    "Write 5 short, scroll-stopping hooks for Instagram Reels about [topic]. Each hook should fit in one short line.",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onInputTextChange(buildQuickPrompt(item.prompt))}
                  className="text-left p-3 rounded-lg border border-blue-500/20 bg-linear-to-r from-blue-500/5 to-teal-500/5 hover:from-blue-500/15 hover:to-teal-500/15 text-sm text-gray-300 hover:text-blue-300 hover:border-blue-400/40 transition-all duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-[14px]">{item.label}</span>
                    {item.description && (
                      <p className="text-[12px] text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 py-4 px-2">
            {messages.map((msg) => (
              <ImprovedChatMessage
                key={msg.id}
                message={msg}
                isStreaming={msg.metadata?.isStreaming}
                onRegenerate={handleRegenerateWithFeedback}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 py-4 px-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-teal-500 rounded flex items-center justify-center shrink-0 text-white">
                  🤖
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

      {/* Creator Wizard (Idea → Keywords → Details) */}
      {wizardOpen && (
        <div className="shrink-0 px-4 pt-2">
          <div className="rounded-xl border border-blue-500/20 bg-[#101018] px-3 py-3 mb-2 shadow-md shadow-blue-500/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="font-semibold text-blue-200">Creator Wizard</span>
                <span className="text-gray-500">Step {wizardStep} of 3</span>
              </div>
              <button
                type="button"
                onClick={() => setWizardOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Close
              </button>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-2 text-xs text-gray-300">
                <p className="font-medium">1. Idea / Topic</p>
                <p className="text-gray-500">
                  Briefly describe the topic for your blog, SEO article, or script.
                </p>
                <textarea
                  value={wizardIdea}
                  onChange={(e) => setWizardIdea(e.target.value)}
                  rows={2}
                  className="w-full rounded-md bg-[#15151f] border border-blue-500/30 text-xs text-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="e.g. Instagram growth tips for small businesses"
                />
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-3 text-xs text-gray-300">
                <div>
                  <p className="font-medium">2. Keywords</p>
                  <p className="text-gray-500">Write your main keywords, separated by commas.</p>
                  <textarea
                    value={wizardKeywords}
                    onChange={(e) => setWizardKeywords(e.target.value)}
                    rows={2}
                    className="w-full rounded-md bg-[#15151f] border border-blue-500/30 text-xs text-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="e.g. instagram growth, reels, content strategy"
                  />
                </div>
                <div>
                  <p className="font-medium">Audience (optional)</p>
                  <input
                    value={wizardAudience}
                    onChange={(e) => setWizardAudience(e.target.value)}
                    className="w-full rounded-md bg-[#15151f] border border-blue-500/30 text-xs text-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="e.g. Indian small business owners"
                  />
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-3 text-xs text-gray-300">
                <div>
                  <p className="font-medium">3. Tone</p>
                  <p className="text-gray-500">Choose the tone you want for the output.</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {["professional", "casual", "viral", "storytelling"].map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setWizardTone(tone)}
                        className={`px-2 py-1 rounded-full border text-[11px] capitalize ${
                          wizardTone === tone
                            ? "border-blue-400 bg-blue-500/20 text-blue-100"
                            : "border-blue-500/30 text-gray-300 hover:bg-blue-500/10"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Generated prompt preview</p>
                  <pre className="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-md bg-[#15151f] border border-blue-500/30 text-[11px] text-gray-100 p-2">
                    {buildWizardPrompt()}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="text-gray-500">
                Idea → Keywords → Tone, then the prompt will auto-fill for you.
              </div>
              <div className="flex gap-2">
                {wizardStep > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-gray-400 hover:text-gray-100"
                    onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                  >
                    Back
                  </Button>
                )}
                {wizardStep < 3 && (
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-3 text-xs"
                    disabled={!canGoNextFromStep()}
                    onClick={() => setWizardStep((s) => Math.min(3, s + 1))}
                  >
                    Next
                  </Button>
                )}
                {wizardStep === 3 && (
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={handleWizardApply}
                  >
                    Use in chat
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
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
            placeholder="Message AI Assistant... (Shift + Enter for new line)"
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
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </form>
    </div>
  );
};

export default ImprovedChatInterface;
