import CollegeList from "@/components/CollegeList";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        {/* Header/Hero Section */}
        <header className="pt-20 pb-12 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 drop-shadow-sm">
              Discover Your Future
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              Find the perfect college that fits your goals, location, and aspirations.
            </p>
          </div>
        </header>

        {/* College Listing */}
        <CollegeList />
      </div>
    </main>
  );
}
