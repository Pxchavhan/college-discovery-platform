"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CollegeCard from "./CollegeCard";
import { useAuth } from "../context/AuthContext";

// FIX: Change null to undefined to match CollegeCard
interface College {
  id: number;
  name: string;
  location: string;
  description: string;
  established?: number;  // Changed from 'number | null'
  fees?: number;         // Changed from 'number | null'
  rating?: number;       // Changed from 'number | null'
  placementPct?: number; // Changed from 'number | null'
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { user, token } = useAuth();
  const router = useRouter();

  // Compare & Save functionality
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    if (user && token) {
      fetch(`${API_URL}/api/user/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSavedIds(data.map((c: any) => c.id));
          }
        })
        .catch(console.error);
    } else {
      setSavedIds([]);
    }
  }, [user, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchColleges(1, true);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, location]);

  const fetchColleges = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: "6",
      });

      if (search) queryParams.append("search", search);
      if (location) queryParams.append("location", location);

      const res = await fetch(`${API_URL}/api/colleges?${queryParams.toString()}`);

      if (!res.ok) throw new Error("Failed to fetch colleges");

      const data = await res.json();

      // FIX: Transform the data to convert null to undefined
      const transformedData = data.data.map((college: any) => ({
        ...college,
        established: college.established ?? undefined,
        fees: college.fees ?? undefined,
        rating: college.rating ?? undefined,
        placementPct: college.placementPct ?? undefined,
      }));

      setColleges(prev => reset ? transformedData : [...prev, ...transformedData]);
      setHasMore(data.page < data.totalPages);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchColleges(nextPage);
  };

  const toggleCompare = (id: number) => {
    setCompareError(null);
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(cId => cId !== id);
      if (prev.length >= 3) {
        setCompareError("You can only compare up to 3 colleges at once.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSaveToggle = async (id: number) => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    const isSaved = savedIds.includes(id);
    try {
      if (isSaved) {
        await fetch(`${API_URL}/api/user/saved/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedIds(prev => prev.filter(sId => sId !== id));
      } else {
        await fetch(`${API_URL}/api/user/saved`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ collegeId: id })
        });
        setSavedIds(prev => [...prev, id]);
      }
    } catch (error) {
      console.error("Failed to toggle save", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
      {compareError && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-red-400 text-sm font-medium animate-in slide-in-from-top-4 fade-in duration-300">
          {compareError}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-12 flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Search colleges by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative sm:max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 flex items-center gap-4 mb-8 text-red-400">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {colleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={college}
            isSelected={compareIds.includes(college.id)}
            onToggleCompare={toggleCompare}
            isSaved={savedIds.includes(college.id)}
            onSaveToggle={handleSaveToggle}
          />
        ))}

        {/* Loading Skeletons */}
        {loading && (
          <>
            {[...Array(colleges.length === 0 ? 6 : 3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col h-[260px] animate-pulse">
                <div className="w-12 h-12 rounded-full bg-slate-700/50 mb-5" />
                <div className="h-6 w-3/4 bg-slate-700/50 rounded-md mb-4" />
                <div className="h-4 w-full bg-slate-700/50 rounded-md mb-2" />
                <div className="h-4 w-5/6 bg-slate-700/50 rounded-md mb-6" />
                <div className="mt-auto flex gap-2">
                  <div className="h-8 w-24 bg-slate-700/50 rounded-full" />
                  <div className="h-8 w-24 bg-slate-700/50 rounded-full" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Empty State */}
      {!loading && colleges.length === 0 && !error && (
        <div className="text-center py-20 px-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Search className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-200 mb-2">No colleges found</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            We couldn't find any colleges matching your search criteria. Try adjusting your filters or search term.
          </p>
          {(search || location) && (
            <button
              onClick={() => { setSearch(''); setLocation(''); }}
              className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium border border-slate-600"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && colleges.length > 0 && (
        <div className="mt-12 flex justify-center pb-20">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-900/40 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Colleges"
            )}
          </button>
        </div>
      )}

      {/* Floating Compare Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom-8 duration-300 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 text-blue-400 font-bold px-3 py-1.5 rounded-lg border border-blue-500/30">
                {compareIds.length} / 3
              </div>
              <span className="text-slate-200 font-medium hidden sm:inline">Colleges selected to compare</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCompareIds([])}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors font-medium"
              >
                Clear
              </button>
              <Link
                href={`/compare?ids=${compareIds.join(',')}`}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}