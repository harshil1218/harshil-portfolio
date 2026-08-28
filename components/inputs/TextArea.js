import React from "react";
import ValidationText from "@/utils/validations/ValidationText";

const TextArea = (props) => (
  <div className="ff">
    <label htmlFor={props.id}>{props.label}</label>
    <textarea
      id={props.id}
      name={props.name || props.id}
      value={props.value}
      placeholder={props.placeholder}
      rows={props.rows || 5}
      disabled={props.disabled === true}
      onChange={(event) => props.onChange(event, props.id)}
      onBlur={props.onBlur ? () => props.onBlur(props.id) : undefined}
      aria-invalid={props.error ? "true" : undefined}
    />
    <ValidationText error={props.error} />
  </div>
);

export default TextArea;
