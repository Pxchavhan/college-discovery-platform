"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import CollegeCard from "../../components/CollegeCard";
import { Loader2, BookmarkX } from "lucide-react";
import Link from "next/link";

interface College {
  id: number;
  name: string;
  location: string;
  description: string;
  established: number;
}

export default function SavedColleges() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/user/saved", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setColleges(data);
        }
      } catch (err) {
        console.error("Failed to fetch saved colleges");
      } finally {
        setFetching(false);
      }
    };

    if (user && token) {
      fetchSaved();
    }
  }, [user, token]);

  if (loading || (user && fetching)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Saved Colleges</h1>
          <p className="text-slate-400">Manage and compare your favorite institutions.</p>
        </div>

        {colleges.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <BookmarkX className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No saved colleges yet</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Explore our directory and bookmark colleges you're interested in.
            </p>
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20"
            >
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college) => (
              <CollegeCard 
                key={college.id} 
                college={college} 
                isSaved={true}
                onSaveToggle={async () => {
                  try {
                    await fetch(`http://localhost:5000/api/user/saved/${college.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setColleges(prev => prev.filter(c => c.id !== college.id));
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
