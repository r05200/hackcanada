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
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-primary-600">
          CivicXP
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/challenges" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Challenges
          </Link>
          <Link to="/events" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Events
          </Link>
          <Link to="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Leaderboard
          </Link>

          {loggedIn && user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                {user.username}
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
