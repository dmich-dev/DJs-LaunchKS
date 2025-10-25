'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            border: '2px solid #DC3545',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              backgroundColor: '#FEE',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
            }}>
              ⚠️
            </div>

            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}>
              Critical Error
            </h1>

            <p style={{
              color: '#666',
              marginBottom: '1.5rem',
            }}>
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>

            <button
              onClick={reset}
              style={{
                backgroundColor: '#223344',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
