export interface ExperienceEntry {
  /** Job title / role, e.g. "Software Engineer Intern" */
  title: string;
  /** Company or organisation name */
  company: string;
  /** Human-readable time period, e.g. "Jun 2025 – Aug 2025" */
  period: string;
  /** A few sentences on scope, stack, and impact */
  description: string;
  /** Path to a logo/photo for this entry, e.g. "/experience/company.png" */
  image: string;
  /** Alt text for the image — defaults to "{company} logo" if omitted */
  imageAlt?: string;
}

/**
 * Add, remove, or reorder entries here — the page renders however many are
 * listed, newest first. Swap the placeholder `image` paths for real logos
 * or photos dropped into /public/experience/.
 */
export const experience: ExperienceEntry[] = [
  {
    title: "Role Title",
    company: "Company Name",
    period: "Mon YYYY – Mon YYYY",
    description:
      "Placeholder description — replace with 2–3 sentences covering scope, the stack you used, and a measurable outcome (e.g. \"Built a data pipeline with Python and PostgreSQL that cut report generation time by 40%.\").",
    image: "/experience/placeholder-1.svg",
  },
  {
    title: "Role Title",
    company: "Company Name",
    period: "Mon YYYY – Mon YYYY",
    description:
      "Placeholder description — replace with 2–3 sentences covering scope, the stack you used, and a measurable outcome.",
    image: "/experience/placeholder-2.svg",
  },
  {
    title: "Role Title",
    company: "Company Name",
    period: "Mon YYYY – Mon YYYY",
    description:
      "Placeholder description — replace with 2–3 sentences covering scope, the stack you used, and a measurable outcome.",
    image: "/experience/placeholder-3.svg",
  },
];
