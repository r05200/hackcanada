import { useState } from "react";
import { globalLeaderboard, neighborhoodLeaderboard } from "../api/leaderboard";
import useFetch from "../hooks/useFetch";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function Leaderboard() {
  const [neighborhood, setNeighborhood] = useState("");
  const [mode, setMode] = useState("global");

  const apiFn = () =>
    mode === "global"
      ? globalLeaderboard()
      : neighborhoodLeaderboard(neighborhood);

  const { data: users, loading, error, execute } = useFetch(apiFn, [mode, neighborhood]);

  const switchMode = (m) => {
    setMode(m);
  };

  const handleNeighborhoodSearch = (e) => {
    e.preventDefault();
    if (neighborhood.trim()) {
      setMode("neighborhood");
    }
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Leaderboard</h1>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Button
          variant={mode === "global" ? "primary" : "secondary"}
          size="sm"
          onClick={() => switchMode("global")}
        >
          Global
        </Button>

        <form onSubmit={handleNeighborhoodSearch} className="flex gap-2">
          <Input
            id="neighborhood"
            placeholder="Neighborhood…"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">
            Filter
          </Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">#</th>
              <th className="px-4 py-3 font-medium text-gray-600">User</th>
              <th className="px-4 py-3 font-medium text-gray-600">XP</th>
              <th className="px-4 py-3 font-medium text-gray-600">Level</th>
              <th className="px-4 py-3 font-medium text-gray-600">Badges</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u, i) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-medium">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {u.username}
                </td>
                <td className="px-4 py-3">{u.xp}</td>
                <td className="px-4 py-3">{u.level}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.badges?.map((b) => (
                      <Badge key={b} color="yellow">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && (
          <p className="p-6 text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}
