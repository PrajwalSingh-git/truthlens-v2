export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06121B]">

      <div className="flex flex-col items-center">

        <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

        <p className="mt-8 text-slate-400">

          Loading...

        </p>

      </div>

    </div>
  );
}