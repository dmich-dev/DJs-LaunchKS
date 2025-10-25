'use client';

import { type UIMessage } from 'ai';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto space-y-6">
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
            <div 
              key={message.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div
                className={cn(
                  'flex gap-3 md:gap-4',
                  isUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!isUser && (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFD54F] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#223344]" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-sm transition-all hover:shadow-md',
                    isUser
                      ? 'bg-gradient-to-br from-[#223344] to-[#334455] text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-[#223344] rounded-bl-sm'
                  )}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{displayText}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-2 prose-p:leading-relaxed prose-headings:my-3 prose-headings:text-[#223344] prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-[#223344] prose-strong:font-semibold prose-a:text-[#007BFF] prose-a:no-underline hover:prose-a:underline">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {displayText}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Show tool invocations if present */}
                  {message.parts.filter(part => part.type === 'tool-call').length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#FFC107] bg-[#FFF9E6] px-3 py-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-[#FFC107] rounded-full animate-pulse" />
                      Searching for information...
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Quick Response Options */}
              {showResponseOptions && onQuickResponse && (
                <div className="flex gap-2 flex-wrap mt-4 ml-12 md:ml-14 animate-in fade-in slide-in-from-top-2 duration-300 delay-150">
                  {responseOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => onQuickResponse(option)}
                      className="group px-4 py-2.5 text-sm font-medium bg-white border-2 border-[#FFC107]/30 text-[#223344] rounded-xl hover:border-[#FFC107] hover:bg-[#FFF9E6] hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span className="group-hover:text-[#223344]">{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 md:gap-4 justify-start animate-in fade-in duration-300">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFD54F] flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#223344] animate-pulse" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#FFC107] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-[#FFC107] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-[#FFC107] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
