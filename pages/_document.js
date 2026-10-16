import { Html, Head, Main, NextScript } from "next/document";

/**
 * The theme stamp has to land before first paint, otherwise a visitor who
 * picked dark gets a white flash on every navigation. This runs blocking,
 * ahead of React. It also picks the matching tab icon: a dark mark on the
 * light theme, a light mark on the dark one. (An SVG icon's own
 * prefers-color-scheme follows the OS, not the browser's tab colour, so the
 * site theme is the dependable signal.)
 */
const themeScript = `
(function(){
  var t = "light";
  try {
    var s = localStorage.getItem("hd-theme");
    if (s === "dark" || s === "light") t = s;
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", t);
  var icon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (icon) icon.href = t === "dark" ? "/favicon-dark.svg" : "/favicon.svg";
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Exo:wght@700&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Sans:wght@400;500;600&display=swap"
        />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
