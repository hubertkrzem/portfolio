import type { NextConfig } from "next";

// Site is fully static (no third-party scripts/analytics, no external image
// domains, self-hosted fonts via next/font), so a strict same-origin policy
// works without needing nonces or dynamic rendering (that route would force
// every page into dynamic rendering just to inject a per-request nonce).
// script-src needs 'unsafe-inline' because Next.js's App Router streams
// Server Component payloads via inline `<script>self.__next_f.push(...)</script>`
// tags on every page — without it those are blocked and client hydration
// (e.g. the animated Blob component) never runs. style-src needs it too,
// for the React inline `style` attributes used in Navbar/portfolio cards.
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
  // Superseded by CSP's frame-ancestors above, kept for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
