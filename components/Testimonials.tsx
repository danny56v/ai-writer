import Image from "next/image";

const featuredTestimonial = {
  body: "ListologyAi is the first tool that lets me go from just an address to a finished listing in minutes. I drop the location, it pulls Street View context, and I get clean, on-brand copy I can publish right away.",
  author: {
    name: "Maya Thompson",
    handle: "maya.thompson",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
};

const testimonials = [
  [
    [
      {
        body: "Since using ListologyAi, my listings stand out instantly — I’m closing deals faster and getting more buyer inquiries than ever before.",
        author: {
          name: "Elena Rossi",
          handle: "elena.rossi",
          imageUrl:
            "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      {
        body: "I used to spend hours writing descriptions. Now I paste the address into ListologyAi and get a polished listing in minutes.",
        author: {
          name: "Jordan Wells",
          handle: "jordanwells",
          imageUrl:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
    [
      {
        body: "ListologyAi helped me increase engagement across all my listings. Better copy means more clicks, more calls, and more serious buyers.",
        author: {
          name: "Sofia Martinez",
          handle: "sofia.martinez",
          imageUrl:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
        },
      },
      {
        body: "After switching to ListologyAi, I doubled my monthly property sales. The AI copy feels personal, clear, and convincing every single time.",
        author: {
          name: "Connor Blake",
          handle: "connorblake",
          imageUrl:
            "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
  ],
  [
    [
      {
        body: "I work in a competitive market and need to move fast. ListologyAi turns a simple address into a strong listing that’s ready to publish.",
        author: {
          name: "Aiko Tanaka",
          handle: "aikotanaka",
          imageUrl:
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      {
        body: "Thanks to ListologyAi, my marketing time dropped while conversions increased. Each listing now attracts serious buyers within days.",
        author: {
          name: "Priya Chandrasekar",
          handle: "priyac",
          imageUrl:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
    [
      {
        body: "ListologyAi saves me hours each week and helps me sell properties faster. The suggestions sound natural and match my voice.",
        author: {
          name: "Malik Thompson",
          handle: "malik.thompson",
          imageUrl:
            "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      {
        body: "Before ListologyAi, I rewrote every listing from scratch. Now I publish twice as fast — and my properties move off the market quicker than ever.",
        author: {
          name: "Gabrielle Monroe",
          handle: "gabriellemonroe",
          imageUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
  ],
];

const proofMetrics = [
  { value: "2K+", label: "Listings generated with AI" },
  { value: "98%", label: "Agents who would recommend" },
  { value: "~5 hrs", label: "Average time saved per week" },
  { value: "<24h", label: "Typical support reply time" },
];

const testimonialCards = testimonials.flat(2);

export default function Testimonials() {
  const spotlightCards = testimonialCards.slice(0, 4);

  return (
    <section className="rounded-2xl border border-neutral-100 bg-gradient-to-br from-white via-white to-indigo-50/30 px-6 py-12 shadow-[0_35px_120px_rgba(15,23,42,0.08)]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-blue-700 p-[1px]">
            <span className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-neutral-600">
              Testimonials
            </span>
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight   sm:text-4xl">
            Agents trust ListologyAi to write better listings
          </h2>
          <p className="mt-2 text-base leading-7 text-neutral-600">
            Real estate agents rely on ListologyAi to turn simple addresses into polished descriptions that help
            properties stand out and sell faster.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-white/70 bg-white/90 p-8 shadow-inner">
            <blockquote className="text-xl font-semibold leading-8  ">“{featuredTestimonial.body}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <Image
                alt={featuredTestimonial.author.name}
                src={featuredTestimonial.author.imageUrl}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="text-base font-semibold  ">{featuredTestimonial.author.name}</div>
                <div className="text-sm uppercase tracking-wide text-neutral-500">
                  @{featuredTestimonial.author.handle}
                </div>
              </div>
            </figcaption>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {proofMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{metric.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold  ">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {spotlightCards.map((testimonial) => (
              <figure
                key={testimonial.author.handle}
                className="rounded-2xl border border-neutral-100 bg-white/90 p-6 text-left shadow-sm ring-1 ring-neutral-100/60"
              >
                <p className="text-sm  ">“{testimonial.body}”</p>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Image
                    alt={testimonial.author.name}
                    src={testimonial.author.imageUrl}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold  ">{testimonial.author.name}</div>
                    <div className="text-xs uppercase tracking-wide text-neutral-500">@{testimonial.author.handle}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
