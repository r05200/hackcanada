import { getProfile, getBadges } from "../api/users";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/ui/Spinner";

export default function Profile() {
  const { data: user, loading: profileLoading } = useFetch(getProfile);
  const { data: badgeData, loading: badgesLoading } = useFetch(getBadges);

  if (profileLoading) return <Spinner className="mt-16" />;
  if (!user) return null;

  const xp = user.xp || 0;
  const level = user.level || 1;
  const nextLevelXp = level * 500;
  const progress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-white border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="size-24 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-4xl font-extrabold text-white">
                {user.username?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-400 rounded-full text-[10px] font-bold text-slate-900 shadow-sm border-2 border-white">
              LVL {level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900">{user.username}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-slate-400 text-base">location_on</span>
              <span className="text-sm text-slate-500">{user.neighborhood || "No riding set"}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>

            {/* XP Progress */}
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress to Level {level + 1}</span>
                <span className="text-xs font-bold text-primary">{xp} / {nextLevelXp} XP</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedStatCard icon="star" label="Total XP" value={xp.toLocaleString()} color="text-primary" bg="bg-primary-50" border="border-primary-100" />
        <AnimatedStatCard icon="military_tech" label="Level" value={level} color="text-amber-500" bg="bg-amber-50" border="border-amber-100" />
        <AnimatedStatCard icon="description" label="Reports" value={user.reports_count ?? "—"} color="text-blue-500" bg="bg-blue-50" border="border-blue-100" />
        <AnimatedStatCard icon="local_fire_department" label="Streak" value="3 days" color="text-orange-500" bg="bg-orange-50" border="border-orange-100" />
      </div>

      {/* Badges Section */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-amber-500 fill">workspace_premium</span>
          Earned Badges
        </h2>
        {badgesLoading ? (
          <Spinner />
        ) : badgeData?.badges?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badgeData.badges.map((b) => (
              <BadgeCard key={b} name={b} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-slate-200 text-5xl mb-3 block">workspace_premium</span>
            <p className="text-slate-500 text-sm font-medium">No badges earned yet</p>
            <p className="text-slate-400 text-xs mt-1">Complete challenges to earn your first badge!</p>
          </div>
        )}
      </div>

      {/* Activity Preview */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-blue-500">history</span>
          Recent Activity
        </h2>
        <div className="space-y-3">
          <ActivityRow icon="check_circle" color="text-primary" text="Joined Civic Pulse" time="Just now" xp="+0" />
        </div>
      </div>
    </div>
  );
}

function AnimatedStatCard({ icon, label, value, color, bg, border }) {
  return (
    <div className={`rounded-xl p-5 ${bg} border ${border} transition-all hover:scale-[1.03] hover:shadow-sm cursor-default`}>
      <span className={`material-symbols-outlined ${color} text-2xl fill`}>{icon}</span>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function BadgeCard({ name }) {
  const icons = {
    "Early Bird": "wb_twilight",
    "Poll Master": "query_stats",
    "First Report": "flag",
    "Community Hero": "military_tech",
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-100 hover:scale-[1.05] transition-transform cursor-default">
      <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-amber-600 fill">{icons[name] || "stars"}</span>
      </div>
      <span className="text-xs font-bold text-slate-700 text-center">{name}</span>
    </div>
  );
}

function ActivityRow({ icon, color, text, time, xp }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className={`material-symbols-outlined ${color} fill`}>{icon}</span>
      <span className="flex-1 text-sm text-slate-700 font-medium">{text}</span>
      <span className="text-xs text-slate-400">{time}</span>
      <span className="text-xs font-bold text-primary">{xp} XP</span>
    </div>
  );
}
