import { Link, Navigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import GoogleButton from "../components/auth/GoogleButton";
import AuthDivider from "../components/auth/AuthDivider";
import SignupForm from "../components/auth/SignupForm";

import { useAuth } from "../context/AuthContext";

export default function Signup() {

  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>

      <AuthCard
        title="Create Account"
        subtitle="Join TruthLens AI for free."
      >

        <GoogleButton />

        <AuthDivider />

        <SignupForm />

        <p className="mt-8 text-center text-slate-400">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-cyan-400"
          >
            Login
          </Link>

        </p>

      </AuthCard>

    </AuthLayout>
  );
}