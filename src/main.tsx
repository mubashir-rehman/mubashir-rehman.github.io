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
  // Guard against stale bundle/manifest mismatch after a new deploy.
  // vite-react-ssg fetches `static-loader-data-manifest-<hash>.json` on boot.
  // If the user has a cached JS bundle from a previous deploy, that hash no
  // longer exists on the server, GitHub Pages returns an HTML 404, and
  // JSON.parse throws. We catch here and do a one-time hard reload to
  // force fresh assets. The `ssg-reloaded` flag prevents an infinite loop.
  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    const msg: string = (e.reason as Error)?.message ?? "";
    if (msg.includes("JSON") && !sessionStorage.getItem("ssg-reloaded")) {
      sessionStorage.setItem("ssg-reloaded", "1");
      window.location.reload();
    }
  });
}

export const createRoot = ViteReactSSG({
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
