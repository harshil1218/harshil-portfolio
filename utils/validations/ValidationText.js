import React from "react";

const ValidationText = (props) =>
  props.error ? <div className="ff__error">{props.error}</div> : null;

export default ValidationText;
