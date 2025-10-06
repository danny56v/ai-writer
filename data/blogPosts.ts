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
    slug: "how-to-write-compelling-real-estate-descriptions",
    title: "How to Write Compelling Real Estate Descriptions",
    description:
      "Practical steps and field-tested tips that turn raw property data into persuasive copy buyers remember.",
    date: "Oct 21, 2024",
    datetime: "2024-10-21",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Andreea Popescu",
      imageUrl:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "A memorable listing description starts with the basics: location, property type, and the audience you’re writing for. Before you draft a single line, clarify what makes the home stand out and what buyers truly value.",
      "Keep the tone professional yet warm, and highlight tangible benefits—storage, natural light, school access, community perks. Avoid generic buzzwords that don’t tell a story.",
      "Close with a clear call to action. The goal is more than sharing information; it’s to spark curiosity, create urgency, and leave prospects eager to schedule a tour."
    ],
  },
  {
    slug: "seo-strategies-for-real-estate-listings",
    title: "SEO Strategies for Real Estate Listings",
    description:
      "Keyword research, metadata, and on-page tactics that help your listings rank and stay visible in competitive markets.",
    date: "Nov 11, 2024",
    datetime: "2024-11-11",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Daniel Harper",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Great copy deserves to be discovered. We outline how to select intent-driven keywords, craft metadata, and use structured data to help search engines surface your listings.",
      "The post includes sample schema markup, URL structures, and title formats that balance search visibility with click-worthy messaging.",
      "Pair these SEO tactics with AI-generated drafts to keep every property page consistent, compliant, and easy to find." 
    ],
  },
  {
    slug: "email-campaigns-that-convert-buyers",
    title: "Email Campaigns That Convert Buyers",
    description:
      "Build nurture sequences, property spotlights, and follow-up messages that keep leads warm without manual effort.",
    date: "Nov 18, 2024",
    datetime: "2024-11-18",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Sara Williams",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Lead nurture emails no longer have to feel generic. We share frameworks for property spotlights, neighbourhood highlights, and drip campaigns that move prospects toward tours.",
      "Templates show how to blend AI-generated copy with personalised touches like saved searches and agent insights.",
      "You’ll also get benchmarks for open and reply rates so marketing and sales can align on what ‘good’ looks like." 
    ],
  },
  {
    slug: "social-media-ideas-for-property-launches",
    title: "Social Media Ideas for Property Launches",
    description:
      "Storyboard short-form video, carousel posts, and live events that showcase new inventory with minimal prep time.",
    date: "Nov 25, 2024",
    datetime: "2024-11-25",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Jason Clark",
      imageUrl:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "From teaser reels to behind-the-scenes tours, learn how to build social calendars that keep buyers engaged leading up to launch day.",
      "We share caption formulas, visual hooks, and scheduling checklists so your team can execute repeatable playbooks.",
      "Plus, see how to repurpose AI-generated listing copy across Instagram, TikTok, LinkedIn, and email without rewriting from scratch." 
    ],
  },
  {
    slug: "collaboration-playbook-for-agents-and-marketers",
    title: "Collaboration Playbook for Agents and Marketers",
    description:
      "Roles, rituals, and shared dashboards that keep creative, sales, and compliance moving in the same direction.",
    date: "Dec 2, 2024",
    datetime: "2024-12-02",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Priya Patel",
      imageUrl:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "When teams centralise briefs, prompts, and approvals, launches ship faster and brand voice stays intact. We share weekly rituals and dashboards that make alignment effortless.",
      "Discover how to configure HomeListerAi workspaces, comment threads, and usage alerts so everyone understands progress and bottlenecks.",
      "Use the included meeting agendas and permission matrix to give leadership visibility without slowing down execution." 
    ],
  },
  {
    slug: "ai-checklist-for-compliant-listings",
    title: "AI Checklist for Compliant Listings",
    description:
      "A step-by-step guide to keeping fair-housing, disclosure, and brand guidelines intact when using AI-generated copy.",
    date: "Dec 9, 2024",
    datetime: "2024-12-09",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Nora Chen",
      imageUrl:
        "https://images.unsplash.com/photo-1544723795-43253756d6f5?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "Compliance is non-negotiable. This checklist covers tone reviews, equal-housing reminders, and factual accuracy prompts to run before publishing.",
      "Learn how to embed legal checkpoints directly into your AI workflows so reviewers catch issues early without derailing timelines.",
      "We also share a templated escalation process to follow when adjustments are needed, ensuring every listing stays audit-ready." 
    ],
  },
  {
    slug: "top-10-apartment-description-examples",
    title: "Top 10 Apartment Description Examples",
    description:
      "Hand-picked examples for studios, premium apartments, and luxury penthouses that you can adapt in minutes.",
    date: "Oct 28, 2024",
    datetime: "2024-10-28",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Mihai Ionescu",
      imageUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "We analysed hundreds of listings to surface 10 apartment descriptions that consistently convert—covering efficient studios, family-friendly condos, and dramatic penthouses.",
      "Each example breaks down structure, tone, and the details that make buyers pause so you can remix the approach for your own inventory.",
      "Use these as swipe files for your team or drop them into HomeListerAi to spin up customised variants in minutes."
    ],
  },
  {
    slug: "why-ai-is-transforming-real-estate-marketing",
    title: "Why AI Is Transforming Real Estate Marketing",
    description:
      "Trends, case studies, and hands-on ideas showing how AI accelerates campaigns for agencies and developers alike.",
    date: "Nov 4, 2024",
    datetime: "2024-11-04",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Laura Bennett",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=3&w=256&h=256&q=80",
    },
    content: [
      "AI has moved from experiment to essential marketing tool. It automates drafting, personalises messaging, and surfaces clear performance data for every campaign.",
      "Teams that adopt AI win back hours for strategy and creative work: repetitive tasks disappear while messaging stays consistent across every channel.",
      "Integrating AI with your CRM and listing platforms delivers a seamless buyer experience, reducing acquisition costs and improving conversion rates."
    ],
  },
];
