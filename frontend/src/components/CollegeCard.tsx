// CollegeCard.tsx - Safe version
import { MapPin, BookOpen, Check, Bookmark, Star, IndianRupee } from "lucide-react";
import Link from "next/link";

type College = {
  id: number;
  name: string;
  location: string;
  description?: string;
  established?: number | null;
  fees?: number | null;
  rating?: number | null;
  placementPct?: number | null;
};

export default function CollegeCard({
  college,
  isSelected,
  onToggleCompare,
  isSaved,
  onSaveToggle
}: {
  college: College;
  isSelected?: boolean;
  onToggleCompare?: (id: number) => void;
  isSaved?: boolean;
  onSaveToggle?: (id: number) => void;
}) {
  return (
    <div className="relative group block h-full">
      <Link
        href={`/colleges/${college.id}`}
        className={`relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border ${isSelected
          ? "border-blue-500 shadow-[0_0_20px_rgb(59,130,246,0.2)]"
          : "border-white/10 hover:border-blue-500/40"
          } p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] flex flex-col h-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon + Rating */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center shadow-md">
              <BookOpen className="text-white w-5 h-5" />
            </div>

            {college.rating != null && (
              <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 py-1 text-yellow-300 text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" />
                {Number(college.rating).toFixed(1)}
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-slate-100 mb-2 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
            {college.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 flex-grow mb-5 line-clamp-2 leading-relaxed">
            {college.description ?? ""}
          </p>

          {/* Bottom stats */}
          <div className="mt-auto flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-full px-3 py-1.5 border border-slate-700/50">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate max-w-[110px]">{college.location}</span>
            </div>

            {college.fees != null && (
              <div className="flex items-center gap-1 bg-slate-800/60 rounded-full px-3 py-1.5 border border-slate-700/50">
                <IndianRupee className="w-3 h-3 text-emerald-400" />
                <span>{(Number(college.fees) / 100000).toFixed(1)}L/yr</span>
              </div>
            )}

            {college.placementPct != null && (
              <div className="flex items-center gap-1 bg-slate-800/60 rounded-full px-3 py-1.5 border border-slate-700/50">
                <span className="text-blue-300">↑</span>
                <span>{Number(college.placementPct)}% placed</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Compare button */}
      {onToggleCompare && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(college.id);
          }}
          className={`absolute top-5 right-5 z-20 w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${isSelected
            ? "bg-blue-500 border-blue-500 text-white"
            : "bg-slate-900/80 border-slate-600 text-white opacity-0 group-hover:opacity-100"
            }`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Save button */}
      {onSaveToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSaveToggle(college.id);
          }}
          className={`absolute ${onToggleCompare ? "top-14" : "top-5"
            } right-5 z-20 w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${isSaved
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "bg-slate-900/80 border-slate-600 text-slate-400 opacity-0 group-hover:opacity-100"
            }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}