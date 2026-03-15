import { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
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

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
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
                  <Outlet />
                </Suspense>
              </AnimatePresence>
            </div>
          </main>
          <Footer />
        </>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
