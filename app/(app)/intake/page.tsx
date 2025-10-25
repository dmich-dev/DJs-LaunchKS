'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { type FormEvent, useState, useEffect } from 'react';
import { MessageList } from '@/components/intake/message-list';
import { ChatInput } from '@/components/intake/chat-input';
import { GeneratePlanCTA } from '@/components/intake/generate-plan-cta';
import { INITIAL_INTAKE_MESSAGE } from '@/lib/ai';

type MessageMetadata = {
  conversationId?: string;
};

type IntakeMessage = UIMessage<MessageMetadata>;

export default function IntakePage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat<IntakeMessage>({
    transport: new DefaultChatTransport({
      api: '/api/intake/chat',
      body: () => ({
        conversationId,
      }),
    }),
    messages: [
      {
        id: 'initial',
        role: 'assistant',
        parts: [{ type: 'text', text: INITIAL_INTAKE_MESSAGE }],
      },
    ],
  });

  // Extract conversation ID from message metadata
  useEffect(() => {
    const firstAssistantMessage = messages.find(
      (m) => m.role === 'assistant' && m.metadata?.conversationId
    );
    if (firstAssistantMessage?.metadata?.conversationId && !conversationId) {
      setConversationId(firstAssistantMessage.metadata.conversationId);
    }
  }, [messages, conversationId]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleQuickResponse = (text: string) => {
    sendMessage({ text });
  };

  // Show "Generate Plan" button after sufficient exchanges (~8 messages from user)
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const showGenerateButton = userMessageCount >= 8 && conversationId;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFD54F] flex items-center justify-center shadow-sm">
            <span className="text-[#223344] font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#223344]">Career Planning Assistant</h1>
            <p className="text-xs text-gray-500">Share your goals and let&apos;s build your path</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onQuickResponse={handleQuickResponse}
      />

      {/* Generate Button */}
      {showGenerateButton && <GeneratePlanCTA conversationId={conversationId} />}

      {/* Input */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
