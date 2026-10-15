import { useEffect, useState } from "react";

/**
 * Tracks a media query. It is null on the server and on the first client
 * render, so the markup always hydrates the same, and settles right after
 * mount. Callers treat null as "not decided yet" and render nothing.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
