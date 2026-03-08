import { useState } from "react";
import { Link } from "react-router-dom";
import { listEvents } from "../api/events";
import useFetch from "../hooks/useFetch";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import { formatDate } from "../lib/utils";

export default function Events() {
  const [neighborhood, setNeighborhood] = useState("");
  const {
    data: events,
    loading,
    error,
    execute: refetch,
  } = useFetch(() => listEvents(neighborhood ? { neighborhood } : {}), [neighborhood]);

  const handleFilter = (e) => {
    e.preventDefault();
    refetch();
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Events</h1>

      <form onSubmit={handleFilter} className="mb-6 flex max-w-sm gap-2">
        <Input
          id="neighborhood"
          placeholder="Filter by neighborhood…"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        />
      </form>

      {events?.length === 0 && (
        <p className="text-gray-500">No events found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((ev) => (
          <Link key={ev.id} to={`/events/${ev.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{ev.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 line-clamp-2">{ev.description}</p>
                <p className="mb-3 text-sm text-gray-500">
                  {formatDate(ev.starts_at)}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge color="green">{ev.xp_reward} XP</Badge>
                  {ev.tags?.map((t) => (
                    <Badge key={t} color="blue">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
