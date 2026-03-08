import { getUser } from "../lib/auth";
import { getProfile, getBadges } from "../api/users";
import useFetch from "../hooks/useFetch";
import Card, { CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function Profile() {
  const { data: user, loading: profileLoading } = useFetch(getProfile);
  const { data: badgeData, loading } = useFetch(getBadges);

  if (profileLoading) return <Spinner className="mt-16" />;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h1>

      <Card className="mb-6">
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Username" value={user.username} />
            <Field label="Email" value={user.email} />
            <Field label="Neighborhood" value={user.neighborhood || "—"} />
            <Field label="Level" value={user.level} />
            <Field label="XP" value={user.xp} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Badges</h2>
          {loading ? (
            <Spinner />
          ) : badgeData?.badges?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badgeData.badges.map((b) => (
                <Badge key={b} color="yellow">
                  {b}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No badges earned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
