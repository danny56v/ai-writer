"use client";

import Link from "next/link";
import Image from "next/image";

import type { BlogPost } from "@/data/blogPosts";

interface FeaturedPostsProps {
  posts: BlogPost[];
  title?: string;
  eyebrow?: string;
  description?: string;
}

const DEFAULT_TITLE = "From the ListologyAi blog";
const DEFAULT_DESCRIPTION = "Stories, releases, and best practices for shipping standout real estate content.";

export function FeaturedPosts({
  posts,
  title = DEFAULT_TITLE,
  eyebrow = "Blog",
  description = DEFAULT_DESCRIPTION,
}: FeaturedPostsProps) {
  return (
    <section className="relative isolate overflow-hidden px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <span className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="mt-3 text-3xl font-semibold tracking-tight   sm:text-4xl">{title}</h2>
          {description ? <p className="mt-2 text-lg leading-7 text-neutral-500">{description}</p> : null}
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative isolate flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white/95 px-6 pb-6 pt-64 text-left shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)] sm:pt-56 lg:pt-64"
            >
              <Image
                alt={post.title}
                src={post.imageUrl}
                width={1200}
                height={800}
                className="absolute inset-0 -z-10 h-full w-full object-cover"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent" />
              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <div className="flex items-center gap-x-2.5">
                    <Image
                      alt={post.author.name}
                      src={post.author.imageUrl}
                      width={24}
                      height={24}
                      className="h-6 w-6 flex-none rounded-full bg-white/20 object-cover ring-2 ring-white/40"
                    />
                    <span className="tracking-normal text-sm font-medium text-white">{post.author.name}</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-7 text-white">
                <Link href={`/blog/${post.slug}`}>
                  <span className="absolute inset-0" aria-hidden />
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/80">{post.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] transition hover:bg-neutral-800"
          >
            View all posts
          </Link>
        </div>
      </div>
    </section>
  );
}
