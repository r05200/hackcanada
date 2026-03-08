import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../lib/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    neighborhood: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join Civic Pulse and start making a difference</p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600">{error}</p>
        )}

        <Input
          id="username"
          name="username"
          label="Hero Handle"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="Choose your hero name"
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Create a password"
        />
        <Input
          id="neighborhood"
          name="neighborhood"
          label="Riding / Neighborhood"
          value={form.neighborhood}
          onChange={handleChange}
          placeholder="Optional"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Assemble the Squad"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
