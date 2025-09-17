import React, { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./AppRouter";
import { applyCssVars } from "./theme";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  useEffect(() => {
    applyCssVars();
  }, []);

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
