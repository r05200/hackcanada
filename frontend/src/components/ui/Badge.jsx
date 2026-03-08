import { cn } from "../../lib/utils";

const colors = {
  blue: "bg-blue-50 text-blue-700 border border-blue-100",
  green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  yellow: "bg-amber-50 text-amber-700 border border-amber-100",
  red: "bg-red-50 text-red-700 border border-red-100",
  gray: "bg-slate-50 text-slate-700 border border-slate-100",
  purple: "bg-purple-50 text-purple-700 border border-purple-100",
  primary: "bg-primary/10 text-primary-800 border border-primary/20",
};

export default function Badge({ children, color = "blue", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-tight",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
