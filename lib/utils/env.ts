/**
 * Get the application base URL
 */
export function getAppUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'https://launchks.vercel.app';
  }

  // In development, prefer explicit URLs or fall back to localhost
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    'http://localhost:3000'
  );
}

