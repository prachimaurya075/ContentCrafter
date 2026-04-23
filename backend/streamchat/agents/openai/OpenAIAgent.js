import OpenAI from "openai";
import { OpenAIResponseHandler } from "./OpenAIResponseHandler.js";
import { getWritingAssistantInstructions } from "../prompts/writingAssistantPrompt.js";

export class OpenAIAgent {
  openai;
  assistant;
  openAiThread;
  lastInteractionTs = Date.now();
  handlers = [];

  constructor(chatClient, channel) {
    this.chatClient = chatClient;
    this.channel = channel;
  }

  dispose = async () => {
    this.chatClient.off("message.new", this.handleMessage);
    await this.chatClient.disconnectUser();

    this.handlers.forEach((handler) => handler.dispose());
    this.handlers = [];
  };

  get user() {
    return this.chatClient.user;
  }

  getLastInteraction = () => this.lastInteractionTs;

  init = async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    this.openai = new OpenAI({ apiKey });
    this.assistant = await this.openai.beta.assistants.create({
      name: "AI Writing Assistant",
      instructions: getWritingAssistantInstructions(),
      model: "gpt-4o",
      tools: [
        { type: "code_interpreter" },
        {
          type: "function",
          function: {
            name: "web_search",
            description:
              "Search the web for current information, news, facts, or research on any topic",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to find information about",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      temperature: 0.7,
    });
    this.openAiThread = await this.openai.beta.threads.create();

    this.chatClient.on("message.new", this.handleMessage);
  };

  handleMessage = async (e) => {
    if (!this.openai || !this.openAiThread || !this.assistant) {
      console.log("OpenAI not initialized");
      return;
    }

    if (!e.message || e.message.ai_generated) {
      return;
    }

    const message = e.message.text;
    if (!message) return;

    this.lastInteractionTs = Date.now();

    const writingTask = e.message.custom?.writingTask;
    const instructions = getWritingAssistantInstructions({
      writingTask: writingTask ? `Writing Task: ${writingTask}` : undefined,
    });

    await this.openai.beta.threads.messages.create(this.openAiThread.id, {
      role: "user",
      content: message,
    });

    const indicatorCid = this.channel?.cid;
    const indicatorMessageId = e?.message?.id;

    if (indicatorCid && indicatorMessageId) {
      await this.channel.sendEvent({
        type: "ai_indicator.update",
        ai_state: "AI_STATE_THINKING",
        cid: indicatorCid,
        message_id: indicatorMessageId,
      });
    }

    const run = this.openai.beta.threads.runs.createAndStream(
      this.openAiThread.id,
      {
        assistant_id: this.assistant.id,
        instructions,
      }
    );

    const handler = new OpenAIResponseHandler(
      this.openai,
      this.openAiThread,
      run,
      this.chatClient,
      this.channel,
      {
        cid: indicatorCid,
        messageId: indicatorMessageId,
      },
      () => this.removeHandler(handler)
    );
    this.handlers.push(handler);
    void handler.run();
  };

  removeHandler = (handlerToRemove) => {
    this.handlers = this.handlers.filter(
      (handler) => handler !== handlerToRemove
    );
  };
}
