import { StreamChat } from "stream-chat";
import { apiKey, serverClient } from "../serverClient.js";
import { OpenAIAgent } from "./openai/OpenAIAgent.js";
import { AgentPlatform } from "./types.js";

export const createAgent = async (
  user_id,
  platform,
  channel_type,
  channel_id
) => {
  const token = serverClient.createToken(user_id);
  // This is the client for the AI bot user
  const chatClient = new StreamChat(apiKey, undefined, {
    allowServerSideConnect: true,
  });

  await chatClient.connectUser({ id: user_id }, token);
  const channel = chatClient.channel(channel_type, channel_id);
  await channel.watch();

  switch (platform) {
    case AgentPlatform.WRITING_ASSISTANT:
    case AgentPlatform.OPENAI:
      return new OpenAIAgent(chatClient, channel);
    default:
      throw new Error(`Unsupported agent platform: ${platform}`);
  }
};