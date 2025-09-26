import RealEstateClient from "@/components/realEstate/RealEstateClient";
import { getUserPlan } from "@/lib/billing";
import React from "react";
import { auth } from "@/auth";

const RealEstateGeneratorPage = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const defaultPlan = { planType: "free", currentPeriodEnd: null, status: "free" } as const;
  const userPlan = userId ? await getUserPlan(userId) : defaultPlan;

  return (
    <>
      <RealEstateClient userPlan={userPlan} isAuthenticated={Boolean(userId)} />
    </>
  );
};

export default RealEstateGeneratorPage;

// import { auth } from "@/auth";
// import RealEstateForm from "@/components/toolForms/RealEstateForm";
// import { getUserPlan } from "@/lib/billing";
// import { useState } from "react";

// export default async function RealEstateGeneratorPage() {
//   const session = await auth();
//   const userId = session?.user?.id;

//   if (!userId) {
//     return (
//       <div className="text-center text-red-500">
//         Ești neautentificat. Te rugăm să te autentifici pentru a accesa această pagină.
//       </div>
//     );
//   }

//   const userPlan = await getUserPlan(userId);
//   console.log("User Plan status in RealEstateGeneratorPage:", userPlan.status);
//   return (
//     <>
//       {userPlan.status === "active" ? (
//         <div className="isolate bg-[#f3f4f6] px-6 lg:px-8 min-h-screen">
//           {/* <form action="">
//           <div className="mx-auto max-w-2xl text-center">salut</div>
//         </form> */}
//           <RealEstateForm userPlan={userPlan} />

//         </div>
//       ) : (
//         <div>Nu e activ
//           <div className="isolate bg-[#f3f4f6] px-6 lg:px-8 min-h-screen">
//           {/* <form action="">
//           <div className="mx-auto max-w-2xl text-center">salut</div>
//         </form> */}
//           <RealEstateForm userPlan={userPlan} />
//         </div>
//         </div>
//       )}
//       <div className="">Real Estate Generator Page</div>
//     </>
//   );
// }

// // 'use client'
// // import React, { useMemo, useState } from "react";

// // const PROPERTY_TYPES = ["Apartament", "Casă", "Studio", "Vilă"] as const;
// // const PURPOSES = ["Vânzare", "Închiriere"] as const;
// // const ROOMS = ["1 cameră", "2 camere", "3 camere", "4 camere", "5+ camere"] as const;
// // const FEATURES = [
// //   "Balcon",
// //   "Parcare",
// //   "Mobilat",
// //   "Renovat",
// //   "Lift",
// //   "Centrală proprie",
// //   "Aer condiționat",
// // ] as const;

// // type PropertyType = typeof PROPERTY_TYPES[number];
// // type Purpose = typeof PURPOSES[number];
// // type Rooms = typeof ROOMS[number];

// // type FormState = {
// //   propertyType: PropertyType | null;
// //   rooms: Rooms | null;
// //   area: string;
// //   city: string;
// //   district: string;
// //   features: string[];
// //   purpose: Purpose | null;
// // };

// // function classNames(...cls: Array<string | boolean | undefined>) {
// //   return cls.filter(Boolean).join(" ");
// // }

// // export default function RealEstateListingForm() {
// //   const [data, setData] = useState<FormState>({
// //     propertyType: null,
// //     rooms: null,
// //     area: "",
// //     city: "",
// //     district: "",
// //     features: [],
// //     purpose: null,
// //   });

// //   const toggleFeature = (f: string) => {
// //     setData((prev) =>
// //       prev.features.includes(f)
// //         ? { ...prev, features: prev.features.filter((x) => x !== f) }
// //         : { ...prev, features: [...prev.features, f] }
// //     );
// //   };

// //   const description = useMemo(() => buildDescription(data), [data]);

// //   return (
// //     <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-neutral-900 py-10">
// //       <div className="mx-auto max-w-6xl px-4">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
// //             <span>🏠</span> Generator listare imobiliară
// //           </div>
// //           <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900">
// //             Form elegant – Real Estate Listing
// //           </h1>
// //           <p className="mt-2 text-neutral-600">
// //             Completează câmpurile de mai jos. În dreapta vei vedea un preview al descrierii.
// //           </p>
// //         </div>

// //         {/* Grid */}
// //         <div className="grid gap-6 md:grid-cols-5">
// //           {/* Form */}
// //           <section className="md:col-span-3">
// //             <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur">
// //               <div className="space-y-8">
// //                 {/* Tip proprietate */}
// //                 <div>
// //                   <label className="mb-2 block text-sm font-semibold text-neutral-800">Tip proprietate</label>
// //                   <div className="flex flex-wrap gap-2">
// //                     {PROPERTY_TYPES.map((t) => (
// //                       <button
// //                         key={t}
// //                         type="button"
// //                         onClick={() => setData((p) => ({ ...p, propertyType: t }))}
// //                         className={classNames(
// //                           "rounded-2xl border px-4 py-2 text-sm font-medium transition",
// //                           data.propertyType === t
// //                             ? "border-indigo-500 bg-indigo-600 text-white shadow"
// //                             : "border-neutral-200 bg-white hover:border-neutral-300"
// //                         )}
// //                         aria-pressed={data.propertyType === t}
// //                       >
// //                         {t}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Număr camere */}
// //                 <div>
// //                   <label className="mb-2 block text-sm font-semibold text-neutral-800">Număr camere</label>
// //                   <div className="flex flex-wrap gap-2">
// //                     {ROOMS.map((r) => (
// //                       <button
// //                         key={r}
// //                         type="button"
// //                         onClick={() => setData((p) => ({ ...p, rooms: r }))}
// //                         className={classNames(
// //                           "rounded-2xl border px-4 py-2 text-sm font-medium transition",
// //                           data.rooms === r
// //                             ? "border-indigo-500 bg-indigo-600 text-white shadow"
// //                             : "border-neutral-200 bg-white hover:border-neutral-300"
// //                         )}
// //                         aria-pressed={data.rooms === r}
// //                       >
// //                         {r}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Suprafață utilă */}
// //                 <div>
// //                   <label htmlFor="area" className="mb-2 block text-sm font-semibold text-neutral-800">
// //                     Suprafață utilă (mp)
// //                   </label>
// //                   <div className="relative">
// //                     <input
// //                       id="area"
// //                       inputMode="numeric"
// //                       pattern="[0-9]*"
// //                       placeholder="ex: 65"
// //                       value={data.area}
// //                       onChange={(e) => setData((p) => ({ ...p, area: e.target.value }))}
// //                       className="block w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
// //                     />
// //                     <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-sm text-neutral-500">
// //                       mp
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {/* Locație */}
// //                 <div className="grid gap-4 sm:grid-cols-2">
// //                   <div>
// //                     <label htmlFor="city" className="mb-2 block text-sm font-semibold text-neutral-800">
// //                       Oraș
// //                     </label>
// //                     <input
// //                       id="city"
// //                       placeholder="ex: Chișinău"
// //                       value={data.city}
// //                       onChange={(e) => setData((p) => ({ ...p, city: e.target.value }))}
// //                       className="block w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label htmlFor="district" className="mb-2 block text-sm font-semibold text-neutral-800">
// //                       Cartier
// //                     </label>
// //                     <input
// //                       id="district"
// //                       placeholder="ex: Botanica"
// //                       value={data.district}
// //                       onChange={(e) => setData((p) => ({ ...p, district: e.target.value }))}
// //                       className="block w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Caracteristici cheie */}
// //                 <div>
// //                   <label className="mb-2 block text-sm font-semibold text-neutral-800">Caracteristici cheie</label>
// //                   <div className="flex flex-wrap gap-2">
// //                     {FEATURES.map((f) => {
// //                       const active = data.features.includes(f);
// //                       return (
// //                         <button
// //                           key={f}
// //                           type="button"
// //                           onClick={() => toggleFeature(f)}
// //                           className={classNames(
// //                             "rounded-full border px-4 py-2 text-sm font-medium transition",
// //                             active
// //                               ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
// //                               : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
// //                           )}
// //                           aria-pressed={active}
// //                         >
// //                           {f}
// //                         </button>
// //                       );
// //                     })}
// //                   </div>
// //                 </div>

// //                 {/* Scop */}
// //                 <div>
// //                   <label className="mb-2 block text-sm font-semibold text-neutral-800">Scop</label>
// //                   <div className="flex gap-2">
// //                     {PURPOSES.map((p) => (
// //                       <button
// //                         key={p}
// //                         type="button"
// //                         onClick={() => setData((s) => ({ ...s, purpose: p }))}
// //                         className={classNames(
// //                           "rounded-2xl border px-4 py-2 text-sm font-medium transition",
// //                           data.purpose === p
// //                             ? "border-indigo-500 bg-indigo-600 text-white shadow"
// //                             : "border-neutral-200 bg-white hover:border-neutral-300"
// //                         )}
// //                         aria-pressed={data.purpose === p}
// //                       >
// //                         {p}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Actions */}
// //                 <div className="flex items-center justify-between gap-3 pt-2">
// //                   <p className="text-sm text-neutral-500">Toate câmpurile sunt opționale – poți genera și apoi ajusta.</p>
// //                   <div className="flex gap-2">
// //                     <button
// //                       type="button"
// //                       onClick={() =>
// //                         setData({ propertyType: null, rooms: null, area: "", city: "", district: "", features: [], purpose: null })
// //                       }
// //                       className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:border-neutral-300"
// //                     >
// //                       Reset
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={() => {
// //                         // No-op – preview se actualizează live
// //                       }}
// //                       className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
// //                     >
// //                       Generează descriere
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </section>

// //           {/* Preview */}
// //           <aside className="md:col-span-2">
// //             <div className="sticky top-6 rounded-2xl border border-indigo-200/60 bg-white/80 p-6 shadow-sm ring-1 ring-indigo-100/50">
// //               <h2 className="mb-3 text-lg font-bold text-indigo-900">Preview descriere</h2>
// //               <div className="prose prose-sm max-w-none text-neutral-800">
// //                 {description ? (
// //                   <>
// //                     <p className="text-sm text-neutral-600">
// //                       <span className="font-medium">Titlu sugerat:</span> {buildTitle(data)}
// //                     </p>
// //                     <hr className="my-3 border-neutral-200" />
// //                     <p>{description}</p>
// //                   </>
// //                 ) : (
// //                   <p className="text-neutral-500">Completează câteva câmpuri pentru a vedea o descriere generată.</p>
// //                 )}
// //               </div>
// //             </div>
// //           </aside>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function buildTitle(d: FormState) {
// //   const bits: string[] = [];
// //   if (d.propertyType) bits.push(d.propertyType);
// //   if (d.rooms) bits.push(d.rooms);
// //   if (d.area) bits.push(`${d.area} mp`);
// //   const loc = [d.city, d.district].filter(Boolean).join(", ");
// //   if (loc) bits.push(loc);
// //   return bits.join(" • ") || "Proprietate deosebită";
// // }

// // function buildDescription(d: FormState) {
// //   const parts: string[] = [];

// //   if (!d.propertyType && !d.rooms && !d.area && !d.city && !d.district && d.features.length === 0 && !d.purpose) {
// //     return "";
// //   }

// //   const loc = [d.city, d.district].filter(Boolean).join(", ");
// //   const prop = [d.propertyType, d.rooms, d.area ? `${d.area} mp` : null]
// //     .filter(Boolean)
// //     .join(", ");

// //   if (prop) parts.push(`Descoperă un ${prop.toLowerCase()}${loc ? ` situat în ${loc}` : ""}.`);

// //   if (d.features.length) {
// //     const feat = d.features.join(", ");
// //     parts.push(`Beneficiază de ${feat.toLowerCase()}.`);
// //   }

// //   if (d.purpose) {
// //     parts.push(
// //       `${d.purpose === "Vânzare" ? "Ideal pentru achiziție" : "Potrivit pentru închiriere"}${
// //         d.propertyType ? ` – ${d.propertyType.toLowerCase()}` : ""
// //       } cu acces facil la puncte de interes și transport.`
// //     );
// //   }

// //   parts.push("Contactează-ne pentru detalii și programarea unei vizionări!");

// //   return parts.join(" ");
// // }
