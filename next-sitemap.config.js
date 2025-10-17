const blogSlugs = [
  "how-to-write-compelling-real-estate-descriptions",
  "seo-strategies-for-real-estate-listings",
  "email-campaigns-that-convert-buyers",
  "social-media-ideas-for-property-launches",
  "collaboration-playbook-for-agents-and-marketers",
  "ai-checklist-for-compliant-listings",
  "top-10-apartment-description-examples",
  "why-ai-is-transforming-real-estate-marketing",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://listologyai.com",
  outDir: "public",
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  sitemapSize: 45000,
  exclude: ["/sign-in", "/sign-up", "/forgot-password", "/dashboard", "/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: "*",
        disallow: ["/sign-in", "/sign-up", "/forgot-password", "/dashboard", "/api"],
      },
    ],
  },
  additionalPaths: async () => {
    const baseEntries = [
      { loc: "/", changefreq: "daily", priority: 1.0 },
      { loc: "/real-estate-generator", changefreq: "daily", priority: 0.9 },
      { loc: "/pricing", changefreq: "weekly", priority: 0.9 },
      { loc: "/about", changefreq: "monthly", priority: 0.6 },
      { loc: "/blog", changefreq: "weekly", priority: 0.8 },
    ];

    const blogEntries = blogSlugs.map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: "monthly",
      priority: 0.7,
    }));

    return [...baseEntries, ...blogEntries].map((entry) => ({
      ...entry,
      lastmod: new Date().toISOString(),
    }));
  },
  transform: async (config, path) => {
    // Skip default generation for excluded routes; rely on additionalPaths above.
    return {
      loc: path,
      changefreq: "weekly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
