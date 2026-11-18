import React, { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Star,
  X,
} from "lucide-react";

export interface ShowcaseItem {
  id: string;
  title: string;
  wing: string;
  island: string;
  category: "Villas" | "Beaches" | "Interiors" | "Pools";
  image: string;
  caption: string;
  highlight: string;
  featured?: boolean;
}

export interface GuestReview {
  id: string;
  guestName: string;
  initials: string;
  origin: string;
  island: string;
  suiteName: string;
  stayDate: string;
  rating: number;
  title: string;
  comment: string;
}

const SHOWCASE_GALLERY: ShowcaseItem[] = [
  {
    id: "lagoon-sanctuary",
    title: "Overwater Lagoon Sanctuary",
    wing: "Koh Samui Wing",
    island: "Koh Samui",
    category: "Villas",
    image: "/src/assets/images/hero_lagoon_aerial_1794994734249.jpg",
    caption:
      "Suspended teak walkways above luminous coral shallows with private sunrise decks and pier access.",
    highlight: "3 Overwater Suites · Private Lagoon Pier",
    featured: true,
  },
  {
    id: "sunset-teak-terrace",
    title: "Oceanfront Teak Terraces",
    wing: "Railay Wing, Krabi",
    island: "Krabi",
    category: "Pools",
    image: "/src/assets/images/hero_teak_terrace_1794994735581.jpg",
    caption:
      "Hand-crafted teak verandas overlooking Andaman limestone cliffs with plunge pools steps from the sand.",
    highlight: "Direct Beachfront · Sunset Verandas",
  },
  {
    id: "living-lounge-interior",
    title: "Sunlit Coastal Living Lounge",
    wing: "Kamala Headland, Phuket",
    island: "Phuket",
    category: "Interiors",
    image: "/src/assets/images/interior_living_lounge_1794995276333.jpg",
    caption:
      "Travertine stone floors, vaulted rattan ceilings, and floor-to-ceiling sliding glass opening to sea breezes.",
    highlight: "185–265 m² Open-Plan Interiors",
  },
  {
    id: "master-canopy-suite",
    title: "Canopy Master Bedroom",
    wing: "Lamai Wing, Koh Samui",
    island: "Koh Samui",
    category: "Interiors",
    image: "/src/assets/images/interior_master_suite_1794995276614.jpg",
    caption:
      "Breezy sand-washed linen canopies facing unobstructed emerald sea horizons and private balconies.",
    highlight: "King Canopy · Bespoke Coastal Linens",
  },
  {
    id: "cliffside-infinity",
    title: "Andaman Infinity Horizon",
    wing: "Kamala Headland, Phuket",
    island: "Phuket",
    category: "Pools",
    image: "/src/assets/images/stay_infinity_cliff_1794994737857.jpg",
    caption:
      "Cantilevered 14-meter glass-edge infinity pools framed by tropical palms above tranquil coves.",
    highlight: "Heated Cliffside Lap Pools",
  },
  {
    id: "coral-sand-pavilion",
    title: "Powdery Coral Shoreline",
    wing: "Sairee Cove, Koh Tao",
    island: "Koh Tao",
    category: "Beaches",
    image: "/src/assets/images/stay_sand_pavilion_1794994736849.jpg",
    caption:
      "Barefoot sanctuaries nestled along private white-sand coves with guided reef snorkeling steps away.",
    highlight: "Private Cove Access · Reef Kayaking",
  },
  {
    id: "emerald-pier-cove",
    title: "Phi Phi Reserve Jetty",
    wing: "Phi Phi Reserve",
    island: "Phi Phi",
    category: "Beaches",
    image: "/src/assets/images/hero_turquoise_cove_1794994735577.jpg",
    caption:
      "Translucent jade lagoons reached via cedar boardwalks and our private resort longtail fleet.",
    highlight: "Complimentary Longtail Transfers",
  },
  {
    id: "sandstone-courtyard",
    title: "Sandstone Colonnade & Spa",
    wing: "Phang Nga Wing, Phuket",
    island: "Phuket",
    category: "Villas",
    image: "/src/assets/images/stay_dune_resort_1794994739658.jpg",
    caption:
      "Warm coral-limestone arches surrounding quiet seafoam lap pools and open-air evening wellness pavilions.",
    highlight: "Evening Spa · Private Chef Dining",
  },
];

const GUEST_REVIEWS: GuestReview[] = [
  {
    id: "rev-1",
    guestName: "Elena & Marcus Vance",
    initials: "EV",
    origin: "Zurich, Switzerland",
    island: "Koh Samui",
    suiteName: "Turquoise Lagoon Villa",
    stayDate: "October 2026",
    rating: 5,
    title: "Waking up directly above the turquoise lagoon felt unreal",
    comment:
      "Every detail from our speedboat arrival to breakfast on the overwater deck was effortless. We swam straight off the reef ladder every morning before sunrise and spent evenings watching the tide glow.",
  },
  {
    id: "rev-2",
    guestName: "Kenji Takahashi",
    initials: "KT",
    origin: "Tokyo, Japan",
    island: "Phuket",
    suiteName: "Coral Horizon Cliff Villa",
    stayDate: "September 2026",
    rating: 5,
    title: "Architectural calm with extraordinary cliffside views",
    comment:
      "We stayed for five nights with our family and loved the 240 m² layout. The cantilevered infinity pool overlooks the Andaman Sea without another building in sight, and the dedicated butler handled every excursion.",
  },
  {
    id: "rev-3",
    guestName: "Sophia Laurent",
    initials: "SL",
    origin: "Lyon, France",
    island: "Krabi",
    suiteName: "Baan Sai Sand Pavilion",
    stayDate: "October 2026",
    rating: 5,
    title: "Warm travertine, ocean breeze, and genuine hospitality",
    comment:
      "Walking from the shaded teak terrace straight onto cool white sand was pure magic. The outdoor rain shower beneath the palms and the candlelit dinner by the surf made this our favorite stay in Thailand.",
  },
  {
    id: "rev-4",
    guestName: "Daniel & Priya Nair",
    initials: "DN",
    origin: "Singapore",
    island: "Phi Phi",
    suiteName: "Emerald Pier Bungalow",
    stayDate: "August 2026",
    rating: 5,
    title: "Pure island serenity on our private cedar pier",
    comment:
      "Taking the glass-bottom kayaks out into the calm Phi Phi lagoon at 7 a.m. was unforgettable. The bungalow stays cool naturally and feels miles away from everything.",
  },
  {
    id: "rev-5",
    guestName: "Hannah Lindqvist",
    initials: "HL",
    origin: "Stockholm, Sweden",
    island: "Koh Tao",
    suiteName: "Seafoam Linen Cabana",
    stayDate: "September 2026",
    rating: 5,
    title: "Snorkeling vibrant coral gardens two minutes from bed",
    comment:
      "Intimate, sunlit, and thoughtfully designed. Having fresh tropical fruit delivered beside the seafoam plunge pool after a morning swim made every day slow down in the best way.",
  },
  {
    id: "rev-6",
    guestName: "Oliver & Claire Bennett",
    initials: "OB",
    origin: "Melbourne, Australia",
    island: "Koh Samui",
    suiteName: "Sandstone Arch Resort",
    stayDate: "October 2026",
    rating: 5,
    title: "Refined resort architecture that still feels deeply personal",
    comment:
      "The sandstone colonnades look breathtaking in morning light. Checking availability for an extra two nights at the desk was seamless, and the evening wellness pavilion is not to be missed.",
  },
];

interface ShowcaseProps {
  isMobile: boolean;
  onSelectWingAndFocusSearch: (island: string) => void;
}

export const ResortShowcaseSection: React.FC<ShowcaseProps> = ({
  isMobile,
  onSelectWingAndFocusSearch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Villas" | "Beaches" | "Pools" | "Interiors"
  >("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    if (selectedCategory === "All") return SHOWCASE_GALLERY;
    return SHOWCASE_GALLERY.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const activeLightboxItem =
    lightboxIdx !== null ? visibleItems[lightboxIdx] ?? null : null;

  return (
    <section
      id="our-resorts"
      className="relative z-[15] pb-16"
      style={{
        marginTop: isMobile ? "-8vh" : "-17vh",
        paddingLeft: "clamp(20px, 9.5vw, 170px)",
        paddingRight: "clamp(20px, 9.5vw, 170px)",
      }}
    >
      {/* Header Row */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#158b76]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Anivon Resorts Collection</span>
          </div>
          <h2
            className="font-display text-[#112426] tracking-[-0.01em]"
            style={{ fontSize: "clamp(28px, 2.7vw, 40px)" }}
          >
            Picture Our Resorts
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#425a5d]">
            Explore five tropical island wings across Thailand — from overwater
            lagoon sanctuaries to cliffside infinity retreats. Enter your dates
            above to check live suite availability.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Villas", "Pools", "Beaches", "Interiors"] as const).map(
            (cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLightboxIdx(null);
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#112426] text-[#fdfaf6] shadow-[0_6px_18px_rgba(17,36,38,0.18)]"
                      : "border border-[#112426]/15 bg-[#fdfaf6]/80 text-[#112426] hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                  }`}
                >
                  {cat}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Editorial Photo Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((item, idx) => {
          const isLead = selectedCategory === "All" && idx === 0;
          return (
            <article
              key={item.id}
              data-clickable="true"
              onClick={() => setLightboxIdx(idx)}
              className={`group relative cursor-pointer overflow-hidden rounded-[16px] bg-[#e0f7f4] transition-all duration-500 hover:-translate-y-1.5 ${
                isLead
                  ? "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[430px]"
                  : "aspect-[4/3]"
              }`}
              style={{
                boxShadow: "0 14px 36px rgba(17, 54, 52, 0.14)",
              }}
            >
              <img
                src={item.image}
                alt={`${item.title} at ${item.wing}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
              />

              {/* Gradient scrim */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(17,36,38,0.08) 0%, transparent 38%, rgba(10,26,28,0.88) 100%)",
                }}
              />

              {/* Top Left Wing Label */}
              <div
                className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[#112426]"
                style={{
                  backgroundColor: "rgba(224, 247, 244, 0.9)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <MapPin className="h-3 w-3 text-[#158b76]" />
                <span>{item.wing}</span>
              </div>

              {/* Top Right Expand Hint */}
              <div className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#fdfaf6]/85 text-[#112426] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#40c4aa]">
                  {item.highlight}
                </div>
                <h3
                  className={`mt-0.5 font-display leading-tight ${
                    isLead ? "text-2xl sm:text-3xl" : "text-lg"
                  }`}
                >
                  {item.title}
                </h3>
                {isLead && (
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-white/85">
                    {item.caption}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          className="fixed inset-0 z-[650] flex items-center justify-center bg-[#0c2224]/80 p-4 backdrop-blur-md"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-[#40c4aa]/30 bg-[#fdfaf6] text-[#112426] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-[#112426]">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Close showcase photo"
                onClick={() => setLightboxIdx(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fdfaf6]/92 text-[#112426] shadow-md transition-transform hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>

              {visibleItems.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous resort photo"
                    onClick={() =>
                      setLightboxIdx(
                        (lightboxIdx - 1 + visibleItems.length) %
                          visibleItems.length
                      )
                    }
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdfaf6]/90 text-[#112426] shadow-md transition-transform hover:scale-105"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next resort photo"
                    onClick={() =>
                      setLightboxIdx((lightboxIdx + 1) % visibleItems.length)
                    }
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#fdfaf6]/90 text-[#112426] shadow-md transition-transform hover:scale-105"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#158b76]">
                  {activeLightboxItem.wing} · {activeLightboxItem.highlight}
                </div>
                <h3 className="mt-1 font-display text-2xl text-[#112426]">
                  {activeLightboxItem.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm text-[#425a5d]">
                  {activeLightboxItem.caption}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const island = activeLightboxItem.island;
                  setLightboxIdx(null);
                  onSelectWingAndFocusSearch(island);
                }}
                className="shrink-0 rounded-full bg-[#40c4aa] px-5 py-3 text-xs font-semibold text-[#0d2426] shadow-[0_8px_20px_rgba(64,196,170,0.35)] transition-colors hover:bg-[#32b399]"
              >
                Check Dates for {activeLightboxItem.island}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

interface ReviewsProps {
  onFocusDateSearch: () => void;
}

export const GuestReviewsSection: React.FC<ReviewsProps> = ({
  onFocusDateSearch,
}) => {
  const [wingFilter, setWingFilter] = useState<string>("All");

  const filteredReviews = useMemo(() => {
    if (wingFilter === "All") return GUEST_REVIEWS;
    return GUEST_REVIEWS.filter((r) => r.island === wingFilter);
  }, [wingFilter]);

  return (
    <section
      id="guest-reviews"
      className="relative z-[15] pb-24 pt-6"
      style={{
        paddingLeft: "clamp(20px, 9.5vw, 170px)",
        paddingRight: "clamp(20px, 9.5vw, 170px)",
      }}
    >
      {/* Summary Header Card */}
      <div className="mb-10 flex flex-col justify-between gap-6 rounded-3xl border border-[#40c4aa]/25 bg-[#fdfaf6]/90 p-7 shadow-[0_14px_42px_rgba(17,54,52,0.08)] backdrop-blur-md lg:flex-row lg:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#158b76]">
            Verified Resort Stays
          </div>
          <h2
            className="mt-1 font-display text-[#112426]"
            style={{ fontSize: "clamp(26px, 2.5vw, 38px)" }}
          >
            Guest Reviews &amp; Reflections
          </h2>
          <p className="mt-1 text-sm text-[#425a5d]">
            Stories from guests who reserved private villas and lagoon suites
            across Anivon Resorts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3.5 rounded-2xl bg-[#e0f7f4]/75 px-5 py-3">
            <div className="text-3xl font-bold tabular-nums text-[#112426]">
              4.9
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#f2b84b] text-[#f2b84b]"
                  />
                ))}
              </div>
              <div className="mt-0.5 text-xs font-medium text-[#425a5d]">
                911 verified stays
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 text-xs">
            <div>
              <div className="font-bold tabular-nums text-base text-[#112426]">
                4.98
              </div>
              <div className="text-[#425a5d]">Location</div>
            </div>
            <div>
              <div className="font-bold tabular-nums text-base text-[#112426]">
                4.96
              </div>
              <div className="text-[#425a5d]">Cleanliness</div>
            </div>
            <div>
              <div className="font-bold tabular-nums text-base text-[#112426]">
                4.94
              </div>
              <div className="text-[#425a5d]">Hospitality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wing Filter Row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Koh Samui", "Krabi", "Phuket", "Koh Tao", "Phi Phi"].map(
            (island) => (
              <button
                key={island}
                type="button"
                onClick={() => setWingFilter(island)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  wingFilter === island
                    ? "bg-[#40c4aa] text-[#0d2426]"
                    : "border border-[#112426]/15 bg-[#fdfaf6]/80 text-[#425a5d] hover:border-[#40c4aa] hover:text-[#112426]"
                }`}
              >
                {island === "All" ? "All Wings" : island}
              </button>
            )
          )}
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredReviews.map((review) => (
          <article
            key={review.id}
            className="flex flex-col justify-between rounded-2xl border border-[#40c4aa]/20 bg-white/95 p-6 shadow-[0_10px_30px_rgba(17,54,52,0.07)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3.5 w-3.5 fill-[#f2b84b] text-[#f2b84b]"
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-[#158b76]">
                  {review.island}
                </span>
              </div>

              <h3 className="mt-3 font-display text-lg leading-snug text-[#112426]">
                “{review.title}”
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#425a5d]">
                {review.comment}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#112426]/8 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e0f7f4] text-xs font-bold text-[#158b76]">
                  {review.initials}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#112426]">
                    {review.guestName}
                  </div>
                  <div className="text-[11px] text-[#688083]">
                    {review.suiteName} · {review.stayDate}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA into Search */}
      <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#40c4aa]/30 bg-gradient-to-r from-[#e0f7f4] to-[#f4e4d3]/75 p-7 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-2xl text-[#112426]">
            Ready to check live room availability?
          </h3>
          <p className="mt-1 text-sm text-[#425a5d]">
            Enter your check-in and check-out dates in the search bar and click
            Search to view open suites and rates.
          </p>
        </div>
        <button
          type="button"
          onClick={onFocusDateSearch}
          className="shrink-0 rounded-full bg-[#112426] px-6 py-3.5 text-sm font-semibold text-[#fdfaf6] shadow-[0_10px_24px_rgba(17,36,38,0.2)] transition-colors hover:bg-[#40c4aa] hover:text-[#0d2426]"
        >
          Enter Dates &amp; Search Suites
        </button>
      </div>
    </section>
  );
};
