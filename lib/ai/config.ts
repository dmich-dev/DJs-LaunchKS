import { openai } from '@ai-sdk/openai';

/**
 * OpenAI model configuration for LaunchKS
 * Using GPT-5 for high-quality career guidance with structured outputs
 */
export const aiModel = openai('gpt-5');

/**
 * Alternative model for less critical tasks (cost optimization)
 */
export const aiModelFast = openai('gpt-5-mini');

/**
 * AI generation settings
 */
export const aiSettings = {
  // Maximum tokens for responses
  maxTokens: 1000,

  // Temperature for creativity (0.7 is balanced)
  temperature: 0.7,

  // Top P for nucleus sampling
  topP: 0.9,
};

/**
 * Rate limiting and usage settings
 */
export const aiLimits = {
  // Maximum messages per conversation
  maxMessagesPerConversation: 100,

  // Maximum tool calls per message
  maxToolCallsPerMessage: 5,

  // Maximum search results per tool call
  maxSearchResults: 10,
};
