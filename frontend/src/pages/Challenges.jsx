import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listChallenges } from "../api/challenges";
import { completeChallenge, getProfile } from "../api/users";
import useFetch from "../hooks/useFetch";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

const CATEGORY_ICONS = {
  environment: { icon: "eco", color: "text-emerald-500", bg: "bg-emerald-50" },
  civic: { icon: "account_balance", color: "text-blue-500", bg: "bg-blue-50" },
  community: { icon: "groups", color: "text-purple-500", bg: "bg-purple-50" },
  health: { icon: "favorite", color: "text-red-500", bg: "bg-red-50" },
};

function getCategoryMeta(category) {
  const key = category?.toLowerCase();
  return CATEGORY_ICONS[key] || { icon: "emoji_events", color: "text-amber-500", bg: "bg-amber-50" };
}

export default function Challenges() {
  const { data: challenges, loading, error } = useFetch(listChallenges);
  // Primary source: user's active_challenges from MongoDB
  const { data: userProfile, loading: profileLoading } = useFetch(getProfile);
  const [activeDailies, setActiveDailies] = useState(() => {
    // Seed from localStorage as fast initial value while DB request is in flight
    try { return JSON.parse(localStorage.getItem("civic_active_challenges") || "[]"); }
    catch { return []; }
  });
  const [completing, setCompleting] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);

  // When DB profile arrives, use it as the source of truth
  useEffect(() => {
    if (userProfile?.active_challenges) {
      setActiveDailies(userProfile.active_challenges);
      localStorage.setItem("civic_active_challenges", JSON.stringify(userProfile.active_challenges));
    }
  }, [userProfile]);

  const handleComplete = async (ch) => {
    setCompleting(ch._id);
    try { await completeChallenge(ch); } catch { /* still mark done locally */ }
    setCompletedIds((prev) => [...prev, ch._id]);
    const updated = activeDailies.filter((c) => c._id !== ch._id);
    setActiveDailies(updated);
    localStorage.setItem("civic_active_challenges", JSON.stringify(updated));
    setCompleting(null);
  };

  if (loading || profileLoading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;

  const totalXp = challenges?.reduce((sum, c) => sum + (c.xp_reward || 0), 0) || 0;
  const totalCards = (challenges?.length || 0) + activeDailies.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Challenges</h1>
        <p className="text-sm text-slate-500 mt-1">Complete challenges to earn XP and unlock badges</p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
          <p className="text-2xl font-extrabold text-primary">{totalCards}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{totalXp.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total XP</p>
        </div>
        <div className="rounded-xl bg-purple-50 border border-purple-100 p-4 text-center">
          <p className="text-2xl font-extrabold text-purple-600">{challenges?.filter(c => c.badge_reward).length || 0}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Badges</p>
        </div>
      </div>

      {/* Challenge Grid — DB challenges + accepted daily challenges mixed in */}
      {totalCards === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-slate-200 text-5xl mb-3 block">emoji_events</span>
          <p className="text-slate-500 font-medium">No active challenges right now</p>
          <p className="text-slate-400 text-sm mt-1">Accept daily challenges from the Home page to get started!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Accepted daily challenges — rendered as cards with Complete button */}
          {activeDailies.map((ch) => {
            const isDone = completedIds.includes(ch._id);
            return (
              <div key={ch._id} className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 h-full flex flex-col ${isDone ? "border-emerald-200 opacity-60" : "border-primary/30"}`}>
                {/* XP Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2.5 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded-full tracking-widest shadow-sm">
                    +{ch.points} XP
                  </span>
                </div>
                {/* Daily badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full tracking-wider border border-primary/20">
                    Daily
                  </span>
                </div>
                {/* Card Header */}
                <div className="px-6 pt-12 pb-4">
                  <div className={`size-12 rounded-xl ${ch.iconBg} flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined ${ch.iconColor} text-2xl`}>{ch.icon}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug pr-4">{ch.title}</h3>
                </div>
                {/* Card Body */}
                <div className="px-6 pb-4 flex-1">
                  <p className="text-sm text-slate-500 line-clamp-2">{ch.subtitle}</p>
                </div>
                {/* Footer with Complete button */}
                <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/50">
                  {isDone ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <span className="material-symbols-outlined fill text-base">check_circle</span>
                      <span className="text-sm font-bold">Completed!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleComplete(ch)}
                      disabled={completing === ch._id}
                      className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-slate-900 font-bold text-sm py-2 rounded-lg transition-all active:scale-[0.97]"
                    >
                      {completing === ch._id
                        ? <span className="size-4 border-2 border-slate-900/40 border-t-transparent rounded-full animate-spin" />
                        : <span className="material-symbols-outlined text-base">check</span>
                      }
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* DB challenges */}
          {challenges?.map((c) => {
            const meta = getCategoryMeta(c.category);
            return (
              <Link key={c.id} to={`/challenges/${c.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 h-full">
                  {/* XP Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded-full tracking-widest shadow-sm">
                      +{c.xp_reward} XP
                    </span>
                  </div>
                  {/* Card Header */}
                  <div className="px-6 pt-6 pb-4">
                    <div className={`size-12 rounded-xl ${meta.bg} flex items-center justify-center mb-4`}>
                      <span className={`material-symbols-outlined ${meta.color} text-2xl fill`}>{meta.icon}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug pr-16 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                  </div>
                  {/* Card Body */}
                  <div className="px-6 pb-5">
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{c.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {c.category && <Badge color="purple">{c.category}</Badge>}
                      {c.badge_reward && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-xs fill text-amber-500">workspace_premium</span>
                          {c.badge_reward}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="border-t border-slate-50 px-6 py-3 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-semibold text-slate-400">View challenge</span>
                    <span className="material-symbols-outlined text-slate-300 text-base group-hover:text-primary group-hover:translate-x-0.5 transition-all">arrow_forward</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
