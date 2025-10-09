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
    <section className="bg-white py-8 sm:py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-700">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-2 text-lg leading-8 text-gray-600">{description}</p>
          ) : null}
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-64 lg:pt-80"
            >
              <Image
                alt={post.title}
                src={post.imageUrl}
                width={1200}
                height={800}
                className="absolute inset-0 -z-10 h-full w-full object-cover"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
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
                      className="h-6 w-6 flex-none rounded-full bg-white/10 object-cover"
                    />
                    <span>{post.author.name}</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <Link href={`/blog/${post.slug}`}>
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-200">{post.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            View all posts
          </Link>
        </div>
      </div>
    </section>
  );
}
