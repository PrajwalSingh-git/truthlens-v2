import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/services/supabase";

import { Button } from "@/components/ui/button";
export default function GoogleButton() {
  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  }

  return (
    <Button
      variant="outline"
      className="w-full h-11"
      onClick={signInGoogle}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}