import { Link } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";
import Button from "../components/ui/Button";

export default function Home() {
  const loggedIn = isLoggedIn();

  return (
    <div className="flex flex-col items-center gap-8 pt-16 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        Make an Impact in Your <span className="text-primary-600">Community</span>
      </h1>
      <p className="max-w-xl text-lg text-gray-600">
        Complete civic challenges, attend local events, and climb the
        leaderboard — earn XP and badges for making a difference.
      </p>

      <div className="flex gap-4">
        {loggedIn ? (
          <>
            <Link to="/challenges">
              <Button size="lg">Browse Challenges</Button>
            </Link>
            <Link to="/events">
              <Button variant="secondary" size="lg">
                Find Events
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </>
        )}
      </div>

      <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          title="Challenges"
          description="Complete voting, volunteering, and reporting challenges to earn XP."
        />
        <FeatureCard
          title="Events"
          description="Discover and check into community events happening near you."
        />
        <FeatureCard
          title="Leaderboard"
          description="Compete with neighbors and climb the ranks in your community."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
