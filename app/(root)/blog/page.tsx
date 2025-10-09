import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "ListologyAi Blog",
  description:
    "Read product deep dives, customer spotlights, and content strategy tips from the ListologyAi team.",
  openGraph: {
    title: "ListologyAi Blog",
    description:
      "Fresh insights on AI-assisted real estate marketing, customer success stories, and workflow best practices.",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi blog logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Blog",
    description:
      "Stay ahead with articles on AI workflows, listing optimization, and campaign strategy for real estate teams.",
    images: ["/Logo.png"],
  },
};

const BlogPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white via-white/95 to-transparent" />
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute right-0 top-[18rem] h-80 w-80 rounded-full bg-purple-200/40 blur-3xl sm:right-[-4rem]" />
        <div className="absolute inset-x-10 bottom-[-6rem] h-96 rounded-full bg-indigo-100/30 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-200">
            Blog & Resources
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Stories, strategy, and product updates from the ListologyAi team
          </h1>
          <p className="mt-6 text-lg leading-7 text-gray-600">
            Dive into our playbook for faster real estate marketing: launch recaps, customer spotlights, AI workflow tips, and
            behind-the-scenes deep dives written by the people building ListologyAi.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100/60 bg-white shadow-lg shadow-indigo-100/40 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={false}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  <span>{post.date}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600 ring-1 ring-indigo-100">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold leading-7 text-gray-900 group-hover:text-indigo-600">{post.title}</h2>
                <p className="text-sm leading-6 text-gray-600">{post.description}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full ring-2 ring-indigo-100">
                      <Image
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <div className="text-sm leading-tight">
                      <p className="font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-xs text-gray-500">ListologyAi Editorial</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                  >
                    Read article
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
