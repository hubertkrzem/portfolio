export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Internship"
  | "Seasonal"
  | "Contract"
  | "Freelance"
  | "Volunteer";

export interface ExperienceEntry {
  /** Job title / role, e.g. "Software Engineer Intern" */
  title: string;
  /** Company or organisation name */
  company: string;
  /** Human-readable time period, e.g. "Jun 2025 – Aug 2025" */
  period: string;
  /** One-sentence summary of the role — shown above the bullet list */
  description: string;
  /** Optional bullet points for scope, stack, and specific achievements */
  bullets?: string[];
  /** Path to a logo/photo for this entry, e.g. "/experience/company.png" */
  image: string;
  /** Alt text for the image — defaults to "{company} logo" if omitted */
  imageAlt?: string;
  /** How the role was engaged — shown as a small label next to the dates */
  employmentType?: EmploymentType;
}

/**
 * Add, remove, or reorder entries here — the page renders however many are
 * listed, newest first. Swap the placeholder `image` paths for real logos
 * or photos dropped into /public/experience/.
 */
export const experience: ExperienceEntry[] = [
  {
    title: "Founder and Developer",
    company: "hk",
    period: "June 2025 – Present",
    description: "Started a digital services agency, delivering digital services for Irish SMEs.",
    bullets: [
      "Designed and delivered custom websites",
      "Meta and Google ads services",
      "Social media management",
    ],
    image: "/experience/hk_logo.svg",
    employmentType: "Freelance",
  },
  {
    title: "Product Manager",
    company: "IBM",
    period: "March 2026 - September 2026",
    description: "Contributed to IBM's customer-facing portal and internal reporting tools.",
    bullets: [
      "Owned end-to-end delivery of a product feature for the customer-facing portal, coordinating design handoff, writing tickets, running sync calls, and tracking progress to release.",
      "Built product dashboards surfacing sales and pipeline metrics, using static (HTML/JavaScript) and React frontends backed by PostgreSQL and containerised with Docker.",
      "Worked on a new feature for IBM's Bob LLM, allowing developers to work with multiple agents in parallel."
    ],
    image: "/experience/IBM_logo.svg",
    employmentType: "Internship",
  },
  /* {
    title: "Role Title",
    company: "Company Name",
    period: "Mon YYYY – Mon YYYY",
    description:
      "Placeholder description — replace with 2–3 sentences covering scope, the stack you used, and a measurable outcome.",
    image: "/experience/placeholder-3.svg",
    employmentType: "Seasonal",
  }, */
];
