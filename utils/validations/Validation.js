import { Messages } from "@/utils/Message";
import { required, email, phone, minLength } from "./ValidateField";

/** Field rules for the contact form, shared by the client and the API route. */
export const ContactRules = {
  name: (v) => required(v, Messages.Validation.NameRequired),
  email: (v) => required(v, Messages.Validation.EmailRequired) || email(v),
  phone: (v) => phone(v),
  message: (v) =>
    required(v, Messages.Validation.MessageRequired) ||
    minLength(v, 10, Messages.Validation.MessageShort),
};

/** Validate one field. Returns an error string, or null when it passes. */
export function ValidateField(values, key) {
  const rule = ContactRules[key];
  return rule ? rule(values[key]) : null;
}

/** Validate every field. Returns { isValid, error } the way the rest of the app expects. */
export function ValidateAll(values) {
  const error = {};
  Object.keys(ContactRules).forEach((key) => {
    const message = ValidateField(values, key);
    if (message) error[key] = message;
  });
  return { isValid: Object.keys(error).length === 0, error };
}
