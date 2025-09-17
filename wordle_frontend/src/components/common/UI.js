import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./ui.css";

// PUBLIC_INTERFACE
export function Button({ children, onClick, kind = "primary", type = "button", disabled = false, full = false, ariaLabel }) {
  return (
    <button
      className={`btn btn-${kind} ${full ? "btn-full" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function Input({ label, value, onChange, type = "text", placeholder, name, required, autoComplete }) {
  return (
    <label className="input-group">
      {label && <span className="input-label">{label}</span>}
      <input
        className="input"
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
      />
    </label>
  );
}

// PUBLIC_INTERFACE
export function Card({ children }) {
  return <div className="card">{children}</div>;
}

// PUBLIC_INTERFACE
export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="brand">
          <span className="brand-logo">👻</span>
          <span className="brand-name">Ghostly Wordle Party</span>
        </div>
      </div>
      <div className="nav-center">
        <a className="nav-link" href="/">Play</a>
        <a className="nav-link" href="/profile">Profile</a>
        <a className="nav-link" href="/leaderboard">Leaderboard</a>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="user-pill">Hi, {user.username}</span>
            <Button kind="outline" onClick={logout} ariaLabel="Logout">Logout</Button>
          </>
        ) : (
          <>
            <a className="nav-link" href="/login">Login</a>
            <a className="nav-link highlight" href="/register">Sign up</a>
          </>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Layout({ left, center, right }) {
  return (
    <div className="layout">
      <div className="layout-left">{left}</div>
      <div className="layout-center">{center}</div>
      <div className="layout-right">{right}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
