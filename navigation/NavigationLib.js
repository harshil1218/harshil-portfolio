/** Single source of truth for the section rail, the nav and the mobile drawer. */
export const Sections = [
  { id: "about", index: "01", label: "About" },
  { id: "skills", index: "02", label: "Expertise" },
  { id: "work", index: "03", label: "Work" },
  { id: "stack", index: "04", label: "Stack" },
  { id: "journey", index: "05", label: "Journey" },
  { id: "contact", index: "06", label: "Contact" },
];

export const SectionById = (id) => Sections.find((s) => s.id === id);
