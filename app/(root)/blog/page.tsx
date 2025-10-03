import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "HomeListerAi Blog",
  description:
    "Read product deep dives, customer spotlights, and content strategy tips from the HomeListerAi team.",
  openGraph: {
    title: "HomeListerAi Blog",
    description:
      "Fresh insights on AI-assisted real estate marketing, customer success stories, and workflow best practices.",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "HomeListerAi blog logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeListerAi Blog",
    description:
      "Stay ahead with articles on AI workflows, listing optimization, and campaign strategy for real estate teams.",
    images: ["/Logo.png"],
  },
};

const BlogPage = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Blog
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Insights from the HomeListerAi team
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Product stories, feature deep dives, and customer lessons that help you scale premium content faster.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{post.date}</p>
                <h2 className="mt-3 text-xl font-semibold leading-7 text-gray-900">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{post.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-indigo-600">
                <span>{post.readTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 ring-1 ring-inset ring-indigo-200 transition hover:bg-indigo-100"
                >
                  Read more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
