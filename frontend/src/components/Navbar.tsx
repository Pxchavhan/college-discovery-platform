"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LogOut, Bookmark, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">CollegeFinder</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/saved" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5">
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved</span>
                </Link>
                <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors px-4 py-2 rounded-lg shadow-lg shadow-blue-900/20">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
