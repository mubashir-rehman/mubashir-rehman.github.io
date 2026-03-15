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
  //
  // vite-react-ssg attaches a React Router loader to every route that calls:
  //   window.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ =
  //     await (await fetch(`static-loader-data-manifest-<hash>.json`)).json();
  //
  // When a user has a cached JS bundle from a previous deploy, that hash is
  // gone — GitHub Pages returns an HTML 404 page, `.json()` throws
  // "Unexpected token '<'", React Router's error boundary catches it, and
  // "Unexpected Application Error!" is shown. An `unhandledrejection` listener
  // cannot help because React Router swallows the error first.
  //
  // Fix: monkey-patch window.fetch *before* ViteReactSSG initialises. When the
  // manifest URL comes back non-OK (HTML 404), return a fake `Response("{}")`
  // so `.json()` succeeds, the loader finds no data and exits cleanly with
  // `null`, and we simultaneously trigger a one-time hard navigation to pull
  // fresh assets.
  //
  // The reload key is scoped to the current bundle hash so that:
  //   - Each deploy gets exactly one clean recovery attempt.
  //   - A recovered bundle (new hash) has a fresh flag → no loop risk.
  //   - `location.replace()` is a full navigation (not reload()) so the
  //     browser fetches fresh HTML rather than replaying from cache.
  const _fetch = window.fetch.bind(window);
  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url;

    const response = await _fetch(input, init);

    if (url.includes("static-loader-data-manifest") && !response.ok) {
      // Key the flag to the current bundle hash so each deploy version gets
      // exactly one recovery attempt — prevents cross-deploy flag collisions.
      const hash = (window as Window & { __VITE_REACT_SSG_HASH__?: string }).__VITE_REACT_SSG_HASH__ ?? "unknown";
      const reloadKey = `ssg-reloaded-${hash}`;
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, "1");
        // Use replace() not reload(): replace() is a full navigation so the
        // browser fetches fresh HTML (bypassing page cache), which references
        // the new hashed JS bundle. reload() may replay from cache.
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
      }
      // Return an empty manifest so the loader returns null instead of throwing
      // while the navigation is in flight.
      return new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return response;
  };
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
