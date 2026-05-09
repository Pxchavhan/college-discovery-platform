"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        We couldn't load the college details. {error.message}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium border border-slate-600"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
