import { GuestRoute } from '@/components/providers/session-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>;
}
