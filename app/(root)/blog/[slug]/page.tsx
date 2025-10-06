
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
    return { title: "HomeListerAi Blog" };
  }

  return {
    title: `${post.title} | HomeListerAi Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | HomeListerAi Blog`,
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
              <p className="text-indigo-200/80">HomeListerAi Team</p>
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

        <section className="mt-16 rounded-2xl bg-indigo-50 p-8">
          <h2 className="text-lg font-semibold text-indigo-900">Keep reading</h2>
          <p className="mt-2 text-sm text-indigo-700">
            More stories from the HomeListerAi blog to power your next launch.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <article key={related.slug} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-indigo-100">
                <time className="text-xs font-semibold uppercase tracking-wide text-indigo-500" dateTime={related.datetime}>
                  {formatDate(related.datetime)}
                </time>
                <h3 className="mt-3 text-base font-semibold text-gray-900">
                  <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{related.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
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
//       title: "HomeListerAi Blog",
//     };
//   }

//   return {
//     title: `${post.title} | HomeListerAi Blog`,
//     description: post.description,
//     openGraph: {
//       title: `${post.title} | HomeListerAi Blog`,
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
//               <p className="text-indigo-200/80">HomeListerAi Team</p>
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
//             More stories from the HomeListerAi blog to power your next launch.
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
