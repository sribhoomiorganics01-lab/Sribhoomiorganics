import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation(); // 🔥 ADD search

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search]); // 🔥 include search

  return null;
};

export default ScrollToTop;