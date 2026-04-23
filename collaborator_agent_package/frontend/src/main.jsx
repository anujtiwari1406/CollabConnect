import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CurrencyProvider } from "./context/CurrencyContext.jsx";
import { CollabCoreProvider } from "./context/CollabCoreContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/base.css";
import "./styles/collabLanding.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CollabCoreProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </CollabCoreProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
