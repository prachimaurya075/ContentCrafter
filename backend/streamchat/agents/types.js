// Agent Platform constants
export const AgentPlatform = {
  OPENAI: "openai",
  WRITING_ASSISTANT: "writing_assistant",
};

/**
 * @typedef {Object} AIAgent
 * @property {User} [user] - Optional user object
 * @property {Channel} channel - Stream Chat channel
 * @property {StreamChat} chatClient - Stream Chat client
 * @property {() => number} getLastInteraction - Get last interaction timestamp
 * @property {() => Promise<void>} init - Initialize agent
 * @property {() => Promise<void>} dispose - Dispose agent
 */

/**
 * @typedef {Object} WritingMessage
 * @property {Object} [custom] - Custom message properties
 * @property {string} [custom.messageType] - Type of message
 * @property {string} [custom.writingTask] - Writing task description
 * @property {string[]} [custom.suggestions] - Message suggestions
 */
