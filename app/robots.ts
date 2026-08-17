import type { MetadataRoute } from "next";

const SITE_URL = "https://www.hubertkrzem.com";

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
      {
        userAgent: "*",
        allow: "/",
        disallow: "/cv-03vsa5d92h.pdf",
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
