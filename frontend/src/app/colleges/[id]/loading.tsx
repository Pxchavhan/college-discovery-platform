export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded mb-8"></div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 h-96"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl h-40"></div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl h-40"></div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl h-64"></div>
      </div>
    </div>
  );
}
