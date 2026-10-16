import { useCallback, useEffect, useState } from "react";

const KEY = "hd-theme";

/* the tab icon follows the site theme: dark mark on light, light mark on dark */
const setFavicon = (theme) => {
  const icon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (icon) icon.href = theme === "dark" ? "/favicon-dark.svg" : "/favicon.svg";
};

/**
 * Light/dark with three real states: an explicit choice stamps data-theme on
 * <html>, and no stamp means "follow the OS". The stamp is written by the
 * blocking script in _document so there is no flash before hydration.
 */
export default function useTheme() {
  const [theme, setTheme] = useState("light");

  const resolve = useCallback(() => {
    if (typeof document === "undefined") return "light";
    const stamped = document.documentElement.getAttribute("data-theme");
    if (stamped) return stamped;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  useEffect(() => {
    setTheme(resolve());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(resolve());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [resolve]);

  const toggle = useCallback(() => {
    const next = resolve() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setFavicon(next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode — the choice just won't persist */
    }
    setTheme(next);
  }, [resolve]);

  return { theme, toggle };
}
