import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LogOut,
  MessageCircle,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Pin,
  PlusCircle,
  Search,
  Share2,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChannelList, useChatContext } from "stream-chat-react";
import { useTheme } from "../hooks/use-theme";
import { PREMIUM_TEMPLATES } from "./constants/premium-templates";
import { Button } from "@/components/ui/button";

const ChannelListEmptyStateIndicator = () => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4">
      <div className="w-16 h-16 bg-linear-to-br from-blue-600/20 to-teal-600/10 rounded-2xl flex items-center justify-center shadow-sm border border-blue-600/20">
        <MessageCircle className="h-8 w-8 text-teal-400" />
      </div>
    </div>
    <div className="space-y-2 max-w-xs">
      <h3 className="text-sm font-medium text-gray-100">
        No writing sessions yet
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed">
        Start a new writing session to begin creating content with your AI
        assistant.
      </p>
    </div>
    <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
      <span>Click "New Writing Session" to get started</span>
    </div>
  </div>
);

export const ChatSidebar = ({
  isOpen,
  onClose,
  onLogout,
  onChannelSelect,
  onChannelDelete,
  width = 320,
}) => {
  const { client } = useChatContext();
  const [activeChannel, setActiveChannel] = useState(null);
  const { user } = client;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState([]);
const [recentPrompts, setRecentPrompts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [pinnedChannels, setPinnedChannels] = useState([]);
  const [hiddenChannels, setHiddenChannels] = useState([]); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  if (!user) return null;

  // Filters moved to useEffect for dynamic load

const handleChannelClick = (channel) => {
    setActiveChannel(channel);
    if (onChannelSelect) {
      onChannelSelect(channel);
    }
    onClose();
  };

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
        console.error("[ChatSidebar] Clipboard copy failed");
        return false;
      }
    }
  };

  const savePinnedChannels = (updatedPinned) => {
    localStorage.setItem("chat_pinned_channels", JSON.stringify(updatedPinned));
    setPinnedChannels(updatedPinned);
    window.dispatchEvent(new CustomEvent("conversationsUpdated"));
  };

  const saveHiddenChannels = (updatedHidden) => {
    localStorage.setItem("chat_hidden_channels", JSON.stringify(updatedHidden));
    setHiddenChannels(updatedHidden);
    window.dispatchEvent(new CustomEvent("conversationsUpdated"));
  };

  const handlePinChannel = async (e, channel) => {
    e.stopPropagation();
    const currentPinned = pinnedChannels.includes(channel.id);
    const updated = currentPinned 
      ? pinnedChannels.filter(id => id !== channel.id)
      : [...pinnedChannels, channel.id];
    savePinnedChannels(updated);
  };

  const handleArchiveChannel = async (e, channel) => {
    e.stopPropagation();
    const currentHidden = hiddenChannels.includes(channel.id);
    const updated = currentHidden 
      ? hiddenChannels.filter(id => id !== channel.id)
      : [...hiddenChannels, channel.id];
    saveHiddenChannels(updated);
  };

  const handleShareChannel = async (e, channel) => {
    e.stopPropagation();
    try {
      const { messages = [] } = await channel.queryMessages({ limit: 100 });
      const title = channel.data?.name || "Writing Session";
      const transcript = messages.map(m => {
        const who = m.user?.id === user.id ? "User" : "Assistant";
        return `${who}: ${m.text || ''}`.trim();
      }).filter(Boolean).join("\n\n");
      const shareText = transcript ? `${title}\n\n${transcript}` : title;
      await safeClipboardWriteText(shareText);
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleChannelDelete = async (e, channel) => {
    e.stopPropagation();
    try {
      await channel.delete();
      if (onChannelDelete) {
        onChannelDelete(channel.id);
      }
      window.dispatchEvent(new CustomEvent("conversationsUpdated"));
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

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

  // Load pinned/hidden channels
  useEffect(() => {
    const loadPinnedHidden = () => {
      try {
        const pinned = JSON.parse(localStorage.getItem("chat_pinned_channels") || "[]");
        const hidden = JSON.parse(localStorage.getItem("chat_hidden_channels") || "[]");
        setPinnedChannels(pinned);
        setHiddenChannels(hidden);
      } catch (error) {
        console.error("Load pinned/hidden error:", error);
      }
    };

    loadPinnedHidden();
    window.addEventListener("conversationsUpdated", loadPinnedHidden);
    return () => window.removeEventListener("conversationsUpdated", loadPinnedHidden);
  }, []);

  // Load and sort channels
  useEffect(() => {
    const loadChannels = async () => {
      try {
        const filters = {
          type: "messaging",
          members: { $in: [user.id] },
        };
        const options = { state: true, presence: true, limit: 50 };
        const streamChannels = await client.queryChannels(filters, {}, options);
        
        // Filter hidden
        const visible = streamChannels.filter(c => !hiddenChannels.includes(c.id));
        
        // Sort: pinned first, then last_message_at desc
        const sorted = visible.sort((a, b) => {
          const aPinned = pinnedChannels.includes(a.id);
          const bPinned = pinnedChannels.includes(b.id);
          if (aPinned !== bPinned) return aPinned ? -1 : 1;
          return (b.lastMessageAt || 0) - (a.lastMessageAt || 0);
        });
        
        setChannels(sorted);
      } catch (error) {
        console.error("Load channels error:", error);
      }
    };

    if (client) {
      loadChannels();
    }

    const refresh = () => loadChannels();
    window.addEventListener("conversationsUpdated", refresh);
    return () => window.removeEventListener("conversationsUpdated", refresh);
  }, [client, user.id, pinnedChannels, hiddenChannels]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* The Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700 flex flex-col transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ width: isCollapsed ? "88px" : `${width}px` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center gap-2">
          <div className={cn("min-w-0", isCollapsed && "hidden lg:block")}>
            <h2 className="text-lg font-semibold text-gray-100 truncate">Writing Sessions</h2>
            <p className="text-xs text-gray-500">Your AI workspace</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="hidden lg:inline-flex h-8 w-8 hover:bg-gray-700/60"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Channel List */}
        <ScrollArea className="flex-1 [&amp;_.scrollbar-thumb]:rounded-full [&amp;_.scrollbar-track]:bg-transparent"> 
          <div className={cn("p-4 space-y-4", isCollapsed && "px-2")}>
            {/* Search Bar */}
            {!isCollapsed && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search writing sessions..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )} 
{!isCollapsed && (recentSearches.length > 0 || recentPrompts.length > 0) && (
              <div className="mb-4 space-y-3 border-b border-gray-700/70 pb-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
                      <Search className="h-3 w-3" />
                      Recent Searches
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((item) => (
                        <Button
                          key={item}
                          variant="ghost"
                          size="sm"
                          className="w-full truncate h-auto py-1.5 justify-start text-left text-xs text-gray-300 hover:bg-gray-700/60 hover:text-teal-300 px-2"
                          onClick={() => navigator.clipboard.writeText(item)}
                          title="Click to copy"
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {recentPrompts.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
                      <Clock3 className="h-3 w-3" />
                      Recent Prompts
                    </div>
                    <div className="space-y-1">
                      {recentPrompts.map((item) => (
                        <Button
                          key={item}
                          variant="ghost"
                          size="sm"
                          className="w-full truncate h-auto py-1.5 justify-start text-left text-xs text-gray-300 hover:bg-gray-700/60 hover:text-teal-300 px-2"
                          onClick={() => navigator.clipboard.writeText(item)}
                          title="Click to copy"
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Quick Templates */}
            {!isCollapsed && (
              <div className="space-y-3 pb-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  <FileText className="h-3 w-3" />
                  Quick Templates
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(PREMIUM_TEMPLATES.categories).flatMap(cat => cat.prompts).slice(0,6).map((promptObj, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-auto py-2 px-3 text-xs truncate text-gray-200 hover:bg-primary/10 hover:text-primary border border-gray-600/50 rounded-lg"
                      title={promptObj.template}
                      onClick={() => {
                        navigator.clipboard.writeText(promptObj.template);
                      }}
                    >
                      {promptObj.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* Group Headers & Filtered Channels */}
{(() => {
              const filtered = channels.filter(channel => 
                !searchQuery || 
                channel.data?.name?.toLowerCase().includes(searchQuery.toLowerCase())
              );
              const pinned = filtered.filter(c => pinnedChannels.includes(c.id));
              const recent = filtered.filter(c => !pinnedChannels.includes(c.id) && !hiddenChannels.includes(c.id));
              const archived = filtered.filter(c => hiddenChannels.includes(c.id));
              
              if (filtered.length === 0) {
                return <ChannelListEmptyStateIndicator />;
              }

              const renderChannel = (channel) => {
                const isPinned = pinnedChannels.includes(channel.id);
                const isActive = activeChannel?.id === channel.id;
                return (
                  <div
                    key={channel.id}
                    className={cn(
                      "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700/60 hover:-translate-y-0.5 hover:shadow-md relative group mb-2",
                      isActive
                        ? "bg-blue-600/30 border-2 border-blue-500/50 ring-2 ring-blue-500/30 shadow-lg"
                        : "text-gray-300"
                    )}
                    onClick={() => handleChannelClick(channel)}
                    title={`${channel.data?.name || "New Session"} • ${channel.lastMessageAt ? new Date(channel.lastMessageAt).toLocaleString() : "No messages"}`}
                  >
                    <MessageSquare className={cn("h-4 w-4 shrink-0", isCollapsed ? "mx-auto" : "mr-3")} />
                    {!isCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="truncate text-sm font-medium">
                              {channel.data?.name || "New Writing Session"}
                            </span>
                            {isPinned && (
                              <Pin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {channel.lastMessageAt ? new Date(channel.lastMessageAt).toLocaleDateString() : "No messages"}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-700/60 shrink-0"
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={(e) => handlePinChannel(e, channel)}>
                              <Pin className="mr-2 h-4 w-4" />
                              {isPinned ? "Unpin" : "Pin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleShareChannel(e, channel)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share Transcript
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => handleChannelDelete(e, channel)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                );
              };
              
              return (
                <>
                  {pinned.length > 0 && !isCollapsed && (
                    <div className="mb-6 pb-2 border-b border-gray-700/50">
                      <h4 className="px-4 py-2.5 text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-1.5 mb-3 bg-blue-500/5 rounded-lg">
                        <Pin className="h-3 w-3" />
                        Pinned ({pinned.length})
                      </h4>
                      {pinned.map(renderChannel)}
                    </div>
                  )}

                  <div className="mb-6 pb-2 border-b border-gray-700/30">
                    {recent.length > 0 && !isCollapsed && (
                      <h4 className="px-4 py-2 text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                        <Clock3 className="h-3 w-3" />
                        Recent ({recent.length})
                      </h4>
                    )}
                    {recent.slice(0, 10).map(renderChannel)}
                  </div>

                  {archived.length > 0 && !isCollapsed && (
                    <div>
                      <h4 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3 bg-gray-700/30 rounded-lg">
                        <Archive className="h-3 w-3" />
                        Archived ({archived.length})
                      </h4>
                      {archived.slice(0, 5).map(renderChannel)}
                    </div>
                  )}
                </>
              );
            })()}

          </div>
        </ScrollArea>

        {/* New Chat Button */}
        <div className="p-2 border-t border-gray-700">
          <Button 
            onClick={() => {
              console.log("[ChatSidebar] New session button clicked");
              window.dispatchEvent(new CustomEvent('newChatSession'));
              console.log("[ChatSidebar] Event dispatched");
              onClose();
            }} 
            className={cn(
              "w-full bg-linear-to-r from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600 text-white font-medium",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <PlusCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "New Writing Session"}
          </Button>
        </div>

        {/* User Profile / Logout */}
        <div className="p-2 border-t border-gray-700 bg-gray-800/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full items-center p-2 h-auto hover:bg-gray-700/50",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <Avatar className={cn("w-8 h-8", !isCollapsed && "mr-2")}>
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm truncate text-gray-100">{user?.name}</p>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end">
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>
                  Switch to {theme === "dark" ? "Light" : "Dark"} Theme
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
