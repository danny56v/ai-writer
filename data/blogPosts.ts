export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  datetime: string;
  readTime: string;
  imageUrl: string;
  author: {
    name: string;
    imageUrl: string;
  };
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-homelisterai",
    title: "Introducing HomeListerAi: Your AI Partner for Real Estate and Content",
    description:
      "Discover why we built HomeListerAi and how it helps busy teams generate polished real estate listings and long-form articles in minutes.",
    date: "Jul 12, 2024",
    datetime: "2024-07-12",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Elena Martinez",
      imageUrl:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "HomeListerAi started with a simple premise: give real estate teams a creative copilot that understands their brand voice, compliance guardrails, and turnaround expectations.",
      "The platform pairs structured briefs with adaptive AI prompts so agents provide the context that matters—neighbourhood highlights, tone preferences, and selling points—while the system assembles polished copy in minutes.",
      "Since launch we have expanded beyond listings to long-form thought leadership, drip campaigns, and property newsletters, all grounded in reusable templates that keep messaging on-brand.",
    ],
  },
  {
    slug: "workflow-real-estate",
    title: "From Inquiry to Listing: Automating Real Estate Copy",
    description:
      "We walk through the Real Estate Generator, explaining how form inputs, templates, and AI prompts combine to deliver ready-to-publish copy.",
    date: "Jul 26, 2024",
    datetime: "2024-07-26",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Marcus Lee",
      imageUrl:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Turning an initial inquiry into a compelling listing used to require juggling spreadsheets, shared drives, and late-night copy edits.",
      "With HomeListerAi, agents capture property specs, unique selling points, and compliance notes in one guided workflow that generates a complete description instantly.",
      "The result is consistent voice, faster approvals, and more time to nurture prospective buyers.",
    ],
  },
  {
    slug: "collaboration-features",
    title: "Collaboration Features That Keep Your Team Aligned",
    description:
      "See how HomeListerAi keeps marketers, agents, and founders on the same page with shared histories, branded presets, and quota controls.",
    date: "Aug 8, 2024",
    datetime: "2024-08-08",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Priya Patel",
      imageUrl:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Scaling content across listings, newsletters, and paid campaigns requires visibility into who changed what and when.",
      "HomeListerAi centralises comments, version history, and brand-approved templates so teams can collaborate asynchronously without losing context.",
      "In this article we share the rituals, notifications, and permissioning model that keep everyone aligned from draft to publish.",
    ],
  },
  {
    slug: "ai-writing-ethics",
    title: "Responsible AI Writing: Keeping Quality and Compliance High",
    description:
      "Learn about the guardrails we added for tone, fair-housing guidelines, and factual accuracy when generating property descriptions.",
    date: "Aug 22, 2024",
    datetime: "2024-08-22",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Nora Chen",
      imageUrl:
        "https://images.unsplash.com/photo-1544723795-43253756d6f5?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Responsible AI means giving teams the controls to maintain trust with their customers and regulators.",
      "HomeListerAi includes fair-housing reminders, language checks, and factuality prompts that surface before drafts are shared externally.",
      "We also outline our review processes, data retention policies, and the human oversight that sits on top of every automated workflow.",
    ],
  },
  {
    slug: "power-tips",
    title: "8 Power Tips for Getting More Out of HomeListerAi",
    description:
      "Advanced tips for tweaking prompts, saving templates, and pairing HomeListerAi outputs with your favorite marketing tools.",
    date: "Sep 5, 2024",
    datetime: "2024-09-05",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Jason Clark",
      imageUrl:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Whether you are writing your first listing or iterating on a 20-page buyer guide, there are repeatable techniques that squeeze more value from HomeListerAi.",
      "We compiled the top configuration tweaks, prompt structures, and automation hooks power users rely on to deliver standout copy.",
      "Use these best practices to personalise drafts, blend AI with human edits, and feed learnings back into your brand templates.",
    ],
  },
  {
    slug: "customer-story-summit-realty",
    title: "Customer Story: How Summit Realty Tripled Listing Turnaround",
    description:
      "A behind-the-scenes look at how one brokerage adopted HomeListerAi across locations and saved 15 hours a week.",
    date: "Sep 19, 2024",
    datetime: "2024-09-19",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sarah Johnson",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Summit Realty operates across three cities with distinct buyer personas and marketing teams.",
      "Before HomeListerAi, coordinating messaging across those markets meant long feedback cycles and duplicated effort.",
      "Now agents share a central workspace for briefs, AI drafts, and revisions—cutting 15 hours of manual writing each week while keeping tone consistent.",
    ],
  },
  {
    slug: "roadmap-fall-2024",
    title: "Fall 2024 Roadmap: What We Are Shipping Next",
    description:
      "Get a preview of upcoming features like multilingual article outlines, team analytics, and instant MLS formatting.",
    date: "Oct 3, 2024",
    datetime: "2024-10-03",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Ahmed Khan",
      imageUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Our Fall 2024 roadmap is shaped by the feedback we hear daily from agencies and in-house teams.",
      "Expect multilingual outline generation, workspace-level analytics, and instant MLS formatting to roll out over the coming quarters.",
      "We also preview upgrades to security, team administration, and integrations that will make scaling even smoother.",
    ],
  },
  {
    slug: "why-upgrade-pro",
    title: "Why Teams Upgrade to HomeListerAi Pro",
    description:
      "Breaking down the differences between Free, Pro, and Unlimited plans so you can choose the right fit for your workflow.",
    date: "Oct 17, 2024",
    datetime: "2024-10-17",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Laura Bennett",
      imageUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Free, Pro, and Unlimited plans each serve a different stage of your content operations journey.",
      "We break down credit allowances, collaboration features, and usage controls so you can pick the tier that matches your goals.",
      "The article also highlights how teams upgrade seamlessly through the billing portal without disrupting ongoing campaigns.",
    ],
  },
];
