/**
 * ReactApp.tsx
 *
 * The entire React SPA as a single Astro island (client:only="react").
 * This replaces both main.tsx (ViteReactSSG entry) and App.tsx.
 *
 * Architecture:
 *  - Astro pages handle the HTML shell + static SEO head
 *  - This island hydrates on the client and takes over all routing/UI
 *  - BrowserRouter reads window.location so each Astro page serves the
 *    correct route on initial load, and React Router handles SPA navigation
 *    thereafter (AnimatePresence, BottomNav useLocation(), etc. all work)
 */

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SakuraPetals from "@/components/SakuraPetals";
import ScrollRestoration from "@/components/ScrollRestoration";
import ScrollToTop from "@/components/ScrollToTop";
import AskMe from "@/components/AskMe";
import BottomNav from "@/components/BottomNav";
import ThemeFAB from "@/components/ThemeFAB";

// ---------------------------------------------------------------------------
// Lazy-loaded page components
// ---------------------------------------------------------------------------
const Landing   = lazy(() => import("@/components/pages/Landing"));
const About     = lazy(() => import("@/components/pages/About"));
const Projects  = lazy(() => import("@/components/pages/Projects"));
const Hobbies   = lazy(() => import("@/components/pages/Hobbies"));
const Habits    = lazy(() => import("@/components/pages/Habits"));
const JournalList  = lazy(() =>
  import("@/components/pages/Journal").then((m) => ({ default: m.JournalList }))
);
const JournalEntry = lazy(() =>
  import("@/components/pages/Journal").then((m) => ({ default: m.JournalEntry }))
);
const Contact   = lazy(() => import("@/components/pages/Contact"));
const NotFound  = lazy(() => import("@/components/pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

// ---------------------------------------------------------------------------
// Inner app — needs Router context so must be a child of BrowserRouter
// ---------------------------------------------------------------------------
function AppInner() {
  const location = useLocation();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <>
              <SakuraPetals />
              <ScrollRestoration />
              <ScrollToTop />
              <AskMe />
              <ThemeFAB />
              <BottomNav />
              <Navbar />
              <main className="min-h-screen pt-0">
                <div className="pb-16 md:pb-0">
                  <AnimatePresence mode="wait">
                    <Suspense fallback={<PageLoader />}>
                      <Routes location={location} key={location.pathname}>
                        <Route path="/"                  element={<Landing />} />
                        <Route path="/about"             element={<About />} />
                        <Route path="/projects"          element={<Projects />} />
                        <Route path="/hobbies"           element={<Hobbies />} />
                        <Route path="/habits"            element={<Habits />} />
                        <Route path="/journal"           element={<JournalList />} />
                        <Route path="/journal/:slug"     element={<JournalEntry />} />
                        <Route path="/contact"           element={<Contact />} />
                        <Route path="*"                  element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </AnimatePresence>
                </div>
              </main>
              <div className="hidden md:block">
                <Footer />
              </div>
            </>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

// ---------------------------------------------------------------------------
// Exported root — BrowserRouter must wrap everything that uses react-router
// ---------------------------------------------------------------------------
export default function ReactApp() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
