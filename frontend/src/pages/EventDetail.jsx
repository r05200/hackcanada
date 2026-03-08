import { useParams } from "react-router-dom";
import { getEvent, checkinEvent } from "../api/events";
import useFetch from "../hooks/useFetch";
import { isLoggedIn } from "../lib/auth";
import Card, { CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { formatDate } from "../lib/utils";
import { useState } from "react";

export default function EventDetail() {
  const { id } = useParams();
  const loggedIn = isLoggedIn();
  const { data: event, loading, error } = useFetch(() => getEvent(id), [id]);

  const [checkinMsg, setCheckinMsg] = useState("");
  const [checking, setChecking] = useState(false);

  const handleCheckin = async () => {
    setChecking(true);
    try {
      await checkinEvent(id);
      setCheckinMsg("Checked in successfully!");
    } catch (err) {
      setCheckinMsg(err.response?.data?.message || "Check-in failed");
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;
  if (!event) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{event.title}</h1>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge color="green">{event.xp_reward} XP</Badge>
        {event.tags?.map((t) => (
          <Badge key={t} color="blue">
            {t}
          </Badge>
        ))}
      </div>

      <Card className="mb-8">
        <CardContent>
          <p className="mb-4 text-gray-700">{event.description}</p>
          {event.location && (
            <p className="text-sm text-gray-500">Location: {event.location}</p>
          )}
          <p className="text-sm text-gray-500">
            Starts: {formatDate(event.starts_at)}
          </p>
        </CardContent>
      </Card>

      {loggedIn && (
        <div className="flex items-center gap-4">
          <Button onClick={handleCheckin} disabled={checking}>
            {checking ? "Checking in…" : "Check In"}
          </Button>
          {checkinMsg && <p className="text-sm text-gray-600">{checkinMsg}</p>}
        </div>
      )}
    </div>
  );
}
