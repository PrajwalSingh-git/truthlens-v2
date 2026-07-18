export default function SecondaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:border-cyan-400 hover:bg-cyan-500/10 ${className}`}
    >
      {children}
    </button>
  );
}