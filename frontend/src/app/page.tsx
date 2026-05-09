"use client";

import { useState, useEffect } from "react";
import CollegeCard from "@/components/CollegeCard";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  description?: string;
  established?: number;
  fees?: number;
  rating?: number;
  placementPct?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SavedPage() {
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchSavedColleges = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/user/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch saved colleges");

        const data = await res.json();

        // Transform null values to undefined to match CollegeCard interface
        const transformedData = data.map((college: any) => ({
          id: college.id,
          name: college.name,
          location: college.location,
          description: college.description ?? undefined,
          established: college.established ?? undefined,
          fees: college.fees ?? undefined,
          rating: college.rating ?? undefined,
          placementPct: college.placementPct ?? undefined,
        }));

        setSavedColleges(transformedData);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
        console.error("Failed to fetch saved colleges", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedColleges();
  }, [user, token]);

  const handleUnsave = async (collegeId: number) => {
    if (!user || !token) return;

    try {
      const res = await fetch(`${API_URL}/api/user/saved/${collegeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to remove from saved");

      // Remove from local state
      setSavedColleges(prev => prev.filter(college => college.id !== collegeId));
    } catch (error) {
      console.error("Failed to unsave college", error);
      setError("Failed to remove college from saved list");
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto py-20 px-4 text-center">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-12 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-slate-200 mb-3">Please Login</h2>
            <p className="text-slate-400">You need to be logged in to view your saved colleges.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            Saved Colleges
          </h1>
          <p className="text-slate-400">Colleges you've bookmarked for later</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && savedColleges.length === 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No saved colleges yet</h3>
            <p className="text-slate-400 mb-6">Start exploring and bookmark colleges you're interested in!</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all"
            >
              Browse Colleges
            </a>
          </div>
        )}

        {/* Saved Colleges Grid */}
        {!loading && !error && savedColleges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                isSaved={true}
                onSaveToggle={() => handleUnsave(college.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}