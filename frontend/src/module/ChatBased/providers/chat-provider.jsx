import { useCallback, useState } from "react";
import { Chat, useCreateChatClient } from "stream-chat-react";
import { LoadingScreen } from "../components/loading";
import { useTheme } from "../hooks/use-theme";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!apiKey) {
  throw new Error("Missing VITE_STREAM_API_KEY in .env file");
}

export const ChatProvider = ({ user, children }) => {
  const { theme } = useTheme();
  const [error, setError] = useState(null);

  const tokenProvider = useCallback(async () => {
    if (!user) {
      const errMsg = "User not available";
      console.error("[Chat] ❌", errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    }

    console.log("[Chat] 🔄 Fetching token for user:", user.id);

    try {
      const response = await fetch(`${backendUrl}/api/v1/chat/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: user.id,
          userName: user.name || user.id 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errMsg = `Backend token error (${response.status}): ${errorText}`;
        console.error("[Chat] ❌ Token fetch failed:", errMsg);
        setError(errMsg);
        throw new Error(errMsg);
      }

      const { token } = await response.json();
      if (!token) {
        const errMsg = "No token in response";
        console.error("[Chat] ❌", errMsg);
        setError(errMsg);
        throw new Error(errMsg);
      }

      console.log("[Chat] ✅ Token received:", token.substring(0, 50) + "...");
      setError(null);
      return token;
    } catch (err) {
      const errMsg = err.message || "Unknown error fetching token";
      console.error("[Chat] ❌ Error fetching token:", errMsg);
      setError(errMsg);
      throw err;
    }
  }, [user]);

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: tokenProvider,
    userData: user,
  });

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold text-red-400 mb-3">Connection Error</h2>
          <p className="text-red-200 text-sm mb-4 break-words">{error}</p>
          <div className="text-xs text-red-300 mb-4">
            <p className="font-semibold mb-2">Debug Info:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Backend URL: {backendUrl}</li>
              <li>User ID: {user?.id}</li>
              <li>API Key: {apiKey?.substring(0, 10)}...</li>
            </ul>
          </div>
          <button
            onClick={() => setError(null)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!client) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-300 font-semibold">Setting up your AI assistant...</p>
          <p className="text-gray-400 text-xs">Connecting to Stream Chat</p>
        </div>
      </div>
    );
  }

  return (
    <Chat
      client={client}
      theme={
        theme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"
      }
    >
      {children}
    </Chat>
  );
};