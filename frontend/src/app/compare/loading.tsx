import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded mb-8"></div>
        <div className="h-12 w-64 bg-slate-800 rounded mb-12"></div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl h-[600px] w-full"></div>
      </div>
    </div>
  );
}
