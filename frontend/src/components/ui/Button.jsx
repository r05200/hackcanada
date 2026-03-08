import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-primary text-slate-900 hover:bg-primary/90 font-bold",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 font-bold",
  danger: "bg-red-500 text-white hover:bg-red-600 font-bold",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 font-medium",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
