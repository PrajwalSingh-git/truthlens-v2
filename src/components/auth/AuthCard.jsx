export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">

      <h1 className="text-4xl font-black">

        {title}

      </h1>

      <p className="mt-4 text-slate-400">

        {subtitle}

      </p>

      <div className="mt-10">

        {children}

      </div>

    </div>
  );
}