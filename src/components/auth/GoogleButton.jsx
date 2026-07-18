import { supabase } from "../../services/supabase";

export default function GoogleButton() {
  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  }

  return (
    <button
      onClick={loginGoogle}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium transition hover:border-cyan-400 hover:bg-white/10"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="h-5 w-5"
      />

      Continue with Google
    </button>
  );
}