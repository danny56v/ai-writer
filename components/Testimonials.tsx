import Image from "next/image";

const featuredTestimonial = {
  body:
    "Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.",
  author: {
    name: "Brenna Goyette",
    handle: "brennagoyette",
    imageUrl:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80",
    logoUrl: "https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg",
  },
};
const testimonials = [
  [
    [
      {
        body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
        author: {
          name: "Leslie Alexander",
          handle: "lesliealexander",
          imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
    [
      {
        body: "Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.",
        author: {
          name: "Lindsay Walton",
          handle: "lindsaywalton",
          imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
  ],
  [
    [
      {
        body: "Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis recusandae saepe corrupti.",
        author: {
          name: "Tom Cook",
          handle: "tomcook",
          imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
    [
      {
        body: "Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.",
        author: {
          name: "Leonard Krasner",
          handle: "leonardkrasner",
          imageUrl:
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
    ],
  ],
];

export default function Testimonials() {
  return (
    <section className="relative mt-24 overflow-hidden rounded-[3.25rem] border border-[#1d0b5c]/50 bg-gradient-to-br from-[#1b084f] via-[#220b66] to-[#17044f] px-6 py-20 text-white shadow-soft-xl sm:px-10 lg:px-16">
      <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-[#8b5cf6]/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#f472b6]/35 blur-3xl" aria-hidden="true" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.1]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">Voices</h2>
          <p className="mt-4 text-pretty text-3xl font-semibold text-white sm:text-4xl">
            Designers and strategists building with Aurora
          </p>
          <p className="mt-4 text-base leading-7 text-white/60">
            From boutique studios to global brands, our community crafts unforgettable experiences with Aurora at the heart of
            their storytelling workflow.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 text-sm text-white/80 sm:grid-cols-2 xl:max-w-none xl:grid-cols-4">
          <figure className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur">
            <blockquote className="text-lg leading-8 text-white">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4">
              <Image
                alt=""
                src={featuredTestimonial.author.imageUrl}
                className="h-12 w-12 flex-none rounded-full border border-white/20 object-cover"
                width={96}
                height={96}
              />
              <div>
                <div className="text-sm font-semibold text-white">{featuredTestimonial.author.name}</div>
                <div className="text-xs text-white/60">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
              <Image
                alt=""
                src={featuredTestimonial.author.logoUrl}
                className="ml-auto h-10 w-auto opacity-80"
                width={120}
                height={60}
              />
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-6">
              {columnGroup.map((column, columnIdx) => (
                <div key={columnIdx} className="space-y-6">
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur"
                    >
                      <blockquote className="text-white/90">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-4 flex items-center gap-3">
                        <Image
                          alt=""
                          src={testimonial.author.imageUrl}
                          className="h-10 w-10 rounded-full border border-white/10 object-cover"
                          width={80}
                          height={80}
                        />
                        <div>
                          <div className="text-sm font-semibold text-white">{testimonial.author.name}</div>
                          <div className="text-xs text-white/60">{`@${testimonial.author.handle}`}</div>
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
    </section>
  );
}
