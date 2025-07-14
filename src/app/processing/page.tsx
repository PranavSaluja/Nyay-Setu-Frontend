"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentStatus {
  document_loaded: boolean;
}

export default function Step2Page() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  const [, setStatusChecked] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Uploading...');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/status`);
        if (!res.ok) throw new Error("Failed to fetch status");

        const data: DocumentStatus = await res.json();

        if (data.document_loaded) {
          clearInterval(interval);
          setLoadingMessage('Document uploaded successfully. Redirecting...');
          setTimeout(() => {
            router.push('/ask');
          }, 1500);
        } else {
          // Once the first check happens, show "Analyzing..." instead of "Uploading..."
          setStatusChecked(true);
          setLoadingMessage('Analyzing your document...');
        }
      } catch (err) {
        console.error("Status polling error:", err);
        setLoadingMessage("Waiting for upload to complete...");
      }
    }, 3000); // check every 3 sec

    return () => clearInterval(interval);
  }, [API_BASE_URL, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="text-center">
        <div className="animate-spin w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h1 className="text-3xl font-bold text-white mb-2">{loadingMessage}</h1>
        <p className="text-slate-300">Please wait while we process your file.</p>
      </div>
    </div>
  );
}
