import React from "react";
import data from "@/assets/data/portfolio.json";

/** harshil.dev — ink for the name, brand gradient for the .dev */
const Wordmark = () => {
  const { name, tld } = data.profile.wordmark;
  return (
    <span className="wordmark">
      {name}
      <span className="dev">{tld}</span>
    </span>
  );
};

export default Wordmark;
