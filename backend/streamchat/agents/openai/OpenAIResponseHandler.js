export class OpenAIResponseHandler {
  constructor(openai, thread, run, chatClient, channel, channelMessage, onComplete) {
    this.openai = openai;
    this.thread = thread;
    this.openAiRun = run;
    this.chatClient = chatClient;
    this.channel = channel;
    this.channelMessage = channelMessage;
    this.onComplete = onComplete;
  }

  run = async () => {
    try {
      // Process the stream
      for await (const event of this.openAiRun) {
        if (event.event === "thread.message.completed") {
          const messages = await this.openai.beta.threads.messages.list(
            this.thread.id
          );

          const lastMessage = messages.data[0];
          if (lastMessage && lastMessage.content[0]) {
            const content = lastMessage.content[0];
            if (content.type === "text") {
              await this.channel.sendMessage({
                text: content.text.value,
                ai_generated: true,
                reply_to: this.channelMessage.id,
              });

              await this.channel.sendEvent({
                type: "ai_indicator.update",
                ai_state: "AI_STATE_IDLE",
                cid: this.channelMessage.cid,
                message_id: this.channelMessage.id,
              });
            }
          }
        } else if (event.event === "thread.run.failed") {
          console.error("Run failed:", event.data.last_error);
          await this.channel.sendEvent({
            type: "ai_indicator.update",
            ai_state: "AI_STATE_ERROR",
            cid: this.channelMessage.cid,
            message_id: this.channelMessage.id,
          });
        }
      }
    } catch (error) {
      console.error("Error processing OpenAI response:", error);
      await this.channel.sendEvent({
        type: "ai_indicator.update",
        ai_state: "AI_STATE_ERROR",
        cid: this.channelMessage.cid,
        message_id: this.channelMessage.id,
      });
    } finally {
      if (this.onComplete) {
        this.onComplete();
      }
    }
  };

  dispose = async () => {
    // Cleanup resources
  };
}