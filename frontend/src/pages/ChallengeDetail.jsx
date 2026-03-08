import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getChallenge, submitChallenge } from "../api/challenges";
import useFetch from "../hooks/useFetch";
import { isLoggedIn } from "../lib/auth";
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
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg("");
    try {
      await submitChallenge(id, { proof_url: proofUrl });
      setSubmitMsg("Submission recorded! XP has been awarded.");
      setSubmitSuccess(true);
      setProofUrl("");
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || "Submission failed");
      setSubmitSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner className="mt-16" />;
  if (error) return <p className="mt-16 text-center text-red-600">{error}</p>;
  if (!challenge) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12">
      {/* Back link */}
      <Link to="/challenges" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        All Challenges
      </Link>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-white border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {challenge.category && <Badge color="purple">{challenge.category}</Badge>}
            <span className="px-2.5 py-1 bg-primary text-slate-900 text-[10px] font-bold uppercase rounded-full tracking-widest">
              +{challenge.xp_reward} XP
            </span>
            {challenge.badge_reward && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs fill text-amber-500">workspace_premium</span>
                {challenge.badge_reward}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{challenge.title}</h1>
          {challenge.deadline && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <span className="material-symbols-outlined text-base text-slate-400">calendar_today</span>
              Deadline: {formatDate(challenge.deadline)}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary fill">info</span>
          About this Challenge
        </h2>
        <p className="text-slate-600 leading-relaxed">{challenge.description}</p>
      </div>

      {/* Rewards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-5 text-center">
          <span className="material-symbols-outlined text-primary fill text-3xl">star</span>
          <p className="text-2xl font-extrabold text-primary mt-1">{challenge.xp_reward}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">XP Reward</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-5 text-center">
          <span className="material-symbols-outlined text-amber-500 fill text-3xl">workspace_premium</span>
          <p className="text-lg font-extrabold text-amber-600 mt-1">{challenge.badge_reward || "—"}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Badge</p>
        </div>
      </div>

      {/* Submit Form */}
      {loggedIn ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary fill">upload</span>
            Submit Proof
          </h2>
          {submitSuccess ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="material-symbols-outlined text-primary fill text-5xl mb-3">check_circle</span>
              <p className="font-bold text-slate-900">Submission recorded!</p>
              <p className="text-sm text-slate-500 mt-1">+{challenge.xp_reward} XP has been awarded to your account.</p>
              <Button className="mt-5" variant="secondary" onClick={() => setSubmitSuccess(false)}>
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="proof_url"
                label="Proof URL"
                placeholder="https://..."
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
              />
              <Button type="submit" disabled={submitting || !proofUrl.trim()} className="w-full">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Submitting…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">send</span>
                    Submit Challenge
                  </span>
                )}
              </Button>
              {submitMsg && !submitSuccess && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">error</span>
                  {submitMsg}
                </p>
              )}
            </form>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-slate-600 font-medium mb-3">Sign in to submit this challenge and earn XP</p>
          <Link to="/login">
            <Button>Sign In to Submit</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
