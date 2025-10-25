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

  // Show "Generate Plan" button after sufficient exchanges (~10 messages from user)
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const showGenerateButton = userMessageCount >= 10 && conversationId;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 border-b">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Career Planning Conversation</h1>
          <p className="text-sm opacity-90">Let's explore your career goals together</p>
        </div>
      </header>

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
