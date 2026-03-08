import { Link, useNavigate } from "react-router-dom";
import { getUser, logout as doLogout, isLoggedIn } from "../../lib/auth";
import Button from "../ui/Button";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    doLogout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center bg-primary/20 rounded-full">
            <span className="material-symbols-outlined text-primary font-bold text-lg">pulse_alert</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Civic Pulse</span>
        </Link>

        <div className="flex items-center gap-6">
          {loggedIn && (
            <>
              <Link to="/challenges" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                Challenges
              </Link>
              <Link to="/events" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                Events
              </Link>
            </>
          )}
          <Link to="/leaderboard" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            Leaderboard
          </Link>
          {loggedIn && (
            <Link to="/report" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-base">report</span>
              Report
            </Link>
          )}

          {loggedIn && user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-base">account_circle</span>
                Account
              </Link>
              <Link to="/store" className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer">
                <span className="material-symbols-outlined fill text-primary text-base">star</span>
                <span className="text-sm font-bold text-slate-700">{user.xp || 0} pts</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
