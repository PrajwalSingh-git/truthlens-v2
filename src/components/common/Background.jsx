export default function Background() {
  return (
    <>

      <div className="fixed inset-0 -z-50 bg-[#06121B]" />

      <div className="fixed left-[-250px] top-[-150px] -z-40 h-[650px] w-[650px] rounded-full bg-cyan-500/10 blur-[220px]" />

      <div className="fixed right-[-250px] bottom-[-150px] -z-40 h-[650px] w-[650px] rounded-full bg-blue-500/10 blur-[220px]" />

      <div className="fixed inset-0 -z-30 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.08),transparent_70%)]" />

    </>
  );
}