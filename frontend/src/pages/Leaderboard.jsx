import { useState } from "react";
import { globalLeaderboard, neighborhoodLeaderboard } from "../api/leaderboard";
import useFetch from "../hooks/useFetch";
import { getUser, isLoggedIn } from "../lib/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

const MEDAL_COLORS = ["text-amber-400", "text-slate-400", "text-amber-700"];
const MEDAL_BG = ["bg-amber-50", "bg-slate-50", "bg-amber-50/50"];
const MEDAL_BORDER = ["border-amber-200", "border-slate-200", "border-amber-200/50"];

export default function Leaderboard() {
  const [neighborhood, setNeighborhood] = useState("");
  const [mode, setMode] = useState("global");
  const currentUser = isLoggedIn() ? getUser() : null;

  const apiFn = () =>
    mode === "global"
      ? globalLeaderboard()
      : neighborhoodLeaderboard(neighborhood);

  const { data: users, loading, error } = useFetch(apiFn, [mode, neighborhood]);

  const handleNeighborhoodSearch = (e) => {
    e.preventDefault();
    if (neighborhood.trim()) {
      setMode("neighborhood");
    }
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-500">{error}</p>;

  const totalPoints = users?.reduce((sum, u) => sum + (u.xp || 0), 0) || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Leaderboard</h1>
        <p className="text-sm text-slate-500 mt-1">See who's making the biggest impact</p>
      </div>

      {/* Community Points Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-white border border-primary/20 p-6 text-center">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Community Total</p>
        <p className="text-4xl font-extrabold text-primary mt-1">{totalPoints.toLocaleString()}</p>
        <p className="text-xs text-slate-400 mt-1 font-medium">{mode === "global" ? "Global" : "Neighborhood"} Points</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Button
          variant={mode === "global" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setMode("global")}
        >
          <span className="material-symbols-outlined text-base">public</span> Global
        </Button>
        <form onSubmit={handleNeighborhoodSearch} className="flex gap-2">
          <Input
            id="neighborhood"
            placeholder="Neighborhood…"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">
            <span className="material-symbols-outlined text-base">filter_list</span> Filter
          </Button>
        </form>
      </div>

      {/* Top 3 Podium */}
      {users?.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((idx) => {
            const u = users[idx];
            const isFirst = idx === 0;
            return (
              <div
                key={u.id}
                className={`rounded-xl border p-5 text-center transition-all hover:scale-[1.02] ${
                  isFirst
                    ? "bg-amber-50 border-amber-200 shadow-md -mt-2 pb-7"
                    : `${MEDAL_BG[idx]} ${MEDAL_BORDER[idx]} shadow-sm`
                }`}
              >
                <span className={`material-symbols-outlined fill text-3xl ${MEDAL_COLORS[idx]}`}>emoji_events</span>
                <div className="size-14 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center mx-auto mt-2 shadow-sm">
                  <span className="text-xl font-extrabold text-white">{u.username?.[0]?.toUpperCase()}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-2 truncate">{u.username}</p>
                <p className="text-lg font-extrabold text-primary mt-0.5">{(u.xp || 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">XP</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {users?.map((u, i) => {
            const isMe = currentUser && u.id === currentUser.id;
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/50 ${
                  isMe ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {i < 3 ? (
                    <span className={`material-symbols-outlined fill ${MEDAL_COLORS[i]}`}>emoji_events</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-400">{i + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-slate-500">{u.username?.[0]?.toUpperCase()}</span>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 truncate">{u.username}</p>
                    {isMe && (
                      <span className="px-1.5 py-0.5 bg-primary text-[10px] font-bold text-slate-900 rounded uppercase tracking-wider">You</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Level {u.level}</p>
                </div>

                {/* Badges */}
                <div className="hidden sm:flex flex-wrap gap-1">
                  {u.badges?.map((b) => (
                    <Badge key={b} color="yellow">{b}</Badge>
                  ))}
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-primary text-lg leading-none">{(u.xp || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">XP</p>
                </div>
              </div>
            );
          })}
        </div>
        {users?.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-slate-200 text-5xl mb-3 block">leaderboard</span>
            <p className="text-slate-500 font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
