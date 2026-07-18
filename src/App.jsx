import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import About from "./pages/About";
import Extension from "./pages/Extension";
import Creator from "./pages/Creator";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/about" element={<About />} />
      <Route path="/extension" element={<Extension />} />
      <Route path="/creator" element={<Creator />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}