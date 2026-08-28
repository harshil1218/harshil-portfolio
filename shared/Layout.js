import React from "react";
import Header from "./Header";
import IconSprite from "@/components/icons/IconSprite";
import CodeCursor from "@/components/cursor/CodeCursor";
import useReveal from "@/utils/useReveal";

/**
 * There is deliberately no Footer — the page closes on the contact section.
 * The graticule and noise layers are fixed backdrops behind everything.
 */
const Layout = ({ children }) => {
  useReveal();

  return (
    <div className="page-layout">
      <IconSprite />
      <div className="graticule" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <CodeCursor />

      <Header />
      <main id="top" className="page-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
