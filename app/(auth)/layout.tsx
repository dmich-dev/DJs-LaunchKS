import Link from 'next/link';
import { GuestRoute } from '@/components/providers/session-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
        {/* Header with logo */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-primary">LaunchKS</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/50 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Powered by Kansas Department of Labor</p>
          </div>
        </footer>
      </div>
    </GuestRoute>
  );
}
