import { Link } from "react-router-dom";
import { listChallenges } from "../api/challenges";
import useFetch from "../hooks/useFetch";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function Challenges() {
  const { data: challenges, loading, error } = useFetch(listChallenges);

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Challenges</h1>

      {challenges?.length === 0 && (
        <p className="text-gray-500">No active challenges right now.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges?.map((c) => (
          <Link key={c.id} to={`/challenges/${c.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-2">
                  {c.category && <Badge color="purple">{c.category}</Badge>}
                  <Badge color="green">{c.xp_reward} XP</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
