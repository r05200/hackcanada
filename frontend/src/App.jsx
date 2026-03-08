import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { isLoggedIn } from "./lib/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/profile"
          element={isLoggedIn() ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Route>
    </Routes>
  );
}
