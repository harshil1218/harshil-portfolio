import React from "react";
import MetaData from "@/components/common/metaData/MetaData";
import Hero from "./Hero";
import Ticker from "./Ticker";
import About from "./About";
import Expertise from "./Expertise";
import Work from "./Work";
import Stack from "./Stack";
import Journey from "./Journey";
import Contact from "./Contact";

const Rule = () => <div className="rule" />;

function Home() {
  return (
    <div className="home-page">
      <MetaData />
      <Hero />
      <Ticker />
      <About />
      <Rule />
      <Expertise />
      <Rule />
      <Work />
      <Rule />
      <Stack />
      <Rule />
      <Journey />
      <Rule />
      <Contact />
    </div>
  );
}

export default Home;
