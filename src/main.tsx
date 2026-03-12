import { ViteReactSSG } from "vite-react-ssg";
import React from "react";
import App from "./App.tsx";
import "./index.css";

if (typeof window !== "undefined") {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== "/") {
    window.history.replaceState(null, "", redirect);
  }
}

export const createRoot = ViteReactSSG({
  base: "/",
  routes: [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, Component: React.lazy(() => import("@/pages/Landing")) },
        { path: "about", Component: React.lazy(() => import("@/pages/About")) },
        { path: "projects", Component: React.lazy(() => import("@/pages/Projects")) },
        { path: "hobbies", Component: React.lazy(() => import("@/pages/Hobbies")) },
        { path: "habits", Component: React.lazy(() => import("@/pages/Habits")) },
        { path: "journal", Component: React.lazy(() => import("@/pages/Journal").then(m => ({ default: m.JournalList }))) },
        { path: "journal/:slug", Component: React.lazy(() => import("@/pages/Journal").then(m => ({ default: m.JournalEntry }))) },
        { path: "contact", Component: React.lazy(() => import("@/pages/Contact")) },
        { path: "*", Component: React.lazy(() => import("@/pages/NotFound")) },
      ],
    }
  ],
});
