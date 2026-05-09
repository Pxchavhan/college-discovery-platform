import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-md mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 group opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">CollegeFinder</span>
        </div>
        
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} CollegeFinder Platform. All rights reserved.
        </p>
        
        <div className="flex gap-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
