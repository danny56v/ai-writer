
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function renderArticleContent(content: string[], slug: string): ReactNode[] {
  const elements: ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[]; key: string } | null = null;
  let paragraphCount = 0;
  let headingCount = 0;

  const flushList = () => {
    if (!listBuffer || listBuffer.items.length === 0) return;
    const currentList = listBuffer;
    const marginTop = elements.length === 0 ? "mt-0" : "mt-6";

    if (currentList.ordered) {
      elements.push(
        <ol
          key={currentList.key}
          className={`${marginTop} space-y-3 pl-6 text-base leading-7 text-gray-800 marker:text-indigo-500`}
        >
          {currentList.items.map((item, itemIndex) => (
            <li key={`${currentList.key}-item-${itemIndex}`} className="font-medium">
              {item}
            </li>
          ))}
        </ol>,
      );
    } else {
      elements.push(
        <ul key={currentList.key} className={`${marginTop} flex flex-col gap-3`}>
          {currentList.items.map((item, itemIndex) => (
            <li
              key={`${currentList.key}-item-${itemIndex}`}
              className="flex items-start gap-3 rounded-2xl border border-indigo-100/80 bg-white/90 p-4 shadow-sm shadow-indigo-100/60"
            >
              <span className="mt-2 h-2 w-2 flex-none rounded-full bg-indigo-500" />
              <span className="text-sm font-semibold leading-6 text-gray-800">{item}</span>
            </li>
          ))}
        </ul>,
      );
    }

    listBuffer = null;
  };

  content.forEach((raw, index) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const marginTop = elements.length === 0 ? "mt-0" : "mt-6";

    if (trimmed.startsWith("## ")) {
      flushList();
      const isFirstHeading = headingCount === 0;
      headingCount += 1;
      elements.push(
        <h2
          key={`${slug}-heading-${index}`}
          className={`${isFirstHeading ? "mt-0" : "mt-16"} text-2xl font-semibold tracking-tight text-indigo-900 sm:text-3xl`}
        >
          {trimmed.replace("## ", "").trim()}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={`${slug}-subheading-${index}`}
          className="mt-10 text-xl font-semibold tracking-tight text-indigo-800 sm:text-2xl"
        >
          {trimmed.replace("### ", "").trim()}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith("[callout]")) {
      flushList();
      const payload = trimmed.replace("[callout]", "").trim();
      if (!payload) return;
      const segments = payload
        .split("|")
        .map((segment) => segment.trim())
        .filter(Boolean);
      if (segments.length === 0) return;
      const [title, ...body] = segments;
      const calloutMargin = elements.length === 0 ? "mt-0" : "mt-10";
      elements.push(
        <div
          key={`${slug}-callout-${index}`}
          className={`${calloutMargin} relative overflow-hidden rounded-3xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-lg shadow-indigo-100/40 md:p-8`}
        >
          <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-56 w-56 -translate-y-1/2 rounded-full bg-indigo-200/40 blur-3xl md:block" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-purple-200/30 blur-3xl" />
          <div className="relative space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">{title}</p>
            <div className="space-y-3 text-sm leading-6 text-indigo-900">
              {body.map((line, bodyIndex) => (
                <p key={`${slug}-callout-${index}-body-${bodyIndex}`}>{line}</p>
              ))}
            </div>
          </div>
        </div>,
      );
      return;
    }

    if (trimmed.startsWith(">")) {
      flushList();
      const quotePayload = trimmed.slice(1).trim();
      const [quoteText, citation] = quotePayload.split("|").map((part) => part.trim());
      elements.push(
        <figure
          key={`${slug}-quote-${index}`}
          className="mt-10 border-l-4 border-indigo-500/60 bg-indigo-50/60 px-6 py-5 shadow-sm shadow-indigo-100/40"
        >
          <blockquote className="text-base font-semibold leading-7 text-indigo-900">{quoteText}</blockquote>
          {citation ? <figcaption className="mt-3 text-sm font-medium text-indigo-700">{citation}</figcaption> : null}
        </figure>,
      );
      return;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (trimmed.startsWith("- ") || orderedMatch) {
      const ordered = Boolean(orderedMatch);
      const itemText = ordered ? orderedMatch?.[2] ?? "" : trimmed.slice(2).trim();
      if (!itemText) return;

      if (!listBuffer || listBuffer.ordered !== ordered) {
        flushList();
        listBuffer = {
          ordered,
          items: [],
          key: `${slug}-list-${index}`,
        };
      }

      listBuffer.items.push(itemText);
      return;
    }

    flushList();
    paragraphCount += 1;
    const isLead = paragraphCount === 1;

    elements.push(
      <p
        key={`${slug}-paragraph-${index}`}
        className={`${marginTop} ${isLead ? "text-lg font-medium leading-8 text-gray-900 sm:text-xl" : "text-base leading-8 text-gray-700"}`}
      >
        {trimmed}
      </p>,
    );
  });

  flushList();
  return elements;
}
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "ListologyAi Blog",
      description: "ListologyAi insights on AI-powered real estate marketing.",
      keywords: ["ListologyAi blog", "real estate AI insights"],
    };
  }

  const pageTitle = `ListologyAi: ${post.title}`;
  const pageUrl = `https://listologyai.com/blog/${post.slug}`;

  return {
    title: pageTitle,
    description: post.description,
    keywords: [
      post.title,
      "ListologyAi real estate marketing",
      "ListologyAi blog",
      "real estate AI tips",
      "property description strategies",
    ],
    openGraph: {
      title: pageTitle,
      description: post.description,
      url: pageUrl,
      type: "article",
      publishedTime: post.datetime,
      authors: [post.author.name],
      images: [{ url: post.imageUrl, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: post.description,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <article className="bg-white text-gray-900">
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gray-950/50" />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-32 text-white lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-indigo-200 hover:text-indigo-100">
            ← Back to all posts
          </Link>
          <div className="mt-6 inline-flex items-center gap-4 text-sm text-indigo-200">
            <time dateTime={post.datetime}>{formatDate(post.datetime)}</time>
            <span aria-hidden>•</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
          <div className="mt-8 flex items-center gap-4 text-sm text-indigo-100">
            <Image
              src={post.author.imageUrl}
              alt={post.author.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-indigo-200/80">ListologyAi Team</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100/70 bg-white/90 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-sm sm:p-12">
          <div className="pointer-events-none absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            {renderArticleContent(post.content, post.slug)}
          </div>
        </div>
      </div>

      <section className="relative isolate mt-20 w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-6 py-16 sm:px-8 lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-indigo-900 sm:text-2xl">Keep reading</h2>
              <p className="mt-2 max-w-2xl text-sm text-indigo-700">
                More stories from the ListologyAi blog to power your next launch and sharpen your marketing playbook.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
            >
              View all articles <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <article
                key={related.slug}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-100/70 bg-white shadow-lg shadow-indigo-100/40 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={related.imageUrl}
                    alt={related.title}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <time
                    className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 shadow-sm"
                    dateTime={related.datetime}
                  >
                    {formatDate(related.datetime)}
                  </time>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    <span>{related.readTime}</span>
                  </div>

                  <Link href={`/blog/${related.slug}`} className="group/title block focus-visible:outline-none">
                    <h3 className="text-lg font-semibold leading-7 text-gray-900 transition group-hover/title:text-indigo-600 group-focus-visible/title:text-indigo-600">
                      {related.title}
                    </h3>
                  </Link>

                  <p className="line-clamp-3 text-sm text-gray-600">{related.description}</p>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full ring-2 ring-indigo-100">
                        <Image
                          src={related.author.imageUrl}
                          alt={related.author.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <div className="text-xs font-semibold text-gray-600">
                        <p className="text-gray-900">{related.author.name}</p>
                        <p className="text-gray-500">ListologyAi Team</p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                      Read more <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}



// import type { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";

// import { blogPosts } from "@/data/blogPosts";

// function formatDate(value: string) {
//   return new Date(value).toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// export function generateStaticParams() {
//   return blogPosts.map((post) => ({ slug: post.slug }));
// }

// export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
//   const post = blogPosts.find((item) => item.slug === params.slug);

//   if (!post) {
//     return {
//       title: "ListologyAi Blog",
//     };
//   }

//   return {
//     title: `${post.title} | ListologyAi Blog`,
//     description: post.description,
//     openGraph: {
//       title: `${post.title} | ListologyAi Blog`,
//       description: post.description,
//       type: "article",
//       publishedTime: post.datetime,
//       authors: [post.author.name],
//       images: [{ url: post.imageUrl }],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: post.title,
//       description: post.description,
//       images: [post.imageUrl],
//     },
//   };
// }

// export default function BlogPostPage({ params }: { params: { slug: string } }) {
//   const post = blogPosts.find((item) => item.slug === params.slug);

//   if (!post) {
//     notFound();
//   }

//   const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

//   return (
//     <article className="bg-white text-gray-900">
//       <header className="relative isolate overflow-hidden">
//         <div className="absolute inset-0 -z-10">
//           <Image
//             src={post.imageUrl}
//             alt={post.title}
//             fill
//             className="object-cover"
//             priority
//             sizes="100vw"
//           />
//           <div className="absolute inset-0 bg-gray-950/50" />
//         </div>
//         <div className="mx-auto max-w-4xl px-6 py-32 text-white lg:px-8">
//           <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-indigo-200 hover:text-indigo-100">
//             ← Back to all posts
//           </Link>
//           <div className="mt-6 inline-flex items-center gap-4 text-sm text-indigo-200">
//             <time dateTime={post.datetime}>{formatDate(post.datetime)}</time>
//             <span aria-hidden>•</span>
//             <span>{post.readTime}</span>
//           </div>
//           <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
//           <div className="mt-8 flex items-center gap-4 text-sm text-indigo-100">
//             <Image
//               src={post.author.imageUrl}
//               alt={post.author.name}
//               width={48}
//               height={48}
//               className="h-12 w-12 rounded-full object-cover"
//             />
//             <div>
//               <p className="font-semibold">{post.author.name}</p>
//               <p className="text-indigo-200/80">ListologyAi Team</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
//         <div className="prose prose-lg prose-indigo max-w-none">
//           {post.content.map((paragraph, index) => (
//             <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
//           ))}
//         </div>

//         <section className="mt-16 rounded-2xl bg-indigo-50 p-8">
//           <h2 className="text-lg font-semibold text-indigo-900">Keep reading</h2>
//           <p className="mt-2 text-sm text-indigo-700">
//             More stories from the ListologyAi blog to power your next launch.
//           </p>
//           <div className="mt-8 grid gap-6 lg:grid-cols-3">
//             {relatedPosts.map((related) => (
//               <article key={related.slug} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
//                 <time className="text-xs font-semibold uppercase tracking-wide text-indigo-500" dateTime={related.datetime}>
//                   {formatDate(related.datetime)}
//                 </time>
//                 <h3 className="mt-3 text-base font-semibold text-gray-900">
//                   <Link href={`/blog/${related.slug}`}>{related.title}</Link>
//                 </h3>
//                 <p className="mt-2 line-clamp-3 text-sm text-gray-600">{related.description}</p>
//               </article>
//             ))}
//           </div>
//         </section>
//       </div>
//     </article>
//   );
// }
