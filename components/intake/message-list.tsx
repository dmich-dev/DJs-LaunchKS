'use client';

import { type UIMessage } from 'ai';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: UIMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isUser = message.role === 'user';
        const textParts = message.parts.filter(part => part.type === 'text');

        return (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              isUser ? 'justify-end' : 'justify-start'
            )}
          >
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-accent-foreground" />
              </div>
            )}

            <div
              className={cn(
                'max-w-[70%] rounded-lg px-4 py-3',
                isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              )}
            >
              {textParts.map((part, index) => (
                <div key={index} className="prose prose-sm max-w-none">
                  {(part as { type: 'text'; text: string }).text}
                </div>
              ))}

              {/* Show tool invocations if present */}
              {message.parts.filter(part => part.type === 'tool-call').length > 0 && (
                <div className="mt-2 text-xs opacity-70">
                  🔍 Searching for information...
                </div>
              )}
            </div>

            {isUser && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="bg-muted rounded-lg px-4 py-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
