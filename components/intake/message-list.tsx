'use client';

import { type UIMessage } from 'ai';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageListProps {
  messages: UIMessage[];
  isLoading?: boolean;
  onQuickResponse?: (text: string) => void;
}

function parseResponseOptions(text: string): string[] | null {
  const regex = /<response_options>\s*([\s\S]*?)\s*<\/response_options>/;
  const match = text.match(regex);

  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse response options:', e);
    }
  }

  return null;
}

function removeResponseOptions(text: string): string {
  return text.replace(/<response_options>[\s\S]*?<\/response_options>/g, '').trim();
}

export function MessageList({ messages, isLoading, onQuickResponse }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, messageIndex) => {
        const isUser = message.role === 'user';
        const textParts = message.parts.filter(part => part.type === 'text');
        const fullText = textParts.map(part => (part as { type: 'text'; text: string }).text).join('\n');

        // Parse response options for assistant messages
        const responseOptions = !isUser ? parseResponseOptions(fullText) : null;
        const displayText = !isUser ? removeResponseOptions(fullText) : fullText;

        // Only show response options on the last assistant message
        const isLastMessage = messageIndex === messages.length - 1;
        const showResponseOptions = !isUser && responseOptions && isLastMessage && !isLoading;

        return (
          <div key={message.id}>
            <div
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
                {isUser ? (
                  <div className="whitespace-pre-wrap">{displayText}</div>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {displayText}
                    </ReactMarkdown>
                  </div>
                )}

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

            {/* Quick Response Options */}
            {showResponseOptions && onQuickResponse && (
              <div className="flex gap-2 flex-wrap mt-3 ml-11">
                {responseOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQuickResponse(option)}
                    className="px-3 py-2 text-sm font-medium bg-background border-2 border-accent/50 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {option}
                  </button>
                ))}
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
