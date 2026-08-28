import { Messages } from "@/utils/Message";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;

export const required = (value, message) =>
  value && String(value).trim().length > 0 ? null : message;

export const email = (value) =>
  EMAIL.test(String(value || "").trim()) ? null : Messages.Validation.EmailInvalid;

/** Optional field — only checked when the visitor actually typed something. */
export const phone = (value) =>
  !value || String(value).trim() === "" || PHONE.test(String(value).trim())
    ? null
    : Messages.Validation.PhoneInvalid;

export const minLength = (value, len, message) =>
  String(value || "").trim().length >= len ? null : message;
