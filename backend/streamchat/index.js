import cors from "cors";
import "dotenv/config";
import express from "express";
import { createAgent } from "./agents/CreateAgent.js";
import { AgentPlatform } from "./agents/types.js";
import { getWritingAssistantInstructions } from "./agents/prompts/writingAssistantPrompt.js";
import { apiKey, serverClient } from "./serverClient.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Map to store the AI Agent instances
const aiAgentCache = new Map();
const pendingAiAgents = new Set();
const inFlightMessageRequests = new Map();

// TODO: temporary set to 8 hours, should be cleaned up at some point
const inactivityThreshold = 480 * 60 * 1000;

// Periodically check for inactive AI agents and dispose of them
setInterval(async () => {
  const now = Date.now();
  for (const [userId, aiAgent] of aiAgentCache) {
    if (now - aiAgent.getLastInteraction() > inactivityThreshold) {
      console.log(`[StreamChat] Disposing AI Agent due to inactivity: ${userId}`);
      await disposeAiAgent(aiAgent);
      aiAgentCache.delete(userId);
    }
  }
}, 5000);

app.get("/", (req, res) => {
  res.json({
    message: "AI Writing Assistant Server (Chat-Based Module) is running",
    apiKey: apiKey,
    activeAgents: aiAgentCache.size,
  });
});

/**
 * Handle the request to start the AI Agent
 * POST /api/v1/chat/start-agent
 * POST /api/v1/chat/start-ai-agent
 */
app.post("/start-agent", async (req, res) => {
  const { channel_id, channel_type = "messaging" } = req.body;
  console.log(`[StreamChat] /start-agent called for channel: ${channel_id}`);

  // Simple validation
  if (!channel_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const user_id = `ai-bot-${channel_id.replace(/[!]/g, "")}`;

  try {
    // Prevent multiple agents from being created for the same channel simultaneously
    if (!aiAgentCache.has(user_id) && !pendingAiAgents.has(user_id)) {
      console.log(`[StreamChat] Creating new agent for ${user_id}`);
      pendingAiAgents.add(user_id);

      await serverClient.upsertUser({
        id: user_id,
        name: "AI Writing Assistant",
      });

      const channel = serverClient.channel(channel_type, channel_id);
      await channel.addMembers([user_id]);

      const agent = await createAgent(
        user_id,
        AgentPlatform.OPENAI,
        channel_type,
        channel_id
      );

      await agent.init();
      // Final check to prevent race conditions where an agent might have been added
      // while this one was initializing.
      if (aiAgentCache.has(user_id)) {
        await agent.dispose();
      } else {
        aiAgentCache.set(user_id, agent);
      }
    } else {
      console.log(`[StreamChat] AI Agent ${user_id} already started or is pending.`);
    }

    res.json({ message: "AI Agent started", data: [] });
  } catch (error) {
    const errorMessage = error.message || error.toString();
    console.error("[StreamChat] Failed to start AI Agent:", errorMessage);
    res.status(500).json({
      error: "Failed to start AI Agent",
      reason: errorMessage,
    });
  } finally {
    pendingAiAgents.delete(user_id);
  }
});

// Route alias for frontend compatibility
app.post("/start-ai-agent", async (req, res) => {
  const { channel_id, channel_type = "messaging" } = req.body;
  console.log(`[StreamChat] /start-ai-agent called for channel: ${channel_id}`);

  // Simple validation
  if (!channel_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const user_id = `ai-bot-${channel_id.replace(/[!]/g, "")}`;

  try {
    // Prevent multiple agents from being created for the same channel simultaneously
    if (!aiAgentCache.has(user_id) && !pendingAiAgents.has(user_id)) {
      console.log(`[StreamChat] Creating new agent for ${user_id}`);
      pendingAiAgents.add(user_id);

      await serverClient.upsertUser({
        id: user_id,
        name: "AI Writing Assistant",
      });

      const channel = serverClient.channel(channel_type, channel_id);
      await channel.addMembers([user_id]);

      const agent = await createAgent(
        user_id,
        AgentPlatform.OPENAI,
        channel_type,
        channel_id
      );

      await agent.init();
      // Final check to prevent race conditions where an agent might have been added
      // while this one was initializing.
      if (aiAgentCache.has(user_id)) {
        await agent.dispose();
      } else {
        aiAgentCache.set(user_id, agent);
      }
    } else {
      console.log(`[StreamChat] AI Agent ${user_id} already started or is pending.`);
    }

    res.json({ message: "AI Agent started", data: [] });
  } catch (error) {
    const errorMessage = error.message || error.toString();
    console.error("[StreamChat] Failed to start AI Agent:", errorMessage);
    res.status(500).json({
      error: "Failed to start AI Agent",
      reason: errorMessage,
    });
  } finally {
    pendingAiAgents.delete(user_id);
  }
});

/**
 * Handle the request to stop the AI Agent
 * POST /api/v1/chat/stop-agent
 */
app.post("/stop-agent", async (req, res) => {
  const { channel_id } = req.body;
  console.log(`[StreamChat] /stop-agent called for channel: ${channel_id}`);
  const user_id = `ai-bot-${channel_id.replace(/[!]/g, "")}`;

  try {
    const aiAgent = aiAgentCache.get(user_id);
    if (aiAgent) {
      console.log(`[StreamChat] Disposing agent for ${user_id}`);
      await disposeAiAgent(aiAgent);
      aiAgentCache.delete(user_id);
    } else {
      console.log(`[StreamChat] Agent for ${user_id} not found in cache.`);
    }
    res.json({ message: "AI Agent stopped", data: [] });
  } catch (error) {
    const errorMessage = error.message || error.toString();
    console.error("[StreamChat] Failed to stop AI Agent:", errorMessage);
    res.status(500).json({
      error: "Failed to stop AI Agent",
      reason: errorMessage,
    });
  }
});

// Route alias for frontend compatibility
app.post("/stop-ai-agent", async (req, res) => {
  const { channel_id } = req.body;
  console.log(`[StreamChat] /stop-ai-agent called for channel: ${channel_id}`);
  const user_id = `ai-bot-${channel_id.replace(/[!]/g, "")}`;

  try {
    const aiAgent = aiAgentCache.get(user_id);
    if (aiAgent) {
      console.log(`[StreamChat] Disposing agent for ${user_id}`);
      await disposeAiAgent(aiAgent);
      aiAgentCache.delete(user_id);
    } else {
      console.log(`[StreamChat] Agent for ${user_id} not found in cache.`);
    }
    res.json({ message: "AI Agent stopped", data: [] });
  } catch (error) {
    const errorMessage = error.message || error.toString();
    console.error("[StreamChat] Failed to stop AI Agent:", errorMessage);
    res.status(500).json({
      error: "Failed to stop AI Agent",
      reason: errorMessage,
    });
  }
});

/**
 * Get the status of the AI Agent
 * GET /api/v1/chat/agent-status
 */
app.get("/agent-status", (req, res) => {
  const { channel_id } = req.query;
  if (!channel_id || typeof channel_id !== "string") {
    return res.status(400).json({ error: "Missing channel_id" });
  }

  const user_id = `ai-bot-${channel_id.replace(/[!]/g, "")}`;
  console.log(
    `[StreamChat] /agent-status called for channel: ${channel_id} (user: ${user_id})`
  );

  if (aiAgentCache.has(user_id)) {
    console.log(`[StreamChat] Status for ${user_id}: connected`);
    res.json({ status: "connected" });
  } else if (pendingAiAgents.has(user_id)) {
    console.log(`[StreamChat] Status for ${user_id}: connecting`);
    res.json({ status: "connecting" });
  } else {
    console.log(`[StreamChat] Status for ${user_id}: disconnected`);
    res.json({ status: "disconnected" });
  }
});

// Route alias for frontend compatibility
app.get("/status", (req, res) => {
  const { channel_id } = req.query;
  if (!channel_id || typeof channel_id !== "string") {
    return res.status(400).json({ error: "Missing channel_id" });
  }

  const user_id = `ai-bot-${channel_id.replace(/[!]/g, "")}`;
  console.log(
    `[StreamChat] /status called for channel: ${channel_id} (user: ${user_id})`
  );

  if (aiAgentCache.has(user_id)) {
    res.json({ status: "connected" });
  } else if (pendingAiAgents.has(user_id)) {
    res.json({ status: "connecting" });
  } else {
    res.json({ status: "disconnected" });
  }
});

/**
 * Token provider endpoint - generates secure tokens for Stream Chat
 * POST /token
 */
app.post("/token", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    // Create token with expiration (1 hour) and issued at time for security
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = issuedAt + 60 * 60; // 1 hour from now

    const token = serverClient.createToken(userId, expiration, issuedAt);

    res.json({ token });
  } catch (error) {
    console.error("[StreamChat] Error generating token:", error);
    res.status(500).json({
      error: "Failed to generate token",
    });
  }
});

/**
 * Send message to AI and get streaming response
 * POST /send-message
 */
app.post("/send-message", async (req, res) => {
  let requestKey;
  try {
    const { channel_id, message, conversation_history } = req.body;

    if (!channel_id || !message) {
      return res.status(400).json({
        error: "Missing required fields: channel_id, message",
      });
    }

    const normalizedMessage = String(message).trim();
    requestKey = `${channel_id}::${normalizedMessage.toLowerCase()}`;
    const existingRequest = inFlightMessageRequests.get(requestKey);
    const now = Date.now();

    if (existingRequest && now - existingRequest.startedAt < 15000) {
      return res.status(409).json({
        error: "Duplicate message request ignored",
      });
    }

    inFlightMessageRequests.set(requestKey, { startedAt: now });

    console.log(`[StreamChat] /send-message called for channel: ${channel_id}`);

    // Set response headers for streaming
    res.setHeader("Content-Type", "text/plain charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
      const systemPrompt = getWritingAssistantInstructions();

      const safeHistory = Array.isArray(conversation_history)
        ? conversation_history.slice(-20)
        : [];

      // Format messages for OpenAI
      const messages = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...safeHistory,
        {
          role: "user",
          content: message,
        },
      ];

      console.log(`[StreamChat] Calling OpenAI with ${messages.length} messages`);

      // Get streaming response from OpenAI
      const stream = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      });

      // Stream the response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(content);
        }
      }

      console.log(`[StreamChat] ✅ Stream completed for channel: ${channel_id}`);
      res.end();
    } catch (error) {
      console.error("[StreamChat] OpenAI error:", error.message);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Failed to get AI response",
          reason: error.message,
        });
      } else {
        res.write(`\n\nError: ${error.message}`);
        res.end();
      }
    }
  } catch (error) {
    console.error("[StreamChat] Endpoint error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  } finally {
    if (requestKey) {
      inFlightMessageRequests.delete(requestKey);
    }
  }
});

/**
 * Dispose AI Agent and clean up resources
 */
async function disposeAiAgent(aiAgent) {
  await aiAgent.dispose();
  if (!aiAgent.user) {
    return;
  }
  await serverClient.deleteUser(aiAgent.user.id, {
    hard_delete: true,
  });
}

// Export app for mounting in main server
export default app;