
import type { Metadata } from "next";
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
    return { title: "ListologyAi Blog" };
  }

  return {
    title: `${post.title} | ListologyAi Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | ListologyAi Blog`,
      description: post.description,
      type: "article",
      publishedTime: post.datetime,
      authors: [post.author.name],
      images: [{ url: post.imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
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

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="prose prose-lg prose-indigo max-w-none">
          {post.content.map((paragraph, index) => (
            <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
          ))}
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
