import { useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../services/supabase";

import { Button } from "@/components/ui/button";
import Input from "../ui/input";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <form
      onSubmit={login}
      className="space-y-6"
    >
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <div className="flex justify-end">

        <Link
          to="/forgot-password"
          className="text-sm text-cyan-400"
        >
          Forgot Password?
        </Link>

      </div>

      <Button loading={loading}>

        Login

      </Button>
    </form>
  );
}