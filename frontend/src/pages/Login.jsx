import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../lib/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
