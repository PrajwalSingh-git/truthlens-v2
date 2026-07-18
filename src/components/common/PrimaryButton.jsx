export default function PrimaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 ${className}`}
    >
      {children}
    </button>
  );
}