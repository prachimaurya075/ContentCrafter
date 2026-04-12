import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, Bot, BotOff, Loader2, RotateCcw } from "lucide-react";
import React from "react";

const getStatusConfig = (status, loading) => {
  if (loading) {
    return {
      variant: "secondary",
      color: "text-orange-600 dark:text-orange-400",
      icon: Loader2,
      text: status === "connected" ? "Disconnecting" : "Connecting",
    };
  }

  switch (status) {
    case "connected":
      return {
        variant: "default",
        color: "text-green-600 dark:text-green-400",
        icon: Bot,
        text: "Connected",
      };
    case "connecting":
      return {
        variant: "secondary",
        color: "text-orange-600 dark:text-orange-400",
        icon: Loader2,
        text: "Connecting",
      };
    case "disconnected":
    default:
      return {
        variant: "outline",
        color: "text-muted-foreground",
        icon: BotOff,
        text: "Offline",
      };
  }
};

export const AIAgentControl = ({
  className = "",
  status,
  loading,
  error,
  toggleAgent,
  checkStatus,
  channelId,
}) => {
  const statusConfig = getStatusConfig(status, loading);
  const StatusIcon = statusConfig.icon;

  const handleToggle = async () => {
    try {
      await toggleAgent();
      toast({
        title: status === "connected" ? "AI Disconnected" : "AI Connected",
        description:
          status === "connected"
            ? "AI assistant has been turned off"
            : "AI assistant is now active",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to toggle AI agent",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await checkStatus();
    toast({
      title: "Status Updated",
      description: "AI agent status has been refreshed",
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Badge - Only this spins when loading */}
      <Badge
        variant={statusConfig.variant}
        className={`${statusConfig.color} px-2 py-1 text-xs font-medium`}
      >
        <StatusIcon
          className={`h-3 w-3 mr-1 ${
            loading || status === "connecting" ? "animate-spin" : ""
          }`}
        />
        {statusConfig.text}
      </Badge>

      {/* Error Indicator */}
      {error && (
        <Badge variant="destructive" className="px-2 py-1 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )}

      {/* Control Buttons */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={status === "connected" ? "outline" : "default"}
          onClick={handleToggle}
          disabled={loading || !channelId}
          className="h-8 px-3 text-xs"
        >
          {status === "connected" ? (
            <BotOff className="h-3 w-3" />
          ) : (
            <Bot className="h-3 w-3" />
          )}
          <span className="ml-1 hidden sm:inline">
            {status === "connected" ? "Disconnect" : "Connect"}
          </span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleRefresh}
          disabled={loading || !channelId}
          className="h-8 w-8 p-0"
          title="Refresh status"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};