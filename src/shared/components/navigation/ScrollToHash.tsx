import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Allows the page Hash navigation by vertical scroll
 */
export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return null;
}
