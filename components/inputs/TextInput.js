import React from "react";
import ValidationText from "@/utils/validations/ValidationText";

const TextInput = (props) => (
  <div className="ff">
    <label htmlFor={props.id}>
      {props.label}
      {props.optional ? <span className="ff__opt"> (optional)</span> : null}
    </label>
    <input
      id={props.id}
      name={props.name || props.id}
      type={props.type || "text"}
      value={props.value}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete || "off"}
      disabled={props.disabled === true}
      onChange={(event) => props.onChange(event, props.id)}
      onBlur={props.onBlur ? () => props.onBlur(props.id) : undefined}
      aria-invalid={props.error ? "true" : undefined}
    />
    <ValidationText error={props.error} />
  </div>
);

export default TextInput;
