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
    title: "Technical Product Manager Intern",
    company: "IBM",
    period: "March 2026 – September 2026",
    description: "Contributed to IBM's customer-facing portal and internal reporting tools.",
    bullets: [
      "Owned end-to-end delivery of a product feature for the customer-facing portal, coordinating design handoff, writing tickets, running sync calls, and tracking progress to release.",
      "Built product dashboards surfacing sales and pipeline metrics, using static (HTML/JavaScript) and React frontends backed by PostgreSQL and containerised with Docker.",
      "Built a desktop widget at an internal IBM hackathon for monitoring Bob's AI agents in real time; the Bob development team shipped a similar feature shortly after.",
      "Built Jiramon, a service that syncs ticket progress between Jira and Monday.com, saving my 4-person PM team an estimated ~4 hours a week of manual double entry.",
    ],
    image: "/experience/IBM_logo.svg",
    employmentType: "Internship",
  },
  {
    title: "Freelance Web Developer",
    company: "Self-employed",
    period: "June 2025 – March 2026",
    description: "Offered web design and development to small Irish businesses, covering requirements, design, build and handover.",
    bullets: [
      "Delivered a Next.js/TypeScript website with an editable CMS for Pension & Financial, a Dublin financial advisory firm; live for about a year (see Portfolio).",
    ],
    image: "/experience/hk_logo.svg",
    employmentType: "Freelance",
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
