import { Link } from "react-router-dom";
import { listChallenges } from "../api/challenges";
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

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;

  const totalXp = challenges?.reduce((sum, c) => sum + (c.xp_reward || 0), 0) || 0;

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
          <p className="text-2xl font-extrabold text-primary">{challenges?.length || 0}</p>
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

      {/* Challenge Grid */}
      {challenges?.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-slate-200 text-5xl mb-3 block">emoji_events</span>
          <p className="text-slate-500 font-medium">No active challenges right now</p>
          <p className="text-slate-400 text-sm mt-1">Check back soon for new quests!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className={`px-6 pt-6 pb-4`}>
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
