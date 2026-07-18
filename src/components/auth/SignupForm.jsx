import { useState } from "react";

import { supabase } from "../../services/supabase";

import Input from "../ui/input";
import { Button } from "@/components/ui/button";
export default function SignupForm() {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function signup(e) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

    setLoading(false);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <form
      onSubmit={signup}
      className="space-y-6"
    >
      <Input
        label="Full Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

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

      <Button loading={loading}>

        Create Account

      </Button>
    </form>
  );
}