import { useState } from "react";
import { useParams } from "react-router-dom";
import { getChallenge, submitChallenge } from "../api/challenges";
import useFetch from "../hooks/useFetch";
import { isLoggedIn } from "../lib/auth";
import Card, { CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import { formatDate } from "../lib/utils";

export default function ChallengeDetail() {
  const { id } = useParams();
  const loggedIn = isLoggedIn();
  const { data: challenge, loading, error } = useFetch(() => getChallenge(id), [id]);

  const [proofUrl, setProofUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg("");
    try {
      await submitChallenge(id, { proof_url: proofUrl });
      setSubmitMsg("Submission recorded!");
      setProofUrl("");
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;
  if (!challenge) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{challenge.title}</h1>

      <div className="mb-6 flex items-center gap-2">
        {challenge.category && <Badge color="purple">{challenge.category}</Badge>}
        <Badge color="green">{challenge.xp_reward} XP</Badge>
        {challenge.badge_reward && <Badge color="yellow">{challenge.badge_reward}</Badge>}
      </div>

      <Card className="mb-8">
        <CardContent>
          <p className="mb-4 text-gray-700">{challenge.description}</p>
          {challenge.deadline && (
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(challenge.deadline)}
            </p>
          )}
        </CardContent>
      </Card>

      {loggedIn && (
        <Card>
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold">Submit Proof</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="proof_url"
                label="Proof URL"
                placeholder="https://..."
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit"}
              </Button>
              {submitMsg && (
                <p className="text-sm text-gray-600">{submitMsg}</p>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
