import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const frontendApi = import.meta.env.VITE_CLERK_FRONTEND_API;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider frontendApi={frontendApi}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
