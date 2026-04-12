// Agent platform constants (replaces TypeScript enum)
export const AgentPlatform = {
  GEMINI: 'gemini',
  WRITING_ASSISTANT: 'writing_assistant',
  OPENAI: 'openai',
};

// Message types
export const MessageType = {
  USER_INPUT: 'user_input',
  AI_RESPONSE: 'ai_response',
  SYSTEM_MESSAGE: 'system_message',
};

// AI states
export const AIState = {
  THINKING: 'AI_STATE_THINKING',
  GENERATING: 'AI_STATE_GENERATING',
  EXTERNAL_SOURCES: 'AI_STATE_EXTERNAL_SOURCES',
  ERROR: 'AI_STATE_ERROR',
  CLEARED: 'AI_STATE_CLEARED',
};
