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

// ---------------------------------------------------------------------------
// Stale chunk recovery for React.lazy() imports.
//
// After a new deploy, Vite renames all JS chunks with a fresh content hash.
// If a visitor's browser has cached the old HTML, React.lazy() will try to
// fetch e.g. `Projects-OldHash.js` which no longer exists on the server.
// The dynamic import() rejects with "Failed to fetch dynamically imported
// module", bypassing the fetch monkey-patch above.
//
// This wrapper catches that rejection and performs one hard navigation so the
// browser re-fetches fresh HTML → new chunk URLs → everything resolves.
// The flag is keyed to the current URL so it applies per-route and resets
// naturally after a successful reload brings in the new bundle.
// ---------------------------------------------------------------------------
const CHUNK_RELOAD_KEY = "chunk-reload-v1";

function lazyWithReload<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    factory().catch((err: unknown) => {
      if (typeof window !== "undefined") {
        const key = `${CHUNK_RELOAD_KEY}:${window.location.pathname}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          window.location.replace(
            window.location.pathname +
              window.location.search +
              window.location.hash,
          );
          // Stall while the navigation is in flight — prevents a crash render.
          return new Promise<{ default: T }>(() => {});
        }
      }
      return Promise.reject(err);
    }),
  );
}

export const createRoot = ViteReactSSG({
  routes: [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, Component: lazyWithReload(() => import("@/pages/Landing")) },
        { path: "about", Component: lazyWithReload(() => import("@/pages/About")) },
        { path: "projects", Component: lazyWithReload(() => import("@/pages/Projects")) },
        { path: "hobbies", Component: lazyWithReload(() => import("@/pages/Hobbies")) },
        { path: "habits", Component: lazyWithReload(() => import("@/pages/Habits")) },
        { path: "journal", Component: lazyWithReload(() => import("@/pages/Journal").then(m => ({ default: m.JournalList }))) },
        { path: "journal/:slug", Component: lazyWithReload(() => import("@/pages/Journal").then(m => ({ default: m.JournalEntry }))) },
        { path: "contact", Component: lazyWithReload(() => import("@/pages/Contact")) },
        { path: "*", Component: lazyWithReload(() => import("@/pages/NotFound")) },
      ],
    }
  ],
});
