import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "ListologyAi Blog: address-to-description playbooks",
  description:
    "Explore ListologyAi guides on turning any property address into a persuasive listing description, plus copy best practices and AI workflows for agents.",
  keywords: ["ListologyAi blog", "address to description", "real estate copywriting tips", "AI property description strategies", "listing advice"],
  openGraph: {
    title: "ListologyAi Blog: address-to-description playbooks",
    description:
      "Get actionable guidance on using ListologyAi to drop an address and receive polished copy, plus persuasive writing tips for real estate agents.",
    url: "https://listologyai.com/blog",
    type: "website",
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
    title: "ListologyAi Blog: address-to-description playbooks",
    description:
      "Stay ahead with ListologyAi articles on pasting an address to get a listing description, plus publication-ready writing techniques.",
    images: ["/Logo.png"],
  },
};

const BlogPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-neutral-50 to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white via-white/95 to-transparent" />
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl" />
        <div className="absolute right-0 top-[18rem] h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl sm:right-[-4rem]" />
        <div className="absolute inset-x-10 bottom-[-6rem] h-96 rounded-full bg-neutral-100/40 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 lg:px-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500 ring-1 ring-neutral-200">
            Blog & Resources
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight   sm:text-5xl">
            Stories, strategy, and product updates from the ListologyAi team
          </h1>
          <p className="mt-6 text-lg leading-7 text-neutral-500">
            Dive into our playbook for faster real estate marketing: launch recaps, customer spotlights, AI workflow
            tips, and behind-the-scenes deep dives written by the people building ListologyAi.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-[0_45px_110px_-70px_rgba(15,23,42,0.55)]"
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
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
                  <span>{post.date}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600 ring-1 ring-neutral-200">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold leading-7  ">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition hover:  focus-visible:outline-none focus-visible:  group-hover: "
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm leading-6 text-neutral-500">{post.description}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full ring-2 ring-neutral-100">
                      <Image
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <div className="text-sm leading-tight">
                      <p className="font-semibold  ">{post.author.name}</p>
                      <p className="text-xs text-neutral-500">ListologyAi Editorial</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_25px_70px_-45px_rgba(15,23,42,0.8)] transition hover:bg-neutral-800"
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
