import React, { useEffect, useState, useCallback, useRef } from "react";
import { ChatProvider } from "./providers/chat-provider";
import { ChatInterface } from "./components/chat-interface";
import { ChatSidebar } from "./components/chat-sidebar";
import { ThemeProvider } from "./providers/theme-provider";
import { useChatContext } from "stream-chat-react";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Menu, X } from "lucide-react";

/**
 * ChatBasedModule - Full-screen chat interface like ChatGPT
 * Uses the modular UI components from the ChatBased folder
 */
const ChatBasedModule = ({ user, onClose, onBack }) => {
  if (!user) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ChatProvider user={user}>
        <ChatModuleContent user={user} onClose={onClose} onBack={onBack} />
      </ChatProvider>
    </ThemeProvider>
  );
};

/**
 * Inner component that uses Stream Chat context
 * Full-screen layout with sidebar and main chat area
 */
const ChatModuleContent = ({ user, onClose, onBack }) => {
  const { client, setActiveChannel: setStreamActiveChannel } = useChatContext();
  const [activeChannel, setActiveChannel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [agentStatus, setAgentStatus] = useState("disconnected");
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dividerRef = useRef(null);

  // Create new chat session
  const handleNewChatMessage = useCallback(
    async (message) => {
      if (!user.id || !client) {
        setError("Client not initialized");
        return;
      }

      try {
        setError(null);
        setIsLoadingAgent(true);
        setAgentStatus("connecting");
        console.log("[ChatModule] Creating new channel...");

        // Create a new channel
        const newChannel = client.channel("messaging", uuidv4(), {
          members: [user.id],
          name: message.text.substring(0, 50),
        });
        await newChannel.watch();
        console.log("[ChatModule] ✅ Channel created:", newChannel.id);

        // Start AI agent immediately
        const response = await fetch(`${backendUrl}/api/v1/chat/start-ai-agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel_id: newChannel.id,
            channel_type: "messaging",
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to start AI agent: ${response.status}`);
        }

        console.log("[ChatModule] ✅ AI agent started");

        // Set active channel
        setActiveChannel(newChannel);
        setStreamActiveChannel(newChannel);

        // Wait for AI agent to be added (with timeout)
        const memberAddedPromise = new Promise((resolve) => {
          const unsubscribe = newChannel.on("member.added", (event) => {
            if (event.member?.user?.id && event.member.user.id !== user.id) {
              console.log("[ChatModule] ✅ AI Agent connected:", event.member.user.id);
              setAgentStatus("connected");
              unsubscribe.unsubscribe();
              resolve();
            }
          });
          
          // Timeout after 5 seconds
          setTimeout(() => {
            console.log("[ChatModule] ⏱️ Member added timeout - setting status to connected anyway");
            unsubscribe.unsubscribe();
            setAgentStatus("connected");
            resolve();
          }, 5000);
        });

        await memberAddedPromise;
        
        // Send the user message
        await newChannel.sendMessage(message);
        console.log("[ChatModule] ✅ Message sent");
      } catch (error) {
        const errMsg = error.message || "Error creating chat";
        console.error("[ChatModule] ❌ Error:", errMsg);
        setError(errMsg);
        setAgentStatus("disconnected");
      } finally {
        setIsLoadingAgent(false);
      }
    },
    [user?.id, client, backendUrl, setStreamActiveChannel]
  );

  // Handle channel selection from sidebar
  const handleChannelSelect = useCallback(async (channel) => {
    console.log("[ChatBasedModule] Channel selected:", channel?.id);
    try {
      // Watch the channel to receive message updates and load message history
      await channel.watch();
      setActiveChannel(channel);
      setStreamActiveChannel(channel);
      setAgentStatus("connected"); // Assume connected for existing channels
      setSidebarOpen(false); // Close sidebar on mobile when channel is selected
    } catch (error) {
      console.error("[ChatBasedModule] Error watching channel:", error);
      setActiveChannel(null);
      setAgentStatus("disconnected");
    }
  }, [setStreamActiveChannel]);

  // Handle new chat session creation
  useEffect(() => {
    const handleNewSession = () => {
      console.log("[ChatBasedModule] New session requested");
      setActiveChannel(null);
      setStreamActiveChannel(null);
      setSidebarOpen(false);
    };

    window.addEventListener('newChatSession', handleNewSession);
    return () => window.removeEventListener('newChatSession', handleNewSession);
  }, [setStreamActiveChannel]);

  // Handle logout
  const handleLogout = () => {
    setActiveChannel(null);
    onClose();
  };

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSidebar) return;
      
      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
    };

    if (isDraggingSidebar) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingSidebar]);

  // Handle channel delete
  const handleChannelDelete = (channelId) => {
    if (activeChannel?.id === channelId) {
      setActiveChannel(null);
      setStreamActiveChannel(null);
   

  // Show error if any
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold text-red-400 mb-3">Error Creating Chat</h2>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  } }
  };

  if (!client) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-300">Initializing chat service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onChannelSelect={handleChannelSelect}
        onChannelDelete={handleChannelDelete}
        width={sidebarWidth}
      />

      {/* Resizable Divider - Only show on desktop */}
      <div
        ref={dividerRef}
        onMouseDown={() => setIsDraggingSidebar(true)}
        className="hidden lg:block w-1 bg-gray-700 hover:bg-teal-500 cursor-col-resize transition-colors"
        style={{ userSelect: "none" }}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">AI Writing Assistant</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ChatInterface
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNewChatMessage={handleNewChatMessage}
            onClose={onClose}
            onBack={onBack}
            user={user}
            agentStatus={agentStatus}
            isLoadingAgent={isLoadingAgent}
            isNewSession={!activeChannel}
            activeChannel={activeChannel}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBasedModule;

