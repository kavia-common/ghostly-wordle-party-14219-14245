//
// Ocean Professional theme constants and helpers
//

export const theme = {
  name: "Ocean Professional",
  colors: {
    primary: "#2563EB",     // blue
    secondary: "#F59E0B",   // amber
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    gridNeutral: "#D1D5DB",
    letterCorrect: "#16A34A", // green
    letterPresent: "#F59E0B", // amber
    letterAbsent: "#9CA3AF",  // gray
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 10px rgba(0,0,0,0.08)",
    lg: "0 10px 25px rgba(0,0,0,0.10)",
  },
  transition: "all 220ms ease",
};

export const applyCssVars = () => {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-secondary", c.secondary);
  root.style.setProperty("--color-success", c.success);
  root.style.setProperty("--color-error", c.error);
  root.style.setProperty("--color-bg", c.background);
  root.style.setProperty("--color-surface", c.surface);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-text-muted", c.textMuted);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--color-grid-neutral", c.gridNeutral);
  root.style.setProperty("--color-letter-correct", c.letterCorrect);
  root.style.setProperty("--color-letter-present", c.letterPresent);
  root.style.setProperty("--color-letter-absent", c.letterAbsent);
  root.style.setProperty("--radius-md", theme.radius.md);
  root.style.setProperty("--shadow-md", theme.shadow.md);
  root.style.setProperty("--transition", theme.transition);
};
