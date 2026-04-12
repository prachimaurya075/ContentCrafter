import { useAIAgentStatus } from "../hooks/use-ai-agent-status";
import {
  Bot,
  Briefcase,
  FileText,
  Lightbulb,
  Menu,
  MessageSquare,
  Sparkles,
  File,
  Smartphone,
  Video,
  Search,
} from "lucide-react";
import { PREMIUM_TEMPLATES } from "../constants/premium-templates";
import { useEffect, useRef, useState } from "react";
import {
  Channel,
  MessageList,
  useAIState,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  Window,
} from "stream-chat-react";
import { AIAgentControl } from "./ai-agent-control";
import { ChatInput } from "./chat-input";
import ChatMessage from "./chat-message";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, MoreVertical, Pin, Share2, Trash2 } from "lucide-react";

const EmptyStateWithInput = ({ onNewChatMessage, backendUrl }) => {
  const [inputText, setInputText] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(PREMIUM_TEMPLATES.personas[0]);
  const [selectedCategory, setSelectedCategory] = useState(Object.values(PREMIUM_TEMPLATES.categories)[0]);

  const categoriesArray = Object.values(PREMIUM_TEMPLATES.categories);

  const handlePromptClick = (template, persona = selectedPersona) => {
    const fullPrompt = `${persona.prefix}${PREMIUM_TEMPLATES.systemPrompt}\n\n${template}`;
    setInputText(fullPrompt);
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex-1 flex items-center justify-center overflow-y-auto p-6">
        <div className="text-center max-w-4xl w-full">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-pulse"></div>
              <Bot className="h-10 w-10 text-primary relative z-10" />
              <Sparkles className="h-5 w-5 text-primary/60 absolute -top-2 -right-2" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-3">
              Premium AI Writing Assistant
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              SEO-optimized, structured content. Choose persona, category, and template to start.
            </p>
          </div>

          {/* Persona Selector */}
          <div className="mb-8 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground mb-4 text-left">
              Select Persona
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {PREMIUM_TEMPLATES.personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handlePersonaSelect(persona)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 text-xs ${
                    selectedPersona.id === persona.id
                      ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                      : 'border-muted/50 hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-lg">{persona.icon}</span>
                  <span className="font-medium">{persona.name}</span>
                  <span className="text-muted-foreground leading-tight">{persona.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categories & Templates - Two Tabbed Sections */}
          <div className="w-full max-w-3xl space-y-6">
            {/* Categories Tabs */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                Content Categories
              </h3>
              <Tabs defaultValue={selectedCategory.id} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-muted/50 p-1 rounded-2xl">
                  {categoriesArray.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="flex flex-col items-center gap-1.5 p-3 text-xs data-[state=active]:bg-background rounded-xl data-[state=active]:shadow-md"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium leading-tight">{category.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Category Templates */}
                {categoriesArray.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.prompts.map((promptObj, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(promptObj.template)}
                          className="group relative p-6 text-left rounded-2xl bg-gradient-to-br from-muted/50 to-muted hover:from-primary/10 hover:to-primary/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-muted/50 hover:border-primary/50 overflow-hidden h-full min-h-[140px]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10">
                            <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-base leading-tight">
                              {promptObj.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                              {promptObj.template.slice(0, 120)}...
                            </p>
                            <div className="flex items-center gap-2 text-xs text-primary/80 font-medium">
                              Use Template
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur-sm shrink-0">
        <div className="p-6">
          <ChatInput
            sendMessage={onNewChatMessage}
            placeholder="Template loaded! Customize {topic}/{keywords} and hit Enter..."
            value={inputText}
            onValueChange={setInputText}
            className="p-4!"
            isGenerating={false}
            onStopGenerating={() => {}}
            backendUrl={backendUrl}
          />
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageListEmptyIndicator = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center px-4">
      <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
        <div className="absolute inset-0 bg-primary/10 rounded-xl"></div>
        <Bot className="h-6 w-6 text-primary/80 relative z-10" />
      </div>
      <h2 className="text-lg font-medium text-foreground mb-2">
        Ready to Write
      </h2>
      <p className="text-sm text-muted-foreground">
        Start the conversation and let's create something amazing together.
      </p>
    </div>
  </div>
);

const MessageListContent = () => {
  const { messages, thread } = useChannelStateContext();
  const isThread = !!thread;

  if (isThread) return null;

  return (
    <div className="flex-1 min-h-0 premium-message-area">
      {!messages?.length ? (
        <MessageListEmptyIndicator />
      ) : (
        <MessageList Message={ChatMessage} className="premium-message-list" />
      )}
    </div>
  );
};

export const ChatInterface = ({
  onToggleSidebar,
  onNewChatMessage,
  backendUrl,
}) => {
  const { channel } = useChatContext();
  const agentStatus = useAIAgentStatus({
    channelId: channel?.id ?? null,
    backendUrl,
  });

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

  const safeClipboardWriteText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
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
      } catch {
        console.error("[ChatInterface] Clipboard copy failed");
        return false;
      }
    }
  };

  const updatePinnedChannel = async (channelId, add) => {
    try {
      const pinned = JSON.parse(localStorage.getItem("chat_pinned_channels") || "[]");
      const updated = add ? [...pinned, channelId] : pinned.filter(id => id !== channelId);
      localStorage.setItem("chat_pinned_channels", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("conversationsUpdated"));
    } catch (error) {
      console.error("Update pinned local:", error);
    }
  };

  const updateHiddenChannel = async (channelId, add) => {
    try {
      const hidden = JSON.parse(localStorage.getItem("chat_hidden_channels") || "[]");
      const updated = add ? [...hidden, channelId] : hidden.filter(id => id !== channelId);
      localStorage.setItem("chat_hidden_channels", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("conversationsUpdated"));
    } catch (error) {
      console.error("Update hidden local:", error);
    }
  };

  const handleShareChat = async () => {
    if (!channel) return;
    try {
      const messages = await channel.queryMessages({ limit: 100 });
      const title = channel.data?.name || "Writing Session";
      const transcript = messages.map(m => {
        const who = m.user?.id === user?.id ? "You" : "Assistant";
        return `${who}: ${m.text || ''}`.trim();
      }).filter(Boolean).join("\n\n");
      const shareText = transcript ? `${title}\n\n${transcript}` : title;
      await safeClipboardWriteText(shareText);
    } catch (error) {
      console.error("Share chat error:", error);
    }
  };

  const handlePinChat = async () => {
    if (!channel) return;

    try {
      const currentPinned = Boolean(channel?.data?.pinned);
      await channel.updatePartial({
        set: { pinned: !currentPinned },
      });
      await channel.watch();
      // Sync local pinned
      await updatePinnedChannel(channel.id, !currentPinned);
    } catch (error) {
      console.error("Failed to pin chat", error);
    }
  };

  const handleArchiveChat = async () => {
    if (!channel) return;

    try {
      if (typeof channel.hide === "function") {
        await channel.hide();
      } else {
        await channel.updatePartial({
          set: { archived: true },
        });
      }
      window.dispatchEvent(new CustomEvent("newChatSession"));
      // Sync local hidden
      await updateHiddenChannel(channel.id, true);
    } catch (error) {
      console.error("Failed to archive chat", error);
    }
  };

  const handleDeleteChat = async () => {
    if (!channel) return;

    try {
      await channel.delete();
      window.dispatchEvent(new CustomEvent("newChatSession"));
      window.dispatchEvent(new CustomEvent("conversationsUpdated"));
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  };

  const ChannelMessageInputComponent = () => {
    const { sendMessage } = useChannelActionContext();
    const { channel, messages } = useChannelStateContext();
    const { aiState } = useAIState(channel);
    const [inputText, setInputText] = useState("");
    const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
    const textareaRef = useRef(null);

    const isGenerating =
      aiState === "AI_STATE_THINKING" ||
      aiState === "AI_STATE_GENERATING" ||
      aiState === "AI_STATE_EXTERNAL_SOURCES";

    console.log("aiState", aiState);

    const handleStopGenerating = () => {
      if (channel) {
        const aiMessage = [...messages]
          .reverse()
          .find((m) => m.user?.id.startsWith("ai-bot"));
        if (aiMessage) {
          channel.sendEvent({
            type: "ai_indicator.stop",
            cid: channel.cid,
            message_id: aiMessage.id,
          });
        }
      }
    };

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
      } catch (error) {
        console.error("Unable to update recent items", error);
      }
    };

    const handleSendMessage = async ({ text }) => {
      const normalized = text?.trim();
      if (!normalized) return;

      pushRecentItem("chat_recent_prompts", normalized);
      if (isWebSearchEnabled) {
        pushRecentItem("chat_recent_searches", normalized);
      }

      const payloadText = isWebSearchEnabled
        ? `[Use web sources if needed]\n${normalized}`
        : normalized;

      await sendMessage({ text: payloadText });
    };

    return (
      <ChatInput
        sendMessage={handleSendMessage}
        value={inputText}
        onValueChange={setInputText}
        textareaRef={textareaRef}
        showPromptToolbar={true}
        className="p-4!"
        isGenerating={isGenerating}
        onStopGenerating={handleStopGenerating}
        isWebSearchEnabled={isWebSearchEnabled}
        onToggleWebSearch={() => setIsWebSearchEnabled((prev) => !prev)}
        backendUrl={backendUrl}
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-background premium-chat-shell">
      {/* Enhanced Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-4 border-b bg-background/90 backdrop-blur-sm z-10 premium-chat-header">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden h-9 w-9"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-9 h-9 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              {channel?.id && agentStatus.status === "connected" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {channel?.data?.name || "New Writing Session"}
              </h2>
              <p className="text-xs text-muted-foreground tracking-wide">
                AI Writing Assistant • Always improving
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {channel?.id && (
            <AIAgentControl
              status={agentStatus.status}
              loading={agentStatus.loading}
              error={agentStatus.error}
              toggleAgent={agentStatus.toggleAgent}
              checkStatus={agentStatus.checkStatus}
              channelId={channel.id}
            />
          )}
          {channel?.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handlePinChat}>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareChat}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Transcript
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteChat}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {!channel ? (
          <EmptyStateWithInput onNewChatMessage={onNewChatMessage} backendUrl={backendUrl} />
        ) : (
          <Channel channel={channel}>
            <Window>
              <MessageList className="space-y-4 px-4 py-2" Message={ChatMessage} /> 
              <ChannelMessageInputComponent />
            </Window>
          </Channel>
        )}
      </div>
    </div>
  );
};