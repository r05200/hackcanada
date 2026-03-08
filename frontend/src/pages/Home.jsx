import { Link } from "react-router-dom";
import { isLoggedIn, getUser } from "../lib/auth";
import Button from "../components/ui/Button";

export default function Home() {
  const loggedIn = isLoggedIn();
  const user = getUser();
  const name = loggedIn && user ? user.username : "Citizen";
  const level = loggedIn && user ? user.level : 1;
  const xp = loggedIn && user ? user.xp || 0 : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-white border border-primary/20 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded-full tracking-widest">
              Level {level}
            </span>
            <span className="px-2.5 py-1 bg-white/80 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-widest">
              {xp.toLocaleString()} XP
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Welcome back,<br />
            <span className="bg-gradient-to-r from-primary-600 to-primary bg-clip-text text-transparent">{name}!</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-md">Ready to make a difference today? Complete quests, earn XP, and climb the leaderboard.</p>
          {!loggedIn && (
            <div className="flex gap-3 mt-6">
              <Link to="/register"><Button size="lg">Get Started</Button></Link>
              <Link to="/login"><Button variant="secondary" size="lg">Sign In</Button></Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="trending_up" label="Community Impact" value="Top 5%" accent="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
        <StatCard icon="star" label="Total XP" value={xp.toLocaleString()} accent="text-primary-600" bg="bg-primary-50" border="border-primary-100" />
        <StatCard icon="military_tech" label="Level" value={level} accent="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
        <StatCard icon="local_fire_department" label="Streak" value="3 days" accent="text-orange-500" bg="bg-orange-50" border="border-orange-100" />
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Quests */}
        <div className="md:col-span-2 space-y-6">
          {/* Daily Quest */}
          <div>
            <h3 className="text-slate-900 text-lg font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary fill">task_alt</span> Daily Quests
            </h3>
            <div className="space-y-3">
              <QuestCard
                icon="report_problem"
                iconBg="bg-red-50"
                iconColor="text-red-500"
                title="Report 1 local issue"
                subtitle="Potholes, streetlights, or graffiti"
                points={50}
                progress={0}
              />
              <QuestCard
                icon="how_to_vote"
                iconBg="bg-blue-50"
                iconColor="text-blue-500"
                title="Vote in a community poll"
                subtitle="Share your voice on local issues"
                points={25}
                progress={100}
                completed
              />
              <QuestCard
                icon="volunteer_activism"
                iconBg="bg-purple-50"
                iconColor="text-purple-500"
                title="Attend a community event"
                subtitle="Check in at a local gathering"
                points={75}
                progress={0}
              />
            </div>
          </div>

          {/* Quick Poll */}
          <div className="rounded-xl border-2 border-primary/30 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded tracking-widest">Quick Poll</span>
              <span className="text-slate-400 text-xs font-medium">Ends in 4h</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">New Bike Lanes on 5th Ave?</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-primary text-slate-900 font-bold rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="material-symbols-outlined">thumb_up</span> Support
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="material-symbols-outlined">thumb_down</span> Oppose
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Trending Action */}
          <div>
            <h3 className="text-slate-900 text-lg font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-400 fill">local_fire_department</span> Trending
            </h3>
            <div className="relative overflow-hidden rounded-xl bg-slate-900 text-white min-h-[200px] flex flex-col justify-end p-5 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/80 to-slate-900/90 group-hover:from-emerald-700/80 transition-colors" />
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded tracking-widest">+100 XP</span>
              </div>
              <div className="relative z-10">
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Volunteering</p>
                <h4 className="text-xl font-bold mb-2">Park Clean-up</h4>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span> Tomorrow, 9 AM
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Central Park
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link to="/challenges" className="block">
              <QuickActionCard icon="emoji_events" color="text-amber-500" bg="bg-amber-50" title="Challenges" count="5 active" />
            </Link>
            <Link to="/events" className="block">
              <QuickActionCard icon="calendar_today" color="text-blue-500" bg="bg-blue-50" title="Events" count="3 upcoming" />
            </Link>
            <Link to="/leaderboard" className="block">
              <QuickActionCard icon="leaderboard" color="text-purple-500" bg="bg-purple-50" title="Leaderboard" count="View rankings" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, bg, border }) {
  return (
    <div className={`rounded-xl p-4 ${bg} border ${border} transition-transform hover:scale-[1.02]`}>
      <span className={`material-symbols-outlined ${accent} text-xl mb-1`}>{icon}</span>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function QuestCard({ icon, iconBg, iconColor, title, subtitle, points, completed }) {
  return (
    <div className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01] ${completed ? "border-primary/30 bg-primary/5" : "border-slate-100"}`}>
      <div className={`size-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <span className={`material-symbols-outlined ${iconColor} text-2xl`}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold ${completed ? "text-slate-400 line-through" : "text-slate-900"}`}>{title}</p>
        <p className="text-slate-500 text-sm truncate">{subtitle}</p>
      </div>
      <div className="text-right shrink-0">
        {completed ? (
          <span className="material-symbols-outlined text-primary fill text-2xl">check_circle</span>
        ) : (
          <>
            <p className="text-primary font-extrabold text-lg leading-none">+{points}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Points</p>
          </>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({ icon, color, bg, title, count }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer">
      <div className={`size-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-900 text-sm">{title}</p>
        <p className="text-slate-400 text-xs">{count}</p>
      </div>
      <span className="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
    </div>
  );
}
