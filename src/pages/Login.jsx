import { Link, Navigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import GoogleButton from "../components/auth/GoogleButton";
import AuthDivider from "../components/auth/AuthDivider";
import LoginForm from "../components/auth/LoginForm";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>

      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue using TruthLens AI."
      >

        <GoogleButton />

        <AuthDivider />

        <LoginForm />

        <p className="mt-8 text-center text-slate-400">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-cyan-400"
          >
            Create one
          </Link>

        </p>

      </AuthCard>

    </AuthLayout>
  );
}