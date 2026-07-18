import { Link, NavLink } from "react-router-dom";
import { ShieldCheck, Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const links = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Analyze",
      path: "/analyze",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Extension",
      path: "/extension",
    },
    {
      title: "Developer",
      path: "/creator",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071018]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-cyan-500/15 p-2">
            <ShieldCheck className="h-7 w-7 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide">
                <div>

                    <h1 className="text-xl font-bold tracking-wide">

                        TruthLens AI

                    </h1>

                    <p className="text-xs text-slate-500">

                        Verify Information

                    </p>

                </div>
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-xl px-5 py-2 transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 transition hover:bg-cyan-500/20"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-black transition hover:bg-cyan-400"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2"
            >
              <UserCircle />
              {user.user_metadata.full_name ||
                user.email}
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden"
        >
          {open ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>
      </div>
    </header>
  );
}