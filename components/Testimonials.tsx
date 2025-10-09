import Image from "next/image";

const featuredTestimonial = {
  body: "ListologyAi is the first platform that treats our listing pipeline like a real content workflow. Drafts land in minutes, our tone stays on-brand, and compliance checks happen before an agent ever hits publish.",
  author: {
    name: "Maya Thompson",
    handle: "maya.thompson",
    imageUrl:
      "https://images.unsplash.com/photo-1544723795-43253756d6f5?auto=format&fit=facearea&facepad=2.5&w=1024&h=1024&q=80",
    logoUrl: "https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg",
  },
};

const testimonials = [
  [
    [
      {
        body: "Our boutique team went from juggling Word docs to shipping polished MLS copy in under ten minutes. ListologyAi keeps every voice guide, prompt, and revision thread in one place—it's basically our fifth teammate.",
        author: {
          name: "Elena Rossi",
          handle: "elena.rossi",
          imageUrl:
            "https://images.unsplash.com/photo-1536520002442-39764a41e067?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      {
        body: "What sold me was the transparency. Finance can see usage, marketing can lock brand presets, and agents still have the freedom to tweak tone. ListologyAi finally got sales, ops, and creative on the same page.",
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
        body: "We tested five AI tools and kept coming back to ListologyAi. The structured briefs mean my copywriters start with the right context, and approval flows give leadership confidence every draft is compliant.",
        author: {
          name: "Sofia Martinez",
          handle: "sofia.martinez",
          imageUrl:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
        },
      },
      {
        body: "Listing volume doubled after launch because our agents stopped rewriting paragraphs from scratch. Templates, comments, and analytics live together so we can prove the ROI every month.",
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
        body: "Our franchise network writes in four languages. ListologyAi keeps translations, regional nuances, and compliance guardrails organised so every office publishes faster without losing personality.",
        author: {
          name: "Aiko Tanaka",
          handle: "aikotanaka",
          imageUrl:
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      {
        body: "The billing portal plus usage dashboards have been a gift for our operations team. We can experiment with new campaigns, see results, and scale credits without surprise invoices.",
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
        body: "We produce weekly investor memos and property spotlights. ListologyAi auto-suggests outlines, pulls in saved talking points, and leaves space for our voice. It feels like a seasoned copy editor on call.",
        author: {
          name: "Malik Thompson",
          handle: "malik.thompson",
          imageUrl:
            "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      {
        body: "Compliance reviews used to bottleneck launches. Now legal drops comments directly in the draft, approves changes, and everyone sees the history. ListologyAi turned approvals into a shared workflow instead of an email chain.",
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Testimonials() {
  return (
    <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Teams trust ListologyAi to keep every launch on message
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
              <Image
                alt=""
                src={featuredTestimonial.author.imageUrl}
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                width={100}
                height={100}
              />
              <div className="flex-auto">
                <div className="font-semibold">{featuredTestimonial.author.name}</div>
                <div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
              <Image
                alt=""
                src={featuredTestimonial.author.logoUrl}
                className="h-10 w-auto flex-none"
                width={100}
                height={100}
              />
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={classNames(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 && columnIdx === columnGroup.length - 1)
                      ? "xl:row-span-2"
                      : "xl:row-start-1",
                    "space-y-8"
                  )}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          alt=""
                          src={testimonial.author.imageUrl}
                          className="h-10 w-10 rounded-full bg-gray-50"
                          width={100}
                          height={100}
                        />
                        <div>
                          <div className="font-semibold">{testimonial.author.name}</div>
                          <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
