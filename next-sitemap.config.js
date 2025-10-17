/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://listologyai.com",
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
  transform: async (config, path) => {
    const priorityMap = [
      { includes: /^\/$/, priority: 1.0, changefreq: "daily" },
      { includes: /^\/pricing$/, priority: 0.9, changefreq: "weekly" },
      { includes: /^\/blog(\/.*)?$/, priority: 0.8, changefreq: "weekly" },
    ];

    let priority = 0.7;
    let changefreq = "weekly";
    for (const rule of priorityMap) {
      if (rule.includes.test(path)) {
        priority = rule.priority;
        changefreq = rule.changefreq;
        break;
      }
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
};
