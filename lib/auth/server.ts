import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, type User, type Session } from './index';

type SessionResponse = {
  user: User;
  session: Session;
} | null;

export const getSession = cache(async (): Promise<SessionResponse> => {
  const headersList = await headers();

  return await auth.api.getSession({
    headers: headersList,
  }) as SessionResponse;
});

export const requireAuth = cache(async (): Promise<NonNullable<SessionResponse>> => {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return session;
});


export async function getSessionFromRequest(req: Request): Promise<SessionResponse> {
  return await auth.api.getSession({
    headers: req.headers,
  }) as SessionResponse;
}
