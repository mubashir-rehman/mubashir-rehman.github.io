import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();

export default function ScrollRestoration() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(pathname, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      scrollPositions.set(prevPathRef.current, window.scrollY);
      prevPathRef.current = pathname;
    }

    const saved = scrollPositions.get(pathname);
    window.scrollTo(0, saved ?? 0);
  }, [pathname]);

  return null;
}
