'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BASE_URL } from '../../utils/constants';

export default function OAuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code'); // Extract the `code` parameter from the URL

      if (!code) {
        setError('Authorization code not found in URL.');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/auth/calendly`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to handle OAuth callback');
        }

        const data = await response.json();

        if (data.token) {
          router.push('/dashboard/calendly'); // Redirect on success
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1C1C1C] rounded-md">
      <h1 className="text-2xl font-bold mb-4">Processing OAuth Callback</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-blue-600">Redirecting...</p>
      )}
    </div>
  );
}
