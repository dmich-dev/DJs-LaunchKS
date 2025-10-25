'use client';

import { type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Share your career goals and aspirations..."
              className="min-h-[64px] max-h-[200px] resize-none rounded-2xl border-2 border-gray-200 focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-all duration-200 pr-4 shadow-sm text-[15px] placeholder:text-gray-400"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                }
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className={cn(
              "h-[64px] w-[64px] rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg",
              input.trim() 
                ? "bg-gradient-to-br from-[#FFC107] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] text-[#223344]" 
                : "bg-gray-100 text-gray-400"
            )}
          >
            <Send className={cn(
              "w-6 h-6 transition-transform duration-200",
              input.trim() && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            )} />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">Enter</kbd> for new line
          </p>
          {isLoading && (
            <p className="text-xs text-[#FFC107] font-medium animate-pulse">
              AI is thinking...
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
