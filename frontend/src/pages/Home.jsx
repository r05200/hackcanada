import { Link } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";
import { getProfile } from "../api/users";
import useFetch from "../hooks/useFetch";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

export default function Home() {
  return isLoggedIn() ? <Dashboard /> : <LandingPage />;
}

/* ─── Logged-in Dashboard (fetches live data from DB) ──── */
function Dashboard() {
  const { data: user, loading } = useFetch(getProfile);

  if (loading) return <Spinner className="mt-16" />;
  if (!user) return null;

  const xp = user.xp || 0;
  const level = user.level || 1;
  const streak = user.streak || 0;
  const eventsAttended = user.events_attended || 0;
  const reportsCount = user.reports_count ?? 0;
  const badges = user.badges || [];
  const nextLevelXp = level * 500;
  const progress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-white border border-primary/20 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded-full tracking-widest">
              Level {level}
            </span>
            <span className="px-2.5 py-1 bg-white/80 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-widest">
              {xp.toLocaleString()} XP
            </span>
            {user.neighborhood && (
              <span className="px-2.5 py-1 bg-white/80 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">location_on</span>
                {user.neighborhood}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Welcome back,<br />
            <span className="bg-gradient-to-r from-primary-600 to-primary bg-clip-text text-transparent">{user.username}!</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-md">Ready to make a difference today? Complete quests, earn XP, and climb the leaderboard.</p>

          {/* XP Progress Bar */}
          <div className="mt-5 max-w-sm">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress to Level {level + 1}</span>
              <span className="text-xs font-bold text-primary">{xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row — all live from DB */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon="star" label="Total XP" value={xp.toLocaleString()} accent="text-primary-600" bg="bg-primary-50" border="border-primary-100" />
        <StatCard icon="military_tech" label="Level" value={level} accent="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
        <StatCard icon="local_fire_department" label="Streak" value={`${streak} day${streak !== 1 ? "s" : ""}`} accent="text-orange-500" bg="bg-orange-50" border="border-orange-100" />
        <StatCard icon="calendar_today" label="Events" value={eventsAttended} accent="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
        <StatCard icon="description" label="Reports" value={reportsCount} accent="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left — Quests */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-slate-900 text-lg font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary fill">task_alt</span> Daily Quests
            </h3>
            <div className="space-y-3">
              <QuestCard icon="report_problem" iconBg="bg-red-50" iconColor="text-red-500" title="Report 1 local issue" subtitle="Potholes, streetlights, or graffiti" points={50} />
              <QuestCard icon="how_to_vote" iconBg="bg-blue-50" iconColor="text-blue-500" title="Vote in a community poll" subtitle="Share your voice on local issues" points={25} completed />
              <QuestCard icon="volunteer_activism" iconBg="bg-purple-50" iconColor="text-purple-500" title="Attend a community event" subtitle="Check in at a local gathering" points={75} />
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

        {/* Right — Sidebar */}
        <div className="space-y-6">
          {/* Your Badges */}
          {badges.length > 0 && (
            <div>
              <h3 className="text-slate-900 text-lg font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 fill">workspace_premium</span> Your Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span key={b} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
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
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Tomorrow, 9 AM</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> Central Park</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link to="/challenges" className="block"><QuickActionCard icon="emoji_events" color="text-amber-500" bg="bg-amber-50" title="Challenges" count="5 active" /></Link>
            <Link to="/events" className="block"><QuickActionCard icon="calendar_today" color="text-blue-500" bg="bg-blue-50" title="Events" count="3 upcoming" /></Link>
            <Link to="/leaderboard" className="block"><QuickActionCard icon="leaderboard" color="text-purple-500" bg="bg-purple-50" title="Leaderboard" count="View rankings" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Landing Page (not logged in) ──────────────────────── */
function LandingPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 via-primary/10 to-white border border-primary/20 px-8 py-16 md:py-20 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/15 rounded-full blur-3xl -translate-y-1/2" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-sm font-bold text-slate-700 mb-6">
            <span className="material-symbols-outlined text-primary text-base fill">pulse_alert</span>
            Civic engagement, gamified
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-5">
            Make your city<br />
            <span className="bg-gradient-to-r from-primary-600 to-primary bg-clip-text text-transparent">better, together.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto mb-8">
            Report issues, attend events, complete challenges, and earn XP as you improve your neighborhood.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register"><Button size="lg"><span className="material-symbols-outlined text-base">rocket_launch</span> Get Started — It's Free</Button></Link>
            <Link to="/login"><Button variant="secondary" size="lg">Sign In</Button></Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard icon="emoji_events" iconColor="text-amber-500" iconBg="bg-amber-50" title="Earn XP & Level Up" desc="Complete civic challenges, attend events, and report issues to earn experience points and climb the leaderboard." />
        <FeatureCard icon="groups" iconColor="text-primary" iconBg="bg-primary/10" title="Build Community" desc="Connect with neighbors, vote on local issues, and work together to shape the future of your neighborhood." />
        <FeatureCard icon="workspace_premium" iconColor="text-purple-500" iconBg="bg-purple-50" title="Unlock Badges" desc="Get recognized for your contributions with unique badges that showcase your impact and dedication." />
      </div>

      {/* Stats */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Trusted by your community</p>
        <div className="grid grid-cols-3 gap-8">
          <div><p className="text-4xl font-extrabold text-primary">500+</p><p className="text-slate-400 text-sm font-medium mt-1">Active Citizens</p></div>
          <div><p className="text-4xl font-extrabold text-primary">1,200+</p><p className="text-slate-400 text-sm font-medium mt-1">Issues Reported</p></div>
          <div><p className="text-4xl font-extrabold text-primary">80+</p><p className="text-slate-400 text-sm font-medium mt-1">Events Held</p></div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Ready to make an impact?</h2>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Join thousands of citizens already improving their neighborhoods.</p>
        <Link to="/register"><Button size="lg"><span className="material-symbols-outlined text-base">person_add</span> Create Free Account</Button></Link>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */
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

function FeatureCard({ icon, iconColor, iconBg, title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
      <div className={`size-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        <span className={`material-symbols-outlined ${iconColor} text-2xl fill`}>{icon}</span>
      </div>
      <h3 className="font-extrabold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
