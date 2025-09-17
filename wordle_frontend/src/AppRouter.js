import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar, Layout } from "./components/common/UI";
import GamePage from "./pages/GamePage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

// PUBLIC_INTERFACE
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout
        left={
          <div className="card">
            <h3>Tips</h3>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>Use vowels early</li>
              <li>Watch color hints</li>
              <li>Stay on streak!</li>
            </ul>
          </div>
        }
        center={
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        }
        right={
          <div className="card">
            <h3>About</h3>
            <p style={{ color: "var(--color-text-muted)" }}>
              A modern Wordle experience with celebratory lights and a friendly ghost.
            </p>
          </div>
        }
      />
    </BrowserRouter>
  );
}
