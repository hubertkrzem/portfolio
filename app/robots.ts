import type { MetadataRoute } from "next";

const SITE_URL = "https://www.hubertkrzem.com";

// Crawlers primarily used to scrape content for AI/LLM training datasets,
// as opposed to search indexing or recruiter/ATS tooling.
const AI_TRAINING_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Diffbot",
  "Omgilibot",
  "Omgili",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "cohere-ai",
  "Timpibot",
  "ImagesiftBot",
  "YouBot",
  "Webzio-Extended",
  "ICC-Crawler",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines, social-preview bots, and recruiter/ATS tooling —
      // left open so the site stays discoverable.
      {
        userAgent: "*",
        allow: "/",
        // Not linked anywhere on the site; excluded from crawling so it
        // doesn't get indexed or picked up by anything well-behaved.
        disallow: "/cv-03vsa5d92h.pdf",
      },
      // Known AI/data-scraping crawlers — blocked outright.
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
