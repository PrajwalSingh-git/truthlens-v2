import Background from "../common/Background";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06121B]">

      <Background />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* Left */}

        <div className="hidden items-center justify-center p-16 lg:flex">

          <div className="max-w-xl">

            <div className="mb-8 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2">

              TruthLens AI

            </div>

            <h1 className="text-6xl font-black leading-tight">

              AI Powered

              <br />

              Misinformation

              <span className="text-cyan-400">

                {" "}Detection

              </span>

            </h1>

            <p className="mt-8 text-lg leading-9 text-slate-400">

              Analyze articles, headlines and URLs using explainable AI.

            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center justify-center p-6">

          {children}

        </div>

      </div>

    </div>
  );
}