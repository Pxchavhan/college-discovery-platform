import { MapPin, Calendar, Star, IndianRupee, Briefcase, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface College {
  id: number;
  name: string;
  location: string;
  description: string;
  established: number;
  fees: number;
  placements: string;
  placementPct: number;
  rating: number;
  courses: string[];
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  
  if (!ids) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">No Colleges Selected</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Please select colleges from the home page to compare them.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium">
          Browse Colleges
        </Link>
      </div>
    );
  }

  const res = await fetch(`http://localhost:5000/api/colleges/compare?ids=${ids}`, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error("Failed to fetch compare data");
  }
  
  const colleges: College[] = await res.json();
  
  if (colleges.length === 0) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
          &larr; Back to all colleges
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12">Compare Colleges</h1>
        
        <div className="overflow-x-auto pb-8">
          <table className="w-full min-w-[800px] border-collapse bg-slate-900/30 rounded-2xl border border-white/5">
            <thead>
              <tr>
                <th className="w-1/4 p-6 border-b border-r border-white/5 text-left font-semibold text-slate-300 align-bottom">
                  <span className="text-xl">Features</span>
                </th>
                {colleges.map((c) => (
                  <th key={c.id} className="w-1/4 p-6 border-b border-r border-white/5 bg-white/5">
                    <Link href={`/colleges/${c.id}`} className="block text-2xl font-bold text-white hover:text-blue-400 transition-colors mb-2 text-center">
                      {c.name}
                    </Link>
                    <div className="flex items-center justify-center gap-1.5 text-sm font-normal text-slate-400">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {c.location}
                    </div>
                  </th>
                ))}
                {[...Array(3 - colleges.length)].map((_, i) => (
                  <th key={`empty-${i}`} className="w-1/4 p-6 border-b border-r border-white/5 bg-slate-900/20">
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 min-h-[100px]">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-2">
                        +
                      </div>
                      <span className="text-sm font-medium">Add College</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating */}
              <tr>
                <td className="p-6 border-b border-r border-white/5 font-medium text-slate-400 flex items-center gap-3 h-full">
                  <Star className="w-5 h-5 text-yellow-500" /> Rating
                </td>
                {colleges.map(c => (
                  <td key={c.id} className="p-6 border-b border-r border-white/5 text-center text-xl font-semibold text-white bg-white/5">
                    {c.rating} <span className="text-sm text-slate-500 font-normal">/ 5.0</span>
                  </td>
                ))}
                {[...Array(3 - colleges.length)].map((_, i) => <td key={`rating-empty-${i}`} className="p-6 border-b border-r border-white/5 bg-slate-900/20"></td>)}
              </tr>
              
              {/* Fees */}
              <tr>
                <td className="p-6 border-b border-r border-white/5 font-medium text-slate-400 flex items-center gap-3 h-full">
                  <IndianRupee className="w-5 h-5 text-emerald-400" /> Average Fees
                </td>
                {colleges.map(c => (
                  <td key={c.id} className="p-6 border-b border-r border-white/5 text-center text-xl font-semibold text-white bg-white/5">
                    ₹{c.fees?.toLocaleString('en-IN') || "N/A"}
                  </td>
                ))}
                {[...Array(3 - colleges.length)].map((_, i) => <td key={`fees-empty-${i}`} className="p-6 border-b border-r border-white/5 bg-slate-900/20"></td>)}
              </tr>

              {/* Avg Package */}
              <tr>
                <td className="p-6 border-b border-r border-white/5 font-medium text-slate-400 flex items-center gap-3 h-full">
                  <Briefcase className="w-5 h-5 text-blue-400" /> Avg Package
                </td>
                {colleges.map(c => (
                  <td key={c.id} className="p-6 border-b border-r border-white/5 text-center text-xl font-semibold text-white bg-white/5">
                    {c.placements || "N/A"}
                  </td>
                ))}
                {[...Array(3 - colleges.length)].map((_, i) => <td key={`pkg-empty-${i}`} className="p-6 border-b border-r border-white/5 bg-slate-900/20"></td>)}
              </tr>

              {/* Placement Pct */}
              <tr>
                <td className="p-6 border-b border-r border-white/5 font-medium text-slate-400 flex items-center gap-3 h-full">
                  <Briefcase className="w-5 h-5 text-purple-400" /> Placement %
                </td>
                {colleges.map(c => (
                  <td key={c.id} className="p-6 border-b border-r border-white/5 text-center text-xl font-semibold text-white bg-white/5">
                    {c.placementPct ? `${c.placementPct}%` : "N/A"}
                  </td>
                ))}
                {[...Array(3 - colleges.length)].map((_, i) => <td key={`pct-empty-${i}`} className="p-6 border-b border-r border-white/5 bg-slate-900/20"></td>)}
              </tr>

              {/* Courses */}
              <tr>
                <td className="p-6 border-r border-white/5 font-medium text-slate-400 flex items-start gap-3 h-full pt-8">
                  <BookOpen className="w-5 h-5 text-indigo-400 mt-1" /> Top Courses
                </td>
                {colleges.map(c => (
                  <td key={c.id} className="p-6 border-r border-white/5 bg-white/5 align-top">
                    <ul className="space-y-3 text-slate-300">
                      {c.courses?.slice(0, 4).map((course, idx) => (
                        <li key={idx} className="flex items-center gap-3 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" /> 
                          <span className="font-medium text-sm">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {[...Array(3 - colleges.length)].map((_, i) => <td key={`courses-empty-${i}`} className="p-6 border-r border-white/5 bg-slate-900/20"></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
