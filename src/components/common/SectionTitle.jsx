export default function SectionTitle({
  badge,
  title,
  description,
}) {
  return (
    <div className="max-w-3xl">

      {badge && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          {badge}
        </p>
      )}

      <h2 className="text-4xl font-bold leading-tight lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-lg leading-8 text-slate-400">
          {description}
        </p>
      )}

    </div>
  );
}