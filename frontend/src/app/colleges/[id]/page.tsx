import { MapPin, Calendar, BookOpen, Star, IndianRupee, Briefcase, TrendingUp, GraduationCap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function CollegeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/api/colleges/${id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch college details");
  }
  
  const college = await res.json();
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/8 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/8 blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-10 transition-colors text-sm font-medium">
          ← Back to colleges
        </Link>
        
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <GraduationCap className="w-56 h-56" />
          </div>
          
          <div className="relative z-10">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {college.rating !== null && college.rating !== undefined && (
                <div className="flex items-center gap-1.5 bg-yellow-500/15 text-yellow-300 rounded-full px-4 py-1.5 border border-yellow-500/25 font-semibold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{college.rating.toFixed(1)} / 10.0</span>
                </div>
              )}
              {college.established && (
                <div className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 rounded-full px-4 py-1.5 border border-emerald-500/25 font-medium text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {college.established}</span>
                </div>
              )}
              {college.placementPct !== null && college.placementPct !== undefined && (
                <div className="flex items-center gap-1.5 bg-blue-500/15 text-blue-300 rounded-full px-4 py-1.5 border border-blue-500/25 font-medium text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{college.placementPct}% Placement Rate</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {college.name}
            </h1>
            
            <div className="flex items-center gap-2 text-slate-400 text-base mb-8">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span>{college.location}</span>
            </div>
            
            <p className="text-slate-400 leading-relaxed max-w-3xl text-base md:text-lg">
              {college.description}
            </p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {college.fees !== null && college.fees !== undefined && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/8 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/25 transition-colors">
                <IndianRupee className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Annual Fees</p>
                <p className="text-2xl font-bold text-white">₹{college.fees.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500 mt-1">Per academic year</p>
              </div>
            </div>
          )}
          
          {college.placements && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/8 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Avg. Package</p>
                <p className="text-2xl font-bold text-white">{college.placements}</p>
                <p className="text-xs text-slate-500 mt-1">Median campus placement</p>
              </div>
            </div>
          )}
        </div>

        {/* Courses */}
        {college.courses?.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Programs Offered
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {college.courses.map((course: string, i: number) => (
                <div key={i} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3.5 flex items-center gap-3 hover:border-blue-500/30 hover:bg-slate-800/50 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{course}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
