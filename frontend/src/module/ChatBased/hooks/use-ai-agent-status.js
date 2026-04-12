import { useCallback, useEffect, useState } from "react";

export const useAIAgentStatus = ({
  channelId,
  backendUrl,
}) => {
  // Start with "disconnected" and determine status via effects
  const [status, setStatus] = useState("disconnected");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check agent status from backend
  const checkStatus = useCallback(async () => {
    if (!channelId) {
      setStatus("disconnected");
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/v1/chat/status?channel_id=${channelId}`
      );
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      } else {
        setStatus("disconnected");
      }
    } catch (err) {
      console.error("Error checking agent status:", err);
      setStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }, [channelId, backendUrl]);

  const refreshStatus = useCallback(async () => {
    await checkStatus();
  }, [checkStatus]);

  // Connect AI agent
  const connectAgent = useCallback(async () => {
    if (!channelId || loading) return;

    setLoading(true);
    setError(null);
    setStatus("connecting"); // Optimistic update

    try {
      const response = await fetch(`${backendUrl}/api/v1/chat/start-ai-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel_id: channelId,
          channel_type: "messaging",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `[useAIAgentStatus] Failed to start agent for ${channelId}:`,
          errorData.reason
        );
        setError(errorData.reason || "Failed to start AI agent");
        setStatus("disconnected"); // Revert on failure
      }
    } catch (err) {
      console.error(
        `[useAIAgentStatus] Network error starting AI agent for ${channelId}:`,
        err
      );
      setError("Network error starting AI agent");
      setStatus("disconnected"); // Revert on failure
    } finally {
      await checkStatus();
    }
  }, [channelId, backendUrl, loading, checkStatus]);

  // Disconnect AI agent
  const disconnectAgent = useCallback(async () => {
    if (!channelId || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/v1/chat/stop-ai-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel_id: channelId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `[useAIAgentStatus] Failed to stop agent for ${channelId}:`,
          errorData.reason
        );
        setError(errorData.reason || "Failed to stop AI agent");
      } else {
        setStatus("disconnected"); // Optimistic update
      }
    } catch (err) {
      console.error(
        `[useAIAgentStatus] Network error stopping AI agent for ${channelId}:`,
        err
      );
      setError("Network error stopping AI agent");
    } finally {
      await checkStatus();
    }
  }, [channelId, backendUrl, loading, checkStatus]);

  // Toggle agent connection
  const toggleAgent = useCallback(async () => {
    if (status === "connected") {
      await disconnectAgent();
    } else {
      await connectAgent();
    }
  }, [status, connectAgent, disconnectAgent]);

  // Check status when channelId changes
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Poll status periodically
  useEffect(() => {
    if (channelId) {
      const interval = setInterval(checkStatus, 120000); // Check every 2 minutes
      return () => clearInterval(interval);
    }
  }, [channelId, checkStatus]);

  return {
    status,
    loading,
    error,
    connectAgent,
    disconnectAgent,
    toggleAgent,
    checkStatus: refreshStatus,
    setStatus,
  };
};
