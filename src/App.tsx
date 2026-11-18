import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  BedDouble,
  Calendar,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Compass,
  Eye,
  Globe,
  Heart,
  MapPin,
  Maximize2,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Trash2,
  User,
  Users,
  Wifi,
  X,
} from "lucide-react";
import {
  IslandMapModal,
  IslandMapThumbnail,
} from "./components/IslandLocationMap";
import { VirtualTourModal } from "./components/VirtualTourModal";
import {
  GuestReviewsSection,
  ResortShowcaseSection,
} from "./components/ResortShowcaseAndReviews";

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

interface HeroSlide {
  id: number;
  image: string;
  thumbLabel: string;
  photoPos: string;
  titleLines: string[];
  titleSizeDesktop: string;
  titleLeft: string;
  titleTop: string;
  captionTitle: string;
  captionDesc: string;
}

interface DateWindow {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD (checkout exclusive)
}

interface ResortReservation {
  id: string;
  stayId: string;
  stayName: string;
  roomType: string;
  area: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  createdAt: string;
}

interface StayProperty {
  id: string;
  name: string;
  roomType: string;
  area: string;
  island: string;
  price: number;
  rating: string;
  reviews: number;
  maxGuests: number;
  sizeSqm: number;
  bedConfig: string;
  oceanView: string;
  unitsTotal: number;
  existingBookings: DateWindow[];
  highlights: [string, string, string];
  image: string;
  gallery: [string, string, string];
  hostName: string;
  description: string;
}

const CLOUD_IMAGE = "/src/assets/images/clouds_white_black_1794994735667.jpg";

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    image: "/src/assets/images/hero_lagoon_aerial_1794994734249.jpg",
    thumbLabel: "Anivon Lagoon Sanctuary",
    photoPos: "center 55%",
    titleLines: ["ANIVON RESORTS"],
    titleSizeDesktop: "8.2vw",
    titleLeft: "2.6vw",
    titleTop: "calc(74px + 3.2vh)",
    captionTitle: "Anivon Lagoon Suites",
    captionDesc:
      "Reserve private overwater villas, sunlit ocean pavilions, and island sanctuaries with live suite availability.",
  },
  {
    id: 1,
    image: "/src/assets/images/hero_teak_terrace_1794994735581.jpg",
    thumbLabel: "Oceanfront Teak Pavilion",
    photoPos: "center 55%",
    titleLines: ["FIND YOUR SUITE"],
    titleSizeDesktop: "8.2vw",
    titleLeft: "2.6vw",
    titleTop: "calc(74px + 3.2vh)",
    captionTitle: "Suites & Villas",
    captionDesc:
      "Hand-crafted teak residences, private plunge pools, and full-board coastal hospitality tailored to your dates.",
  },
  {
    id: 2,
    image: "/src/assets/images/hero_turquoise_cove_1794994735577.jpg",
    thumbLabel: "Private Island Coves",
    photoPos: "center 45%",
    titleLines: ["EXPLORE", "THE COAST"],
    titleSizeDesktop: "9.4vw",
    titleLeft: "7vw",
    titleTop: "calc(74px + 5vh)",
    captionTitle: "Island Experiences",
    captionDesc:
      "Private longtail charters, coral reef snorkeling, and sunset dining across Thailand's turquoise bays.",
  },
];

// Rail top-to-bottom order matches spec: Top = Slide 3 (idx 2), Middle = Slide 2 (idx 1), Bottom = Slide 1 (idx 0)
const RAIL_ORDER = [2, 1, 0];

const STAYS: StayProperty[] = [
  {
    id: "turquoise-lagoon-villa",
    name: "Turquoise Lagoon Villa",
    roomType: "Overwater Pool Suite",
    area: "Koh Samui Wing",
    island: "Koh Samui",
    price: 1300,
    rating: "4.9",
    reviews: 142,
    maxGuests: 4,
    sizeSqm: 185,
    bedConfig: "1 King Canopy · Daybed",
    oceanView: "Panoramic Lagoon",
    unitsTotal: 3,
    existingBookings: [
      { start: "2026-11-20", end: "2026-11-23" },
      { start: "2026-12-18", end: "2026-12-21" },
      { start: "2026-12-23", end: "2026-12-26" },
      { start: "2026-12-29", end: "2027-01-03" },
    ],
    highlights: [
      "Private infinity plunge pool",
      "Direct coral reef ladder",
      "Complimentary pier speedboat",
    ],
    image: "/src/assets/images/stay_overwater_villa_1794994736502.jpg",
    gallery: [
      "/src/assets/images/hero_teak_terrace_1794994735581.jpg",
      "/src/assets/images/stay_sand_pavilion_1794994736849.jpg",
      "/src/assets/images/stay_coral_cabana_1794994738679.jpg",
    ],
    hostName: "Ploy Sirikul",
    description:
      "Suspended directly above luminous seafoam shallows, this handcrafted teak overwater suite pairs a private infinity plunge pool with warm sand-toned sun decks, direct reef ladder access, and sunset longtail charters.",
  },
  {
    id: "baan-sai-pavilion",
    name: "Baan Sai Sand Pavilion",
    roomType: "Beachfront Villa",
    area: "Railay Wing, Krabi",
    island: "Krabi",
    price: 1200,
    rating: "4.8",
    reviews: 128,
    maxGuests: 4,
    sizeSqm: 165,
    bedConfig: "1 King Bed · Twin Alcove",
    oceanView: "Direct Coral Surf",
    unitsTotal: 2,
    existingBookings: [
      { start: "2026-11-21", end: "2026-11-25" },
      { start: "2026-11-22", end: "2026-11-26" },
      { start: "2026-12-20", end: "2026-12-28" },
      { start: "2026-12-22", end: "2026-12-27" },
    ],
    highlights: [
      "Steps onto powdery white sand",
      "Outdoor travertine rain shower",
      "Private sunset canopy dining",
    ],
    image: "/src/assets/images/stay_sand_pavilion_1794994736849.jpg",
    gallery: [
      "/src/assets/images/stay_palm_deck_1794994738338.jpg",
      "/src/assets/images/hero_teak_terrace_1794994735581.jpg",
      "/src/assets/images/stay_dune_resort_1794994739658.jpg",
    ],
    hostName: "Ploy Sirikul",
    description:
      "Carved from warm coastal travertine and aged teak amidst leaning coconut palms, Baan Sai opens directly onto powdery coral sand and gentle turquoise surf with private dining beneath sea-breeze canopies.",
  },
  {
    id: "coral-horizon-cliff",
    name: "Coral Horizon Cliff Villa",
    roomType: "Cliffside Infinity Suite",
    area: "Kamala Headland, Phuket",
    island: "Phuket",
    price: 940,
    rating: "4.9",
    reviews: 96,
    maxGuests: 6,
    sizeSqm: 240,
    bedConfig: "2 King Suites · Lounge",
    oceanView: "Andaman Horizon",
    unitsTotal: 2,
    existingBookings: [
      { start: "2026-12-15", end: "2026-12-19" },
      { start: "2026-12-28", end: "2027-01-02" },
    ],
    highlights: [
      "14m glass-edge infinity pool",
      "2 private ocean bedrooms",
      "Dedicated resort butler",
    ],
    image: "/src/assets/images/stay_infinity_cliff_1794994737857.jpg",
    gallery: [
      "/src/assets/images/stay_andaman_residence_1794994738824.jpg",
      "/src/assets/images/stay_overwater_villa_1794994736502.jpg",
      "/src/assets/images/hero_lagoon_aerial_1794994734249.jpg",
    ],
    hostName: "Ananda K.",
    description:
      "Perched above a tranquil emerald cove, this limestone-clad cliffside sanctuary features a cantilevered glass-edge lap pool, sunlit travertine lounges, and panoramic Andaman Sea views.",
  },
  {
    id: "seafoam-linen-cabana",
    name: "Seafoam Linen Cabana",
    roomType: "Garden Plunge Cabana",
    area: "Sairee Cove, Koh Tao",
    island: "Koh Tao",
    price: 420,
    rating: "4.8",
    reviews: 114,
    maxGuests: 2,
    sizeSqm: 92,
    bedConfig: "1 Queen Canopy Bed",
    oceanView: "Palm & Seafoam Pool",
    unitsTotal: 3,
    existingBookings: [
      { start: "2026-12-25", end: "2026-12-29" },
    ],
    highlights: [
      "Seafoam mosaic plunge pool",
      "Reef snorkeling gear included",
      "In-room floating breakfast",
    ],
    image: "/src/assets/images/stay_coral_cabana_1794994738679.jpg",
    gallery: [
      "/src/assets/images/stay_sand_pavilion_1794994736849.jpg",
      "/src/assets/images/stay_lagoon_bungalow_1794994738993.jpg",
      "/src/assets/images/stay_palm_deck_1794994738338.jpg",
    ],
    hostName: "Niran Chai",
    description:
      "Wrapped in breezy sand-washed linen drapes beside a shimmering seafoam-tiled plunge pool, this barefoot beachfront cabana puts vibrant coral reefs steps from your morning coffee terrace.",
  },
  {
    id: "palm-breeze-deck",
    name: "Palm Breeze Deck Suite",
    roomType: "Oceanfront Deck Suite",
    area: "Koh Lanta Wing, Krabi",
    island: "Krabi",
    price: 380,
    rating: "4.8",
    reviews: 89,
    maxGuests: 3,
    sizeSqm: 110,
    bedConfig: "1 King Bed · Sun Daybed",
    oceanView: "Crescent Bay Breeze",
    unitsTotal: 4,
    existingBookings: [
      { start: "2026-12-19", end: "2026-12-22" },
    ],
    highlights: [
      "Wrap-around teak sun deck",
      "Acoustic sound & vinyl bar",
      "Daily coastal yoga pass",
    ],
    image: "/src/assets/images/stay_palm_deck_1794994738338.jpg",
    gallery: [
      "/src/assets/images/hero_teak_terrace_1794994735581.jpg",
      "/src/assets/images/stay_coral_cabana_1794994738679.jpg",
      "/src/assets/images/stay_overwater_villa_1794994736502.jpg",
    ],
    hostName: "Maliwan T.",
    description:
      "Elevated on weathered timber pillars above a quiet crescent bay, this sun-drenched suite offers dappled palm shade, oversized sand-beige daybeds, and uninterrupted ocean breezes.",
  },
  {
    id: "emerald-pier-bungalow",
    name: "Emerald Pier Bungalow",
    roomType: "Lagoon Pier Bungalow",
    area: "Phi Phi Reserve",
    island: "Phi Phi",
    price: 560,
    rating: "4.9",
    reviews: 164,
    maxGuests: 2,
    sizeSqm: 118,
    bedConfig: "1 Emperor Teak Bed",
    oceanView: "Translucent Reef Lagoon",
    unitsTotal: 2,
    existingBookings: [
      { start: "2026-11-23", end: "2026-11-27" },
      { start: "2026-11-24", end: "2026-11-26" },
      { start: "2026-12-21", end: "2026-12-26" },
      { start: "2026-12-22", end: "2026-12-25" },
    ],
    highlights: [
      "Private cedar boardwalk pier",
      "Complimentary glass-bottom kayaks",
      "Sunset cocktail deck",
    ],
    image: "/src/assets/images/stay_lagoon_bungalow_1794994738993.jpg",
    gallery: [
      "/src/assets/images/hero_turquoise_cove_1794994735577.jpg",
      "/src/assets/images/stay_overwater_villa_1794994736502.jpg",
      "/src/assets/images/stay_palm_deck_1794994738338.jpg",
    ],
    hostName: "Ploy Sirikul",
    description:
      "Reached via a private cedar boardwalk over translucent reef gardens, Emerald Pier Bungalow blends traditional thatched craft with calm coastal luxury and dawn kayaking right from your deck.",
  },
  {
    id: "andaman-shore-residence",
    name: "Andaman Shore Residence",
    roomType: "Two-Story Bay Residence",
    area: "Phang Nga Wing, Phuket",
    island: "Phuket",
    price: 1150,
    rating: "4.9",
    reviews: 73,
    maxGuests: 6,
    sizeSqm: 265,
    bedConfig: "2 King Beds · 2 Twin Beds",
    oceanView: "Limestone Bay Panorama",
    unitsTotal: 1,
    existingBookings: [
      { start: "2026-12-17", end: "2026-12-21" },
      { start: "2026-12-30", end: "2027-01-04" },
    ],
    highlights: [
      "Open-air 8-seat dining loggia",
      "Private chef kitchen & pantry",
      "Terraced cliff plunge pool",
    ],
    image: "/src/assets/images/stay_andaman_residence_1794994738824.jpg",
    gallery: [
      "/src/assets/images/stay_infinity_cliff_1794994737857.jpg",
      "/src/assets/images/hero_teak_terrace_1794994735581.jpg",
      "/src/assets/images/stay_dune_resort_1794994739658.jpg",
    ],
    hostName: "Somsak V.",
    description:
      "Multi-level coastal architecture in warm sand plaster and natural teak, boasting an open-air dining loggia, private chef kitchen, and terraced infinity pool above a secluded turquoise cove.",
  },
  {
    id: "sandstone-arch-courtyard",
    name: "Sandstone Arch Resort",
    roomType: "Courtyard Lap Suite",
    area: "Lamai Wing, Koh Samui",
    island: "Koh Samui",
    price: 780,
    rating: "4.8",
    reviews: 105,
    maxGuests: 4,
    sizeSqm: 155,
    bedConfig: "1 King Suite · Living Loft",
    oceanView: "Courtyard Pool & Sea",
    unitsTotal: 3,
    existingBookings: [
      { start: "2026-12-24", end: "2026-12-28" },
    ],
    highlights: [
      "Private 18m seafoam lap pool",
      "Hand-dressed coral arches",
      "Evening spa pavilion access",
    ],
    image: "/src/assets/images/stay_dune_resort_1794994739658.jpg",
    gallery: [
      "/src/assets/images/stay_sand_pavilion_1794994736849.jpg",
      "/src/assets/images/stay_coral_cabana_1794994738679.jpg",
      "/src/assets/images/stay_andaman_residence_1794994738824.jpg",
    ],
    hostName: "Kanya P.",
    description:
      "Framed by sunlit coral-stone colonnades and swaying royal palms, this serene courtyard sanctuary centers on a sparkling seafoam-turquoise lap pool mere steps from the shoreline.",
  },
];

const DESTINATIONS = [
  "All Islands",
  "Koh Samui",
  "Krabi",
  "Phuket",
  "Koh Tao",
  "Phi Phi",
];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.max(min, Math.min(max, val));
}

function formatShortDate(date: Date | null): string {
  if (!date) return "Add date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(date: Date | null): string {
  if (!date) return "Select date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

interface AvailabilityResult {
  available: boolean;
  unitsRemaining: number;
  reason: string;
  conflictWindow: DateWindow | null;
}

function checkRoomAvailability(
  stay: StayProperty,
  checkIn: Date | null,
  checkOut: Date | null,
  guests: number,
  userBookings: ResortReservation[]
): AvailabilityResult {
  if (guests > stay.maxGuests) {
    return {
      available: false,
      unitsRemaining: 0,
      reason: `Max ${stay.maxGuests} guests`,
      conflictWindow: null,
    };
  }

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return {
      available: true,
      unitsRemaining: stay.unitsTotal,
      reason: `${stay.unitsTotal} ${stay.unitsTotal === 1 ? "suite" : "suites"} in wing`,
      conflictWindow: null,
    };
  }

  const allWindows: DateWindow[] = [
    ...stay.existingBookings,
    ...userBookings
      .filter((b) => b.stayId === stay.id)
      .map((b) => ({ start: b.checkIn, end: b.checkOut })),
  ];

  let overlapCount = 0;
  let firstConflict: DateWindow | null = null;

  for (const w of allWindows) {
    const wStart = parseISODate(w.start);
    const wEnd = parseISODate(w.end);
    if (rangesOverlap(checkIn, checkOut, wStart, wEnd)) {
      overlapCount += 1;
      if (!firstConflict) firstConflict = w;
    }
  }

  const unitsRemaining = Math.max(0, stay.unitsTotal - overlapCount);
  if (unitsRemaining === 0) {
    return {
      available: false,
      unitsRemaining: 0,
      reason: firstConflict
        ? `Sold out (${formatShortDate(parseISODate(firstConflict.start))}–${formatShortDate(parseISODate(firstConflict.end))})`
        : "Sold out for dates",
      conflictWindow: firstConflict,
    };
  }

  return {
    available: true,
    unitsRemaining,
    reason: `${unitsRemaining} ${unitsRemaining === 1 ? "suite" : "suites"} left`,
    conflictWindow: null,
  };
}

function isNightSoldOutForStay(
  stay: StayProperty,
  dayDate: Date,
  userBookings: ResortReservation[]
): boolean {
  const nextDay = new Date(
    dayDate.getFullYear(),
    dayDate.getMonth(),
    dayDate.getDate() + 1
  );
  const allWindows: DateWindow[] = [
    ...stay.existingBookings,
    ...userBookings
      .filter((b) => b.stayId === stay.id)
      .map((b) => ({ start: b.checkIn, end: b.checkOut })),
  ];
  let count = 0;
  for (const w of allWindows) {
    if (rangesOverlap(dayDate, nextDay, parseISODate(w.start), parseISODate(w.end))) {
      count += 1;
    }
  }
  return count >= stay.unitsTotal;
}

function findNextAvailableWindow(
  stay: StayProperty,
  fromDate: Date | null,
  nights: number,
  guests: number,
  userBookings: ResortReservation[]
): { start: Date; end: Date } | null {
  const base = fromDate ? startOfDay(fromDate) : new Date(2026, 11, 15);
  const effectiveGuests = Math.min(guests, stay.maxGuests);
  for (let offset = 1; offset <= 45; offset++) {
    const candidateStart = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + offset
    );
    const candidateEnd = new Date(
      candidateStart.getFullYear(),
      candidateStart.getMonth(),
      candidateStart.getDate() + nights
    );
    const res = checkRoomAvailability(
      stay,
      candidateStart,
      candidateEnd,
      effectiveGuests,
      userBookings
    );
    if (res.available) {
      return { start: candidateStart, end: candidateEnd };
    }
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                                 APP COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function App() {
  /* Viewport & Scroll */
  const [viewport, setViewport] = useState({
    w: typeof window !== "undefined" && window.innerWidth > 0 ? window.innerWidth : 1440,
    h: typeof window !== "undefined" && window.innerHeight > 0 ? window.innerHeight : 900,
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onResize = () =>
      setViewport({
        w: Math.max(1, window.innerWidth || 1440),
        h: Math.max(1, window.innerHeight || 900),
      });
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Custom Dot Cursor */
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isRecMode] = useState(() =>
    typeof window !== "undefined"
      ? window.location.search.includes("rec")
      : false
  );
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    document.body.classList.add("custom-cursor-active");

    const onMove = (e: PointerEvent) => {
      setCursorVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        const target = e.target as HTMLElement | null;
        const clickable = target?.closest(
          'a, button, [role="button"], input, [data-clickable="true"]'
        );
        if (clickable) {
          cursorRef.current.classList.add("is-hover");
        } else {
          cursorRef.current.classList.remove("is-hover");
        }
      }
    };
    const onDown = () => cursorRef.current?.classList.add("is-down");
    const onUp = () => cursorRef.current?.classList.remove("is-down");
    const onLeave = () => setCursorVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* Intro animation milestones */
  const [introStage, setIntroStage] = useState({
    words: false,
    thumbs: false,
    rings: false,
    search: false,
    caption: false,
  });

  useEffect(() => {
    const timers = [
      setTimeout(() => setIntroStage((s) => ({ ...s, words: true })), 250),
      setTimeout(() => setIntroStage((s) => ({ ...s, thumbs: true })), 350),
      setTimeout(() => setIntroStage((s) => ({ ...s, rings: true })), 480),
      setTimeout(() => setIntroStage((s) => ({ ...s, search: true })), 420),
      setTimeout(() => setIntroStage((s) => ({ ...s, caption: true })), 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Hero Slideshow + Misty Right-to-Left Wipe */
  const [activeSlide, setActiveSlide] = useState(0);
  const [outgoingSlide, setOutgoingSlide] = useState<number | null>(null);
  const [wipeProgress, setWipeProgress] = useState(0); // 0 when idle, 0..1 during wipe
  const [captionRevealed, setCaptionRevealed] = useState(true);
  const [kenBurnsScale, setKenBurnsScale] = useState(0);
  const [pointerParallax, setPointerParallax] = useState({ x: 0, y: 0 });

  const wipeRafRef = useRef<number | null>(null);
  const kenBurnsRafRef = useRef<number | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const captionRevealTimerRef = useRef<number | null>(null);
  const activeSlideRef = useRef(0);
  activeSlideRef.current = activeSlide;

  const isTransitioning = outgoingSlide !== null;

  const startKenBurns = useCallback(() => {
    if (kenBurnsRafRef.current) cancelAnimationFrame(kenBurnsRafRef.current);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsedSec = Math.min(12, (now - startTime) / 1000);
      setKenBurnsScale(elapsedSec * 0.0035);
      if (elapsedSec < 12) {
        kenBurnsRafRef.current = requestAnimationFrame(tick);
      }
    };
    kenBurnsRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startKenBurns();
    return () => {
      if (kenBurnsRafRef.current) cancelAnimationFrame(kenBurnsRafRef.current);
    };
  }, [startKenBurns]);

  const goToSlide = useCallback(
    (targetIdx: number) => {
      const current = activeSlideRef.current;
      if (targetIdx === current || outgoingSlide !== null) return;

      if (wipeRafRef.current) cancelAnimationFrame(wipeRafRef.current);
      if (captionRevealTimerRef.current)
        clearTimeout(captionRevealTimerRef.current);
      if (kenBurnsRafRef.current) cancelAnimationFrame(kenBurnsRafRef.current);

      setOutgoingSlide(current);
      setActiveSlide(targetIdx);
      setWipeProgress(0);
      setKenBurnsScale(0);
      setCaptionRevealed(false);

      captionRevealTimerRef.current = window.setTimeout(() => {
        setCaptionRevealed(true);
      }, 650);

      const duration = 1250;
      const startTime = performance.now();

      const animateWipe = (now: number) => {
        const raw = Math.min(1, (now - startTime) / duration);
        const eased = easeInOutCubic(raw);
        setWipeProgress(eased);

        if (raw < 1) {
          wipeRafRef.current = requestAnimationFrame(animateWipe);
        } else {
          setOutgoingSlide(null);
          setWipeProgress(0);
          startKenBurns();
        }
      };

      wipeRafRef.current = requestAnimationFrame(animateWipe);
    },
    [outgoingSlide, startKenBurns]
  );

  // Auto-advance every 5.2s
  useEffect(() => {
    const schedule = () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        const next = (activeSlideRef.current + 1) % HERO_SLIDES.length;
        goToSlide(next);
      }, 5200);
    };
    schedule();
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [activeSlide, goToSlide]);

  useEffect(() => {
    return () => {
      if (wipeRafRef.current) cancelAnimationFrame(wipeRafRef.current);
      if (captionRevealTimerRef.current)
        clearTimeout(captionRevealTimerRef.current);
    };
  }, []);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (viewport.w < 640) return;
    const nx = (e.clientX / viewport.w - 0.5) * 2; // -1..1
    const ny = (e.clientY / viewport.h - 0.5) * 2;
    setPointerParallax({ x: -nx * 0.6, y: -ny * 0.5 });
  };

  /* Right Rail Responsive Geometry */
  const heroHeight = Math.max(680, viewport.h);
  const isTabletOrMobile = viewport.w <= 1000;
  const isMobile = viewport.w <= 640;

  const railLayout = useMemo(() => {
    const activeSize = clamp(viewport.w * 0.113, 96, 190);
    const inactiveSize = clamp(viewport.w * 0.054, 46, 92);
    const gap = Math.max(8, viewport.w * 0.009);
    const centerX = isMobile ? viewport.w * 0.84 : viewport.w * 0.855;
    const startY = 74 + heroHeight * 0.085;

    let currentTop = startY;
    const positions: Record<
      number,
      { top: number; left: number; size: number; centerY: number }
    > = {};

    for (const slideIdx of RAIL_ORDER) {
      const isLit = slideIdx === activeSlide;
      const size = isLit ? activeSize : inactiveSize;
      const left = centerX - size / 2;
      positions[slideIdx] = {
        top: currentTop,
        left,
        size,
        centerY: currentTop + size / 2,
      };
      currentTop += size + gap;
    }

    const activePos = positions[activeSlide];
    const ringInnerRadius = activeSize / 2 + viewport.w * 0.05;
    const ringOuterRadius = activeSize / 2 + viewport.w * 0.108;
    const connectorLength = Math.max(40, viewport.w * 0.047);
    const connectorGap = viewport.w * 0.008;
    const connectorRight = viewport.w - (activePos.left - connectorGap);
    const verticalBarHeight = Math.max(84, viewport.w * 0.065);

    return {
      activeSize,
      centerX,
      positions,
      activePos,
      ringInnerRadius,
      ringOuterRadius,
      connectorLength,
      connectorRight,
      verticalBarHeight,
    };
  }, [viewport.w, heroHeight, activeSlide, isMobile]);

  /* Page Navigation & Search Bar Popovers */
  const [activePage, setActivePage] = useState<"home" | "availability">("home");
  const [selectedDestination, setSelectedDestination] = useState("All Islands");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [activeField, setActiveField] = useState<
    "dest" | "checkin" | "checkout" | "guests"
  >("checkin");
  const [openPopover, setOpenPopover] = useState<
    "dest" | "calendar" | "guests" | null
  >(null);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(2026, 10, 1)
  );
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target as Node)
      ) {
        setOpenPopover(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const totalGuests = adults + childrenCount;

  const handleDateClick = (dayDate: Date) => {
    const day = startOfDay(dayDate);
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
      setActiveField("checkout");
    } else if (day < checkIn) {
      setCheckIn(day);
      setCheckOut(null);
      setActiveField("checkout");
    } else if (isSameDay(day, checkIn)) {
      return;
    } else {
      setCheckOut(day);
      setActiveField("checkout");
      setOpenPopover(null);
    }
  };

  /* Calendar grid generator (Monday first) */
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0 .. Sunday = 6
    const offset = (firstDay.getDay() + 6) % 7;
    const cells: Array<Date | null> = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [calendarMonth]);

  /* Stays Grid, Availability Filter, Reservations & Scroll Entrance */
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [heartPopId, setHeartPopId] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const staysGridRef = useRef<HTMLDivElement | null>(null);

  const [userBookings, setUserBookings] = useState<ResortReservation[]>([]);
  const [reservationsDrawerOpen, setReservationsDrawerOpen] = useState(false);

  const staysWithAvailability = useMemo(() => {
    return STAYS.map((stay) => ({
      stay,
      availability: checkRoomAvailability(
        stay,
        checkIn,
        checkOut,
        totalGuests,
        userBookings
      ),
    }));
  }, [checkIn, checkOut, totalGuests, userBookings]);

  const availableCount = useMemo(
    () => staysWithAvailability.filter((item) => item.availability.available).length,
    [staysWithAvailability]
  );

  const filteredStays = useMemo(() => {
    let list = staysWithAvailability;
    if (selectedDestination !== "All Islands") {
      list = list.filter((item) => item.stay.island === selectedDestination);
    }
    if (availableOnly) {
      list = list.filter((item) => item.availability.available);
    }
    return list;
  }, [staysWithAvailability, selectedDestination, availableOnly]);

  useEffect(() => {
    const el = staysGridRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll("[data-stay-card]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.stayCard;
            if (id) {
              setVisibleCards((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [filteredStays]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    setHeartPopId(id);
    setTimeout(() => setHeartPopId((cur) => (cur === id ? null : cur)), 380);
  };

  /* Nav Extras */
  const [currencyIdx, setCurrencyIdx] = useState(0);
  const currencies = ["USD $", "THB ฿", "EUR €"];
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [visitorRole, setVisitorRole] = useState("Resort Guest");
  const [visitorMenuOpen, setVisitorMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((cur) => (cur === msg ? null : cur)), 3200);
  };

  /* Shared-Element Flight & Detail Page */
  const [selectedStay, setSelectedStay] = useState<StayProperty | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailImageReady, setDetailImageReady] = useState(false);
  const [detailBlocksIn, setDetailBlocksIn] = useState(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(-1); // -1 means main photo
  const [lastBookedRef, setLastBookedRef] = useState<string | null>(null);
  const [detailCalendarOpen, setDetailCalendarOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);

  const [flightRect, setFlightRect] = useState<{
    src: string;
    x: number;
    y: number;
    w: number;
    h: number;
    radius: number;
  } | null>(null);

  const detailMainImgRef = useRef<HTMLDivElement | null>(null);
  const cardImgRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const openStayDetail = (stay: StayProperty, sourceEl?: HTMLElement | null) => {
    const rectEl = sourceEl || cardImgRefs.current[stay.id];
    const startRect = rectEl?.getBoundingClientRect();

    setSelectedStay(stay);
    setActiveGalleryIdx(-1);
    setLastBookedRef(null);
    setDetailCalendarOpen(false);
    setHasRated(false);
    setMapModalOpen(false);
    setVirtualTourOpen(false);
    setDetailBlocksIn(false);

    if (startRect) {
      setDetailImageReady(false);
      setDetailVisible(true);
      setFlightRect({
        src: stay.image,
        x: startRect.left,
        y: startRect.top,
        w: startRect.width,
        h: startRect.height,
        radius: 12,
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const targetRect = detailMainImgRef.current?.getBoundingClientRect();
          if (!targetRect) {
            setFlightRect(null);
            setDetailImageReady(true);
            setDetailBlocksIn(true);
            return;
          }

          const duration = 900;
          const startTime = performance.now();

          const step = (now: number) => {
            const raw = Math.min(1, (now - startTime) / duration);
            const p = easeInOutCubic(raw);
            setFlightRect({
              src: stay.image,
              x: startRect.left + (targetRect.left - startRect.left) * p,
              y: startRect.top + (targetRect.top - startRect.top) * p,
              w: startRect.width + (targetRect.width - startRect.width) * p,
              h: startRect.height + (targetRect.height - startRect.height) * p,
              radius: 12 - 2 * p,
            });

            if (raw < 1) {
              requestAnimationFrame(step);
            } else {
              setDetailImageReady(true);
              setFlightRect(null);
            }
          };
          requestAnimationFrame(step);
        });
      });

      setTimeout(() => setDetailBlocksIn(true), 250);
    } else {
      setDetailVisible(true);
      setDetailImageReady(true);
      setTimeout(() => setDetailBlocksIn(true), 120);
    }
  };

  const closeStayDetail = () => {
    setMapModalOpen(false);
    setVirtualTourOpen(false);
    setDetailVisible(false);
    setDetailBlocksIn(false);
    setFlightRect(null);
    setTimeout(() => {
      setSelectedStay(null);
      setDetailImageReady(false);
    }, 550);
  };

  const scrollToSection = (id: string) => {
    const scrollTarget = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    if (selectedStay) {
      closeStayDetail();
    }
    if (activePage !== "home") {
      setActivePage("home");
      setTimeout(scrollTarget, 120);
    } else if (selectedStay) {
      setTimeout(scrollTarget, 300);
    } else {
      scrollTarget();
    }
  };

  const focusDateSearch = (wing?: string) => {
    if (wing) {
      setSelectedDestination(wing);
    }
    if (selectedStay) {
      closeStayDetail();
    }
    if (activePage !== "home") {
      setActivePage("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setActiveField(!checkIn ? "checkin" : "checkout");
      setOpenPopover("calendar");
    }, 350);
  };

  const handleSearchNavigate = () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setActiveField(!checkIn ? "checkin" : "checkout");
      setOpenPopover("calendar");
      showToast(
        !checkIn
          ? "Please enter your check-in and check-out dates first"
          : "Please select your check-out date, then press Search"
      );
      return;
    }
    setOpenPopover(null);
    setActivePage("availability");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Nav Solid State */
  const isNavSolid =
    scrollY > viewport.h * 0.3 ||
    Boolean(selectedStay) ||
    activePage === "availability";

  /* Scroll Choreography Values */
  const safeVh = Math.max(1, viewport.h || 900);
  const stackOffsetY = scrollY * 0.42;
  const cloudBankOffsetY = -scrollY * 0.38;
  const cloudBankScale = 1 + (0.35 * scrollY) / safeVh;
  const topCloudOpacity = clamp(scrollY / (0.45 * safeVh), 0, 1);
  const railOffsetY = scrollY * 0.2;
  const railOpacity = clamp(1 - scrollY / (0.5 * safeVh), 0, 1);

  /* Mist Band Position during wipe */
  const mistRightPercent = wipeProgress * 135 - 17;
  const mistOpacity = isTransitioning
    ? clamp(Math.sin(Math.PI * wipeProgress) * 0.95, 0, 1)
    : 0;

  /* Detail nights calculation */
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return 5;
    const diff = Math.round(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(1, diff);
  }, [checkIn, checkOut]);

  return (
    <div className="relative min-h-screen text-[#112426] selection:bg-[#40c4aa]/30 selection:text-[#112426]">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`kt-cursor ${isRecMode ? "is-rec" : ""}`}
        style={{ opacity: cursorVisible ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[950] rounded-2xl border border-[#40c4aa]/35 bg-[#fdfaf6]/95 px-5 py-3 text-sm font-medium text-[#112426] shadow-[0_14px_38px_rgba(17,36,38,0.16)] backdrop-blur-md">
          {toastMsg}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                           NAVIGATION BAR                           */}
      {/* ------------------------------------------------------------------ */}
      <header
        className="fixed top-0 left-0 right-0 z-[500] h-[74px] transition-all duration-500"
        style={{
          paddingLeft: "clamp(20px, 9.5vw, 170px)",
          paddingRight: "clamp(20px, 9.5vw, 170px)",
          backgroundColor: isNavSolid
            ? "rgba(244, 228, 211, 0.88)"
            : "transparent",
          backdropFilter: isNavSolid ? "blur(16px) saturate(135%)" : "none",
          WebkitBackdropFilter: isNavSolid
            ? "blur(16px) saturate(135%)"
            : "none",
          color: isNavSolid ? "#112426" : "rgba(255, 255, 255, 0.94)",
          borderBottom: isNavSolid
            ? "1px solid rgba(17, 36, 38, 0.09)"
            : "1px solid rgba(255, 255, 255, 0.28)",
        }}
      >
        <div className="flex h-full items-center justify-between">
          {/* Left Side: Wordmark + Divider + Visitors */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (selectedStay) {
                  closeStayDetail();
                }
                setActivePage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="whitespace-nowrap shrink-0 text-[26px] font-light tracking-[-0.01em] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#40c4aa]"
            >
              Anivon Resorts
            </button>

            {!isMobile && (
              <>
                <span
                  aria-hidden="true"
                  className="mx-[28px] h-[42px] w-[1px] shrink-0 transition-colors duration-500"
                  style={{
                    backgroundColor: isNavSolid
                      ? "rgba(17, 36, 38, 0.25)"
                      : "rgba(255, 255, 255, 0.45)",
                  }}
                />

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setVisitorMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[12.5px] font-medium opacity-90 hover:opacity-100"
                  >
                    <span>
                      {visitorRole === "Resort Guest" ? "Suites" : visitorRole}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 stroke-[1.75]" />
                  </button>

                  {visitorMenuOpen && (
                    <div className="animate-popover absolute left-0 top-[36px] w-48 rounded-xl border border-[#40c4aa]/25 bg-[#fdfaf6]/95 p-1.5 text-[#112426] shadow-[0_14px_34px_rgba(17,36,38,0.16)] backdrop-blur-md">
                      {["Resort Guest", "Family Retreats", "Honeymooners"].map(
                        (role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setVisitorRole(role);
                              setVisitorMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                              visitorRole === role
                                ? "bg-[#e0f7f4] text-[#112426]"
                                : "hover:bg-[#f4e4d3]/60"
                            }`}
                          >
                            <span>{role}</span>
                            {visitorRole === role && (
                              <Check className="h-3.5 w-3.5 text-[#158b76]" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Center Links (hidden <= 1000px) */}
          {!isTabletOrMobile && (
            <nav className="flex items-center gap-[44px] text-[14.5px] font-medium">
              <button
                type="button"
                onClick={() => scrollToSection("our-resorts")}
                className="nav-wipe-link whitespace-nowrap shrink-0"
              >
                Our Resorts
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("guest-reviews")}
                className="nav-wipe-link whitespace-nowrap shrink-0"
              >
                Guest Reviews
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("resort-footer")}
                className="nav-wipe-link whitespace-nowrap shrink-0"
              >
                Concierge
              </button>
            </nav>
          )}

          {/* Right Side */}
          <div className="relative flex items-center gap-4">
            {!isTabletOrMobile && (
              <button
                type="button"
                onClick={() => setReservationsDrawerOpen(true)}
                className="whitespace-nowrap shrink-0 text-[14px] font-medium transition-opacity hover:opacity-75"
              >
                {userBookings.length > 0
                  ? `My Bookings (${userBookings.length})`
                  : "My Bookings"}
              </button>
            )}

            <button
              type="button"
              aria-label="Switch currency"
              onClick={() => {
                const next = (currencyIdx + 1) % currencies.length;
                setCurrencyIdx(next);
                showToast(`Display currency switched to ${currencies[next]}`);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
            >
              <Globe className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>

            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setNavMenuOpen((o) => !o)}
              className="flex h-[38px] items-center gap-2.5 rounded-[9px] px-2.5 transition-colors"
              style={{
                border: isNavSolid
                  ? "1.5px solid rgba(17, 36, 38, 0.45)"
                  : "1.5px solid rgba(255, 255, 255, 0.75)",
              }}
            >
              <Menu className="h-4 w-4 stroke-[1.75]" />
              <span
                className="flex h-[22px] w-[22px] items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: isNavSolid ? "#112426" : "#ffffff",
                  color: isNavSolid ? "#fdfaf6" : "#112426",
                }}
              >
                <User className="h-3.5 w-3.5 stroke-[2]" />
              </span>
            </button>

            {navMenuOpen && (
              <div className="animate-popover absolute right-0 top-[52px] w-60 rounded-2xl border border-[#40c4aa]/25 bg-[#fdfaf6]/95 p-2 text-[#112426] shadow-[0_18px_46px_rgba(17,36,38,0.18)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setNavMenuOpen(false);
                    scrollToSection("our-resorts");
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium hover:bg-[#e0f7f4]"
                >
                  <span>Picture Our Resorts</span>
                  <Compass className="h-4 w-4 text-[#158b76]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNavMenuOpen(false);
                    scrollToSection("guest-reviews");
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium hover:bg-[#e0f7f4]"
                >
                  <span>Guest Reviews</span>
                  <Star className="h-4 w-4 fill-[#f2b84b] text-[#f2b84b]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNavMenuOpen(false);
                    setReservationsDrawerOpen(true);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium hover:bg-[#e0f7f4]"
                >
                  <span>My Reservations</span>
                  <span className="text-xs font-semibold tabular-nums text-[#158b76]">
                    {userBookings.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNavMenuOpen(false);
                    focusDateSearch();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium hover:bg-[#e0f7f4]"
                >
                  <span>Search Suite Dates</span>
                  <Search className="h-4 w-4 text-[#158b76]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNavMenuOpen(false);
                    showToast(
                      "Anivon Concierge: reservations@anivonresorts.example"
                    );
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium hover:bg-[#e0f7f4]"
                >
                  <span>Private Concierge</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {activePage === "home" ? (
        <>
          {/* ------------------------------------------------------------------ */}
          {/*                            HERO SECTION                            */}
          {/* ------------------------------------------------------------------ */}
          <section
            onPointerMove={handleHeroPointerMove}
            className="relative z-[30] w-full"
            style={{ height: "100vh", minHeight: "680px" }}
          >
            {/* Clipped Hero Visual Backdrop & Concentric Rail */}
            <div className="absolute inset-0 overflow-hidden">
        {/* Slide Stack (lags on scroll: +0.42 * scrollY) */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(0, ${stackOffsetY}px, 0)`,
          }}
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isIncoming = idx === activeSlide;
            const isOut = idx === outgoingSlide;
            if (!isIncoming && !isOut) return null;

            // Mask for incoming slide during wipe
            let maskStyle: React.CSSProperties = {};
            let photoTransform = "";
            let zIndex = 2;

            if (isIncoming && isTransitioning) {
              zIndex = 4;
              const edge = wipeProgress * 135;
              const solid = edge - 35;
              const mid = edge - 17.5;
              const mask = `linear-gradient(to left, rgba(0,0,0,1) ${solid}%, rgba(0,0,0,0.6) ${mid}%, rgba(0,0,0,0) ${edge}%)`;
              maskStyle = {
                WebkitMaskImage: mask,
                maskImage: mask,
              };
              const sc = 1.12 - 0.08 * wipeProgress;
              const tx = (1 - wipeProgress) * 2;
              photoTransform = `scale(${sc}) translate3d(${tx}%, 0, 0)`;
            } else if (isOut) {
              zIndex = 2;
              const sc = 1.04 + 0.05 * wipeProgress;
              const tx = -wipeProgress * 2;
              photoTransform = `scale(${sc}) translate3d(${tx}%, 0, 0)`;
            } else {
              // Idle active slide: base 1.04 + Ken Burns + pointer parallax
              zIndex = 3;
              const sc = 1.04 + kenBurnsScale;
              photoTransform = `scale(${sc}) translate3d(${pointerParallax.x}%, ${pointerParallax.y}%, 0)`;
            }

            return (
              <div
                key={slide.id}
                className="absolute inset-0"
                style={{ zIndex, ...maskStyle }}
              >
                {/* Photo layer: inset -3% */}
                <div
                  className="absolute will-change-transform"
                  style={{
                    inset: "-3%",
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: slide.photoPos,
                    transform: photoTransform,
                    transition: isTransitioning
                      ? "none"
                      : "transform 0.35s ease-out",
                  }}
                />

                {/* Top lagoon tint behind nav */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(11,72,78,0.46) 0%, rgba(18,98,102,0.14) 28%, transparent 48%)",
                  }}
                />

                {/* Giant Title inside slide so wipe reveals title + photo together */}
                <h1
                  className="pointer-events-none absolute select-none font-bold uppercase tracking-[-0.02em]"
                  style={{
                    left: isMobile ? "6vw" : slide.titleLeft,
                    top: isMobile ? "calc(74px + 5.5vh)" : slide.titleTop,
                    maxWidth: isMobile ? "80vw" : "none",
                    fontSize: isMobile ? "13vw" : slide.titleSizeDesktop,
                    lineHeight:
                      slide.titleLines.length > 1 || isMobile ? 0.95 : 0.9,
                    whiteSpace: isMobile ? "normal" : "nowrap",
                  }}
                >
                  {slide.titleLines.map((line, lineIdx) => (
                    <span key={lineIdx} className="block">
                      {line.split(" ").map((word, wordIdx) => {
                        const orderIndex = lineIdx * 3 + wordIdx;
                        return (
                          <span
                            key={wordIdx}
                            className="inline-block overflow-hidden align-top mr-[0.22em]"
                          >
                            <span
                              className="hero-frosted-word"
                              style={{
                                transform: introStage.words
                                  ? "translateY(0)"
                                  : "translateY(105%)",
                                transition: `transform 1.15s var(--out) ${orderIndex * 90}ms`,
                              }}
                            >
                              {word}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </h1>
              </div>
            );
          })}
        </div>

        {/* Soft Misty Band riding the wipe frontier */}
        {isTransitioning && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 z-[5]"
            style={{
              width: "34vw",
              right: `calc(${mistRightPercent}% - 17vw)`,
              opacity: mistOpacity,
              filter: "blur(10px)",
              background:
                "radial-gradient(ellipse at center, rgba(224,247,244,0.82) 0%, rgba(244,228,211,0.42) 48%, transparent 74%)",
            }}
          />
        )}

        {/* Top Scroll-Reactive Inverted Cloud Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-4%] right-[-4%] z-[7] overflow-hidden"
          style={{
            top: "-30%",
            height: "80%",
            opacity: topCloudOpacity,
            mixBlendMode: "screen",
            transform: `translate3d(0, ${-scrollY * 0.15}px, 0) scaleY(-1)`,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${CLOUD_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
            }}
          />
        </div>

        {/* Bottom Volumetric Drifting Cloud Bank */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-4%] right-[-4%] bottom-[-6%] z-[7] will-change-transform"
          style={{
            height: "78%",
            mixBlendMode: "screen",
            transform: `translate3d(0, ${cloudBankOffsetY}px, 0) scale(${cloudBankScale})`,
            transformOrigin: "center bottom",
          }}
        >
          {/* Back mirrored cloud copy */}
          <div
            className="cloud-drift-back absolute inset-0"
            style={{
              opacity: 0.85,
              backgroundImage: `url(${CLOUD_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
            }}
          />
          {/* Front cloud copy */}
          <div
            className="cloud-drift-front absolute inset-0"
            style={{
              backgroundImage: `url(${CLOUD_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
            }}
          />
        </div>

        {/* Hero Bottom Fade into Warm Sand Beige #f4e4d3 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[8]"
          style={{
            height: "46%",
            background:
              "linear-gradient(180deg, rgba(244,228,211,0) 0%, rgba(244,228,211,0.48) 45%, rgba(244,228,211,0.92) 82%, #f4e4d3 100%)",
          }}
        />

        {/* ---------------------------------------------------------------- */}
        {/*              RIGHT RAIL: THUMBNAILS ON CONCENTRIC RINGS          */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="pointer-events-none absolute inset-0 z-[12]"
          style={{
            transform: `translate3d(0, ${railOffsetY}px, 0)`,
            opacity: railOpacity,
          }}
        >
          {/* Concentric Rings centered on active thumbnail */}
          {[railLayout.ringInnerRadius, railLayout.ringOuterRadius].map(
            (r, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="absolute rounded-full"
                style={{
                  width: r * 2,
                  height: r * 2,
                  left: railLayout.centerX - r,
                  top: railLayout.activePos.centerY - r,
                  border:
                    i === 0
                      ? "1.6px solid rgba(255, 255, 255, 0.56)"
                      : "1.6px solid rgba(224, 247, 244, 0.45)",
                  opacity: introStage.rings ? 1 : 0,
                  transition:
                    "top 0.9s var(--ease), left 0.9s var(--ease), width 0.9s var(--ease), height 0.9s var(--ease), opacity 0.8s ease",
                }}
              />
            )
          )}

          {/* Thumbnails */}
          {RAIL_ORDER.map((slideIdx, orderIdx) => {
            const slide = HERO_SLIDES[slideIdx];
            const pos = railLayout.positions[slideIdx];
            const isLit = slideIdx === activeSlide;

            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`View slide: ${slide.thumbLabel}`}
                onClick={() => goToSlide(slideIdx)}
                className="pointer-events-auto group absolute rounded-full focus-visible:outline-2 focus-visible:outline-[#40c4aa]"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.size,
                  height: pos.size,
                  transform: introStage.thumbs ? "scale(1)" : "scale(0)",
                  transition: `top 0.9s var(--ease), left 0.9s var(--ease), width 0.9s var(--ease), height 0.9s var(--ease), transform 0.65s var(--out) ${introStage.thumbs ? 0 : orderIdx * 140}ms`,
                }}
              >
                {/* Active outer halo ring 9px outside */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-full transition-opacity duration-500"
                  style={{
                    inset: "-9px",
                    border: "1.5px solid rgba(255, 255, 255, 0.62)",
                    boxShadow: isLit
                      ? "0 0 22px rgba(64, 196, 170, 0.35)"
                      : "none",
                    opacity: isLit ? 1 : 0,
                  }}
                />
                <span
                  className="block h-full w-full overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-[1.07]"
                  style={{
                    border: "3px solid rgba(255, 255, 255, 0.92)",
                    boxShadow: "0 10px 26px rgba(17, 46, 50, 0.28)",
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.thumbLabel}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </span>
              </button>
            );
          })}

          {/* Connector Line + Caption Block (hidden on <= 640px) */}
          {!isMobile && (
            <>
              {/* Horizontal 3px connector bar */}
              <div
                aria-hidden="true"
                className="absolute h-[3px] rounded-full bg-white"
                style={{
                  width: railLayout.connectorLength,
                  right: railLayout.connectorRight,
                  top: railLayout.activePos.centerY - 1.5,
                  transformOrigin: "right center",
                  transform:
                    captionRevealed && introStage.caption
                      ? "scaleX(1)"
                      : "scaleX(0)",
                  transition:
                    "transform 0.55s var(--ease), top 0.9s var(--ease), right 0.9s var(--ease)",
                }}
              />

              {/* Caption block */}
              <div
                className="absolute flex items-start gap-4"
                style={{
                  right:
                    railLayout.connectorRight +
                    railLayout.connectorLength +
                    18,
                  top:
                    railLayout.activePos.centerY -
                    railLayout.verticalBarHeight / 2,
                  transition: "top 0.9s var(--ease), right 0.9s var(--ease)",
                }}
              >
                {/* Caption copy */}
                <div
                  className="text-right text-white"
                  style={{
                    clipPath:
                      captionRevealed && introStage.caption
                        ? "inset(0 0% 0 0)"
                        : "inset(0 100% 0 0)",
                    transition: "clip-path 0.9s var(--out)",
                  }}
                >
                  <h2
                    className="font-light leading-[1.08] tracking-[-0.01em]"
                    style={{
                      fontSize: "clamp(26px, 2.75vw, 40px)",
                      textShadow: "0 4px 18px rgba(10, 44, 48, 0.34)",
                    }}
                  >
                    {HERO_SLIDES[activeSlide].captionTitle}
                  </h2>
                  <p
                    className="ml-auto mt-2 max-w-[250px] font-normal leading-[1.45] text-white/90"
                    style={{
                      fontSize: "clamp(12px, 1vw, 14.5px)",
                      textShadow: "0 2px 12px rgba(10, 44, 48, 0.32)",
                    }}
                  >
                    {HERO_SLIDES[activeSlide].captionDesc}
                  </p>
                </div>

                {/* Vertical 3px white bar */}
                <span
                  aria-hidden="true"
                  className="w-[3px] shrink-0 rounded-full bg-white"
                  style={{
                    height: railLayout.verticalBarHeight,
                    transformOrigin: "top center",
                    transform:
                      captionRevealed && introStage.caption
                        ? "scaleY(1)"
                        : "scaleY(0)",
                    transition: "transform 0.6s var(--out)",
                  }}
                />
              </div>
            </>
          )}
        </div>
            </div>

        {/* ---------------------------------------------------------------- */}
        {/*                         FLOATING SEARCH BAR                      */}
        {/* ---------------------------------------------------------------- */}
        <div
          ref={searchBarRef}
          className="absolute left-1/2 z-[40]"
          style={{
            width: "min(900px, calc(100% - 40px))",
            bottom: isMobile ? "16vh" : "calc(20vh + 2px)",
            transform: introStage.search
              ? "translate3d(-50%, 0, 0)"
              : "translate3d(-50%, 30px, 0)",
            opacity: introStage.search ? 1 : 0,
            transition:
              "transform 1s var(--out), opacity 0.9s var(--out)",
          }}
        >
          <div
            className={`relative flex ${
              isMobile
                ? "flex-col gap-2.5 p-3"
                : "h-[90px] items-center px-3"
            } rounded-[26px] border border-[#40c4aa]/25 bg-[#fdfaf6]/94 backdrop-blur-xl`}
            style={{
              boxShadow: "0 18px 60px rgba(17, 62, 60, 0.16)",
            }}
          >
            <div
              className={
                isMobile
                  ? "grid w-full grid-cols-2 gap-2"
                  : "flex flex-1 items-center gap-1.5"
              }
            >
              {/* 1. Destination */}
              <button
                type="button"
                onClick={() => {
                  setActiveField("dest");
                  setOpenPopover((p) => (p === "dest" ? null : "dest"));
                }}
                className={`group flex items-center gap-3 px-4 text-left transition-all duration-300 ${
                  isMobile ? "h-[64px]" : "h-[72px] flex-[1.35]"
                } rounded-[14px] ${
                  activeField === "dest" || openPopover === "dest"
                    ? "bg-white shadow-[0_8px_24px_rgba(24,78,76,0.14)] ring-1 ring-[#40c4aa]/30"
                    : "hover:bg-white/80 hover:shadow-[0_8px_24px_rgba(24,78,76,0.1)]"
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#158b76] stroke-[1.75]" />
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[20px] font-medium leading-tight text-[#112426]">
                    {selectedDestination === "All Islands"
                      ? "All Resort Wings"
                      : selectedDestination}
                  </div>
                  <div className="truncate text-[12.5px] font-normal text-[#425a5d]">
                    Select island wing
                  </div>
                </div>
              </button>

              {/* 2. Check in */}
              <button
                type="button"
                onClick={() => {
                  setActiveField("checkin");
                  setOpenPopover("calendar");
                }}
                className={`group flex items-center gap-3 px-4 text-left transition-all duration-300 ${
                  isMobile ? "h-[64px]" : "h-[72px] flex-1"
                } rounded-[14px] ${
                  activeField === "checkin" || openPopover === "calendar"
                    ? "bg-white shadow-[0_8px_24px_rgba(24,78,76,0.14)] ring-1 ring-[#40c4aa]/30"
                    : "hover:bg-white/80 hover:shadow-[0_8px_24px_rgba(24,78,76,0.1)]"
                }`}
              >
                <Calendar className="h-4 w-4 shrink-0 text-[#158b76] stroke-[1.75]" />
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[20px] font-medium leading-tight text-[#112426]">
                    Check in
                  </div>
                  <div className="truncate text-[12.5px] font-normal text-[#425a5d]">
                    {formatShortDate(checkIn)}
                  </div>
                </div>
              </button>

              {/* 3. Check out */}
              <button
                type="button"
                onClick={() => {
                  setActiveField("checkout");
                  setOpenPopover("calendar");
                }}
                className={`group flex items-center gap-3 px-4 text-left transition-all duration-300 ${
                  isMobile ? "h-[64px]" : "h-[72px] flex-1"
                } rounded-[14px] ${
                  activeField === "checkout"
                    ? "bg-white shadow-[0_8px_24px_rgba(24,78,76,0.14)] ring-1 ring-[#40c4aa]/30"
                    : "hover:bg-white/80 hover:shadow-[0_8px_24px_rgba(24,78,76,0.1)]"
                }`}
              >
                <Calendar className="h-4 w-4 shrink-0 text-[#158b76] stroke-[1.75]" />
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[20px] font-medium leading-tight text-[#112426]">
                    Check out
                  </div>
                  <div className="truncate text-[12.5px] font-normal text-[#425a5d]">
                    {formatShortDate(checkOut)}
                  </div>
                </div>
              </button>

              {/* 4. Guests */}
              <button
                type="button"
                onClick={() => {
                  setActiveField("guests");
                  setOpenPopover((p) => (p === "guests" ? null : "guests"));
                }}
                className={`group flex items-center gap-3 px-4 text-left transition-all duration-300 ${
                  isMobile ? "h-[64px]" : "h-[72px] flex-1"
                } rounded-[14px] ${
                  activeField === "guests" || openPopover === "guests"
                    ? "bg-white shadow-[0_8px_24px_rgba(24,78,76,0.14)] ring-1 ring-[#40c4aa]/30"
                    : "hover:bg-white/80 hover:shadow-[0_8px_24px_rgba(24,78,76,0.1)]"
                }`}
              >
                <Users className="h-4 w-4 shrink-0 text-[#158b76] stroke-[1.75]" />
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[20px] font-medium leading-tight text-[#112426]">
                    Guests
                  </div>
                  <div className="truncate text-[12.5px] font-normal text-[#425a5d] tabular-nums">
                    {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                  </div>
                </div>
              </button>
            </div>

            {/* Search Button — Navigates to Resort Suites & Availability once dates are entered */}
            <button
              type="button"
              aria-label="Search resort suites availability"
              onClick={handleSearchNavigate}
              className={`group flex items-center justify-center gap-2 rounded-[14px] text-sm font-semibold transition-all duration-300 ${
                checkIn && checkOut
                  ? "bg-[#40c4aa] text-[#0d2426] shadow-[0_10px_24px_rgba(64,196,170,0.36)] hover:bg-[#32b399]"
                  : "bg-[#112426] text-[#fdfaf6] hover:bg-[#40c4aa] hover:text-[#0d2426]"
              } ${
                isMobile
                  ? "h-[46px] w-full"
                  : "ml-2 mr-1.5 h-[56px] shrink-0 px-6"
              }`}
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Search</span>
            </button>

            {/* ---------------- DESTINATION POPOVER ---------------- */}
            {openPopover === "dest" && (
              <div
                className="animate-popover-up absolute left-3 bottom-[calc(100%+12px)] z-50 w-[260px] rounded-[18px] border border-[#40c4aa]/25 bg-[#fdfaf6]/98 p-2.5 backdrop-blur-xl"
                style={{ boxShadow: "0 22px 60px rgba(17, 46, 50, 0.2)" }}
              >
                <div className="px-3 py-1.5 text-xs font-semibold tracking-wide text-[#425a5d]">
                  Select Tropical Island
                </div>
                <div className="mt-1 space-y-1">
                  {DESTINATIONS.map((island) => (
                    <button
                      key={island}
                      type="button"
                      onClick={() => {
                        setSelectedDestination(island);
                        setActiveField("checkin");
                        setOpenPopover("calendar");
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        selectedDestination === island
                          ? "bg-[#e0f7f4] text-[#112426]"
                          : "text-[#112426] hover:bg-[#f4e4d3]/65"
                      }`}
                    >
                      <span>{island}</span>
                      {selectedDestination === island && (
                        <Check className="h-4 w-4 text-[#158b76]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------- CALENDAR POPOVER ---------------- */}
            {openPopover === "calendar" && (
              <div
                className="animate-popover-up absolute left-1/2 bottom-[calc(100%+12px)] z-50 w-[308px] -translate-x-1/2 rounded-[18px] border border-[#40c4aa]/25 bg-[#fdfaf6]/98 p-4 backdrop-blur-xl sm:left-[30%] sm:translate-x-0"
                style={{ boxShadow: "0 22px 60px rgba(17, 46, 50, 0.2)" }}
              >
                {/* Step Indicator */}
                <div className="mb-2.5 flex items-center justify-between border-b border-[#112426]/8 pb-2">
                  <span className="text-[11.5px] font-semibold text-[#158b76]">
                    {!checkIn || checkOut
                      ? "Step 1: Select Check-in Date"
                      : "Step 2: Select Check-out Date"}
                  </span>
                  {(checkIn || checkOut) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn(null);
                        setCheckOut(null);
                        setActiveField("checkin");
                      }}
                      className="text-[11px] font-semibold text-[#425a5d] hover:text-[#112426]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Month Header */}
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setCalendarMonth(
                        (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#112426] transition-colors hover:bg-[#e0f7f4]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-[#112426]">
                    {calendarMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setCalendarMonth(
                        (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#112426] transition-colors hover:bg-[#e0f7f4]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Weekdays (Monday first) */}
                <div className="mb-1.5 grid grid-cols-7 text-center text-[11px] font-semibold text-[#688083]">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <span key={d} className="py-1">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map((dateObj, idx) => {
                    if (!dateObj) {
                      return <div key={`empty-${idx}`} className="h-[34px]" />;
                    }
                    const isStart = isSameDay(dateObj, checkIn);
                    const isEnd = isSameDay(dateObj, checkOut);
                    const inRange =
                      checkIn &&
                      checkOut &&
                      dateObj > checkIn &&
                      dateObj < checkOut;
                    const isDisabled =
                      checkIn && !checkOut && dateObj < checkIn;

                    return (
                      <button
                        key={dateObj.toISOString()}
                        type="button"
                        disabled={Boolean(isDisabled)}
                        onClick={() => handleDateClick(dateObj)}
                        className={`flex h-[34px] items-center justify-center text-[13px] font-medium tabular-nums transition-colors ${
                          isStart || isEnd
                            ? "rounded-lg bg-[#40c4aa] font-semibold text-[#0d2426]"
                            : inRange
                              ? "bg-[#e0f7f4] text-[#112426]"
                              : isDisabled
                                ? "cursor-not-allowed text-[#688083]/45"
                                : "rounded-lg text-[#112426] hover:bg-[#f4e4d3]/70"
                        }`}
                      >
                        {dateObj.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- VISITORS POPOVER ---------------- */}
            {openPopover === "guests" && (
              <div
                className="animate-popover-up absolute right-3 bottom-[calc(100%+12px)] z-50 w-[275px] rounded-[18px] border border-[#40c4aa]/25 bg-[#fdfaf6]/98 p-4 backdrop-blur-xl"
                style={{ boxShadow: "0 22px 60px rgba(17, 46, 50, 0.2)" }}
              >
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#112426]">
                        Adults
                      </div>
                      <div className="text-xs text-[#425a5d]">Ages 13+</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease adults"
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] transition-colors hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold tabular-nums text-[#112426]">
                        {adults}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase adults"
                        onClick={() => setAdults((a) => Math.min(10, a + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] transition-colors hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-[#112426]/8" />

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#112426]">
                        Children
                      </div>
                      <div className="text-xs text-[#425a5d]">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease children"
                        onClick={() =>
                          setChildrenCount((c) => Math.max(0, c - 1))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] transition-colors hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold tabular-nums text-[#112426]">
                        {childrenCount}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase children"
                        onClick={() =>
                          setChildrenCount((c) => Math.min(8, c + 1))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] transition-colors hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scroll Page: Picture Our Resorts Showcase & Guest Reviews */}
      <ResortShowcaseSection
        isMobile={isMobile}
        onSelectWingAndFocusSearch={(wing) => focusDateSearch(wing)}
      />

      <GuestReviewsSection onFocusDateSearch={() => focusDateSearch()} />
        </>
      ) : (
        /* ------------------------------------------------------------------ */
        /*             DEDICATED RESORT SUITES & AVAILABILITY PAGE            */
        /* ------------------------------------------------------------------ */
        <main
          id="stays-section"
          className="relative z-[15] min-h-[85vh] pt-[106px] pb-20"
          style={{
            paddingLeft: "clamp(20px, 9.5vw, 170px)",
            paddingRight: "clamp(20px, 9.5vw, 170px)",
          }}
        >
          {/* Back & Breadcrumb Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#425a5d]">
              <button
                type="button"
                onClick={() => {
                  setActivePage("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#112426]/15 bg-[#fdfaf6]/90 px-4 py-2 font-semibold text-[#112426] transition-colors hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Anivon Resorts</span>
              </button>
              <span className="hidden sm:inline">Home</span>
              <span className="hidden sm:inline">›</span>
              <span className="hidden font-semibold text-[#112426] sm:inline">
                Resort Suites &amp; Availability
              </span>
            </div>

            <div className="text-xs font-medium text-[#425a5d] tabular-nums">
              {nightsCount} {nightsCount === 1 ? "night" : "nights"} ·{" "}
              {formatFullDate(checkIn)} – {formatFullDate(checkOut)}
            </div>
          </div>

          {/* Inline Refine Search Bar on Availability Page */}
          <div
            ref={searchBarRef}
            className="relative z-[35] mb-10 rounded-[22px] border border-[#40c4aa]/30 bg-[#fdfaf6]/95 p-3 shadow-[0_14px_40px_rgba(17,62,60,0.1)] backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto]">
              <button
                type="button"
                onClick={() =>
                  setOpenPopover((p) => (p === "dest" ? null : "dest"))
                }
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-[#e0f7f4]/60"
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#158b76]" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#688083]">
                    Island Wing
                  </div>
                  <div className="truncate text-sm font-semibold text-[#112426]">
                    {selectedDestination}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveField("checkin");
                  setOpenPopover((p) => (p === "calendar" ? null : "calendar"));
                }}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-[#e0f7f4]/60"
              >
                <Calendar className="h-4 w-4 shrink-0 text-[#158b76]" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#688083]">
                    Check In
                  </div>
                  <div className="text-sm font-semibold text-[#112426]">
                    {formatShortDate(checkIn)}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveField("checkout");
                  setOpenPopover((p) => (p === "calendar" ? null : "calendar"));
                }}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-[#e0f7f4]/60"
              >
                <Calendar className="h-4 w-4 shrink-0 text-[#158b76]" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#688083]">
                    Check Out
                  </div>
                  <div className="text-sm font-semibold text-[#112426]">
                    {formatShortDate(checkOut)}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setOpenPopover((p) => (p === "guests" ? null : "guests"))
                }
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-[#e0f7f4]/60"
              >
                <Users className="h-4 w-4 shrink-0 text-[#158b76]" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#688083]">
                    Guests
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-[#112426]">
                    {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenPopover(null);
                  showToast(
                    `${availableCount} of ${STAYS.length} suites open for ${formatShortDate(checkIn)}–${formatShortDate(checkOut)}`
                  );
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#40c4aa] px-5 py-3 text-sm font-semibold text-[#0d2426] transition-colors hover:bg-[#32b399]"
              >
                <Search className="h-4 w-4" />
                <span>Update Dates</span>
              </button>
            </div>

            {openPopover === "dest" && (
              <div
                className="animate-popover absolute left-3 top-[calc(100%+10px)] z-50 w-[250px] rounded-[18px] border border-[#40c4aa]/25 bg-[#fdfaf6]/98 p-2.5 backdrop-blur-xl"
                style={{ boxShadow: "0 22px 60px rgba(17, 46, 50, 0.18)" }}
              >
                <div className="space-y-1">
                  {DESTINATIONS.map((island) => (
                    <button
                      key={island}
                      type="button"
                      onClick={() => {
                        setSelectedDestination(island);
                        setOpenPopover(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        selectedDestination === island
                          ? "bg-[#e0f7f4] text-[#112426]"
                          : "text-[#112426] hover:bg-[#f4e4d3]/65"
                      }`}
                    >
                      <span>{island}</span>
                      {selectedDestination === island && (
                        <Check className="h-4 w-4 text-[#158b76]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {openPopover === "calendar" && (
              <div
                className="animate-popover absolute left-1/2 top-[calc(100%+10px)] z-50 w-[308px] -translate-x-1/2 rounded-[18px] border border-[#40c4aa]/25 bg-[#fdfaf6]/98 p-4 backdrop-blur-xl sm:left-[30%] sm:translate-x-0"
                style={{ boxShadow: "0 22px 60px rgba(17, 46, 50, 0.18)" }}
              >
                <div className="mb-2.5 flex items-center justify-between border-b border-[#112426]/8 pb-2">
                  <span className="text-[11.5px] font-semibold text-[#158b76]">
                    {!checkIn || checkOut
                      ? "Step 1: Select Check-in Date"
                      : "Step 2: Select Check-out Date"}
                  </span>
                  {(checkIn || checkOut) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn(null);
                        setCheckOut(null);
                        setActiveField("checkin");
                      }}
                      className="text-[11px] font-semibold text-[#425a5d] hover:text-[#112426]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setCalendarMonth(
                        (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#112426] hover:bg-[#e0f7f4]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-[#112426]">
                    {calendarMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setCalendarMonth(
                        (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#112426] hover:bg-[#e0f7f4]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mb-1.5 grid grid-cols-7 text-center text-[11px] font-semibold text-[#688083]">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <span key={d} className="py-1">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map((dateObj, idx) => {
                    if (!dateObj) {
                      return <div key={`ae-${idx}`} className="h-[34px]" />;
                    }
                    const isStart = isSameDay(dateObj, checkIn);
                    const isEnd = isSameDay(dateObj, checkOut);
                    const inRange =
                      checkIn &&
                      checkOut &&
                      dateObj > checkIn &&
                      dateObj < checkOut;
                    const isDisabled =
                      checkIn && !checkOut && dateObj < checkIn;

                    return (
                      <button
                        key={dateObj.toISOString()}
                        type="button"
                        disabled={Boolean(isDisabled)}
                        onClick={() => handleDateClick(dateObj)}
                        className={`flex h-[34px] items-center justify-center text-[13px] font-medium tabular-nums transition-colors ${
                          isStart || isEnd
                            ? "rounded-lg bg-[#40c4aa] font-semibold text-[#0d2426]"
                            : inRange
                              ? "bg-[#e0f7f4] text-[#112426]"
                              : isDisabled
                                ? "cursor-not-allowed text-[#688083]/45"
                                : "rounded-lg text-[#112426] hover:bg-[#f4e4d3]/70"
                        }`}
                      >
                        {dateObj.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {openPopover === "guests" && (
              <div
                className="animate-popover absolute right-3 top-[calc(100%+10px)] z-50 w-[275px] rounded-[18px] border border-[#40c4aa]/25 bg-[#fdfaf6]/98 p-4 backdrop-blur-xl"
                style={{ boxShadow: "0 22px 60px rgba(17, 46, 50, 0.18)" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#112426]">
                        Adults
                      </div>
                      <div className="text-xs text-[#425a5d]">Ages 13+</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease adults"
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] hover:bg-[#e0f7f4]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold tabular-nums text-[#112426]">
                        {adults}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase adults"
                        onClick={() => setAdults((a) => Math.min(10, a + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] hover:bg-[#e0f7f4]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="h-px bg-[#112426]/8" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#112426]">
                        Children
                      </div>
                      <div className="text-xs text-[#425a5d]">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease children"
                        onClick={() =>
                          setChildrenCount((c) => Math.max(0, c - 1))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] hover:bg-[#e0f7f4]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold tabular-nums text-[#112426]">
                        {childrenCount}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase children"
                        onClick={() =>
                          setChildrenCount((c) => Math.min(8, c + 1))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] hover:bg-[#e0f7f4]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Heading Row */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="font-display text-[#112426] tracking-[-0.01em]"
                style={{ fontSize: "clamp(28px, 2.7vw, 40px)" }}
              >
                Resort Suites &amp; Availability
              </h1>
              <p className="mt-1.5 text-sm text-[#425a5d] tabular-nums">
                {formatShortDate(checkIn)} – {formatShortDate(checkOut)} ·{" "}
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"} ·{" "}
                <span className="font-semibold text-[#158b76]">
                  {availableCount} of {STAYS.length} suites available
                </span>
                {selectedDestination !== "All Islands" && (
                  <>
                    {" "}
                    · {selectedDestination}{" "}
                    <button
                      type="button"
                      onClick={() => setSelectedDestination("All Islands")}
                      className="ml-1 font-semibold text-[#158b76] underline underline-offset-2"
                    >
                      Clear wing
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAvailableOnly((v) => !v)}
                className={`whitespace-nowrap shrink-0 rounded-[20px] border-[1.4px] px-5 py-2 text-[13.5px] font-medium transition-colors duration-300 ${
                  availableOnly
                    ? "border-[#40c4aa] bg-[#40c4aa] text-[#0d2426]"
                    : "border-[#112426]/25 bg-[#fdfaf6]/70 text-[#112426] hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                }`}
              >
                {availableOnly ? "Showing Available Only" : "Available Only"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDestination("All Islands");
                  setAvailableOnly(false);
                }}
                className="whitespace-nowrap shrink-0 rounded-[20px] border-[1.4px] border-[#112426] px-6 py-2 text-[13.5px] font-medium text-[#112426] transition-colors duration-300 hover:bg-[#112426] hover:text-[#fdfaf6]"
              >
                See All
              </button>
            </div>
          </div>

          {/* 4x2 Grid (2 cols <= 1000px) */}
          <div
            ref={staysGridRef}
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{ gap: "clamp(14px, 2.2vw, 30px)" }}
          >
            {filteredStays.map(({ stay, availability }, idx) => {
              const colDelay = (idx % 4) * 90;
              const isShown = visibleCards[stay.id] ?? true;
              const isFav = Boolean(favorites[stay.id]);

              return (
                <article
                  key={stay.id}
                  data-stay-card={stay.id}
                  data-clickable="true"
                  onClick={(e) => {
                    const cardImg = cardImgRefs.current[stay.id];
                    openStayDetail(
                      stay,
                      cardImg || (e.currentTarget as HTMLElement)
                    );
                  }}
                  className="group relative cursor-pointer"
                  style={{
                    transform: isShown ? "translateY(0)" : "translateY(40px)",
                    opacity: isShown ? 1 : 0,
                    transition: `transform 0.85s var(--out) ${colDelay}ms, opacity 0.85s var(--out) ${colDelay}ms`,
                  }}
                >
                  <div
                    ref={(el) => {
                      cardImgRefs.current[stay.id] = el;
                    }}
                    className="relative aspect-[203/268] w-full overflow-hidden rounded-[12px] bg-[#e0f7f4] transition-all duration-500 group-hover:-translate-y-[6px]"
                    style={{
                      boxShadow: "0 12px 30px rgba(24, 68, 66, 0.14)",
                    }}
                  >
                    <img
                      src={stay.image}
                      alt={`${stay.name} in ${stay.area}`}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07] ${
                        !availability.available ? "saturate-[0.82]" : ""
                      }`}
                    />

                    {/* Bottom darkening gradient scrim for high text contrast */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(17,36,38,0.08) 0%, transparent 38%, rgba(10,26,28,0.86) 100%)",
                      }}
                    />

                    {/* Top-left Seafoam Price Pill */}
                    <div
                      className="absolute left-3 top-3 rounded-[6px] px-2.5 py-1 text-[11.5px] font-semibold tabular-nums text-[#112426]"
                      style={{
                        backgroundColor: "rgba(224, 247, 244, 0.9)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      ${stay.price.toLocaleString()}
                      <span className="font-normal text-[#425a5d]">/night</span>
                    </div>

                    {/* Top-right Heart Button */}
                    <button
                      type="button"
                      aria-label={
                        isFav ? "Remove from favorites" : "Add to favorites"
                      }
                      onClick={(e) => toggleFavorite(e, stay.id)}
                      className={`absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#fdfaf6]/92 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 ${
                        heartPopId === stay.id ? "animate-heart-pop" : ""
                      }`}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 transition-colors ${
                          isFav
                            ? "fill-[#ff4d5e] text-[#ff4d5e]"
                            : "text-[#112426]"
                        }`}
                      />
                    </button>

                    {/* Bottom-left Room Details & Availability Info */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <div className="truncate text-[11px] font-medium text-[#e0f7f4]/90">
                        {stay.roomType} · {stay.sizeSqm} m² · Up to{" "}
                        {stay.maxGuests}
                      </div>
                      <h3 className="mt-0.5 truncate text-[15.5px] font-semibold leading-snug">
                        {stay.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-white/85">
                        <MapPin className="h-3 w-3 shrink-0 text-[#40c4aa]" />
                        <span className="truncate">{stay.area}</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star
                              key={sIdx}
                              className="h-2.5 w-2.5 fill-[#f2b84b] text-[#f2b84b]"
                            />
                          ))}
                          <span className="ml-1 font-medium tabular-nums text-white/95">
                            {stay.rating}
                          </span>
                        </div>
                        <span
                          className={`truncate font-semibold ${
                            availability.available
                              ? "text-[#40c4aa]"
                              : "text-[#f2b84b]"
                          }`}
                        >
                          {availability.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      )}

      {/* Quiet Tropical Sand Footer */}
      <footer
        id="resort-footer"
        className="border-t border-[#112426]/10 bg-[#f4e4d3]/55 py-12"
        style={{
          paddingLeft: "clamp(20px, 9.5vw, 170px)",
          paddingRight: "clamp(20px, 9.5vw, 170px)",
        }}
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-xl font-light text-[#112426]">
              Anivon Resorts
            </div>
            <p className="mt-1 text-xs text-[#425a5d]">
              Private tropical lagoon suites, beachfront pavilions &amp; coastal resort sanctuaries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#425a5d]">
            <button
              type="button"
              onClick={() => scrollToSection("our-resorts")}
              className="hover:text-[#158b76]"
            >
              Our Resorts
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("guest-reviews")}
              className="hover:text-[#158b76]"
            >
              Guest Reviews
            </button>
            <button
              type="button"
              onClick={() => setReservationsDrawerOpen(true)}
              className="hover:text-[#158b76]"
            >
              My Bookings ({userBookings.length})
            </button>
            <button
              type="button"
              onClick={() =>
                showToast("Anivon Concierge: reservations@anivonresorts.example")
              }
              className="hover:text-[#158b76]"
            >
              Concierge Desk
            </button>
            <span>© 2026 Anivon Resorts</span>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/*                   SHARED-ELEMENT PROPERTY DETAIL VIEW              */}
      {/* ------------------------------------------------------------------ */}
      {selectedStay && (
        <div
          className="fixed inset-0 z-[400] overflow-y-auto transition-opacity duration-[550ms]"
          style={{
            opacity: detailVisible ? 1 : 0,
            pointerEvents: detailVisible ? "auto" : "none",
            background:
              "linear-gradient(180deg, #f4e4d3 0px, #f4e4d3 290px, #fdfaf6 290px, #fdfaf6 100%)",
          }}
        >
          <div
            className="pt-[104px] pb-20"
            style={{
              paddingLeft: "clamp(20px, 9.5vw, 170px)",
              paddingRight: "clamp(20px, 9.5vw, 170px)",
            }}
          >
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-7 flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-[#112426]"
              style={{
                transform: detailBlocksIn
                  ? "translateY(0)"
                  : "translateY(26px)",
                opacity: detailBlocksIn ? 1 : 0,
                transition: "transform 0.7s var(--out), opacity 0.7s var(--out)",
              }}
            >
              <button
                type="button"
                onClick={closeStayDetail}
                className="font-semibold hover:text-[#158b76]"
              >
                Home
              </button>
              <span className="text-[#425a5d]">›</span>
              <span className="text-[#425a5d]">Anivon Resorts</span>
              <span className="text-[#425a5d]">›</span>
              <span className="text-[#425a5d]">{selectedStay.roomType}</span>
              <span className="text-[#425a5d]">›</span>
              <span className="text-[#688083]">
                {selectedStay.name}, {selectedStay.area}
              </span>
            </nav>

            {/* Two Columns: 1.18fr / 1fr */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.18fr_1fr] lg:gap-14">
              {/* LEFT COLUMN: Main Photo + 3 Interior Thumbnails */}
              <div>
                <div
                  ref={detailMainImgRef}
                  className="relative aspect-[512/445] w-full overflow-hidden rounded-[10px] bg-[#e0f7f4]"
                  style={{
                    boxShadow: "0 18px 46px rgba(17, 46, 50, 0.14)",
                    opacity: detailImageReady ? 1 : 0,
                  }}
                >
                  <img
                    src={
                      activeGalleryIdx === -1
                        ? selectedStay.image
                        : selectedStay.gallery[activeGalleryIdx]
                    }
                    alt={selectedStay.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700"
                  />

                  <button
                    type="button"
                    aria-label="Favorite property"
                    onClick={(e) => toggleFavorite(e, selectedStay.id)}
                    className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#fdfaf6]/92 shadow-md backdrop-blur-sm transition-transform hover:scale-110 ${
                      heartPopId === selectedStay.id ? "animate-heart-pop" : ""
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites[selectedStay.id]
                          ? "fill-[#ff4d5e] text-[#ff4d5e]"
                          : "text-[#112426]"
                      }`}
                    />
                  </button>

                  {/* Virtual Tour 360° Button */}
                  <button
                    type="button"
                    onClick={() => setVirtualTourOpen(true)}
                    className="group absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-[#40c4aa]/45 px-4 py-2 text-xs font-semibold text-[#112426] shadow-[0_10px_28px_rgba(17,46,50,0.2)] transition-all duration-300 hover:border-[#40c4aa] hover:bg-[#40c4aa] hover:text-[#0d2426]"
                    style={{
                      backgroundColor: "rgba(253, 250, 246, 0.92)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 text-[#158b76] transition-colors group-hover:text-[#0d2426]" />
                    <span>Virtual Tour</span>
                    <span
                      aria-hidden="true"
                      className="text-[#425a5d] group-hover:text-[#0d2426]/70"
                    >
                      ·
                    </span>
                    <span className="tabular-nums text-[#158b76] group-hover:text-[#0d2426]">
                      360°
                    </span>
                  </button>
                </div>

                {/* 3 Square Interior Thumbnails */}
                <div
                  className="mt-4 grid grid-cols-3 gap-[16px]"
                  style={{
                    transform: detailBlocksIn
                      ? "translateY(0)"
                      : "translateY(26px)",
                    opacity: detailBlocksIn ? 1 : 0,
                    transition:
                      "transform 0.7s var(--out) 70ms, opacity 0.7s var(--out) 70ms",
                  }}
                >
                  {selectedStay.gallery.map((imgSrc, gIdx) => {
                    const isActive = activeGalleryIdx === gIdx;
                    return (
                      <button
                        key={gIdx}
                        type="button"
                        onClick={() =>
                          setActiveGalleryIdx((cur) =>
                            cur === gIdx ? -1 : gIdx
                          )
                        }
                        className={`group relative aspect-square overflow-hidden rounded-[10px] transition-all duration-300 hover:-translate-y-1 ${
                          isActive
                            ? "ring-2 ring-[#40c4aa] ring-offset-2 ring-offset-[#fdfaf6]"
                            : ""
                        }`}
                      >
                        <img
                          src={imgSrc}
                          alt={`${selectedStay.name} interior view ${gIdx + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {gIdx === 2 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#112426]/55 text-lg font-semibold text-white backdrop-blur-[2px]">
                            +9
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Stylized Thai Island Location Map Thumbnail */}
                <div
                  style={{
                    transform: detailBlocksIn
                      ? "translateY(0)"
                      : "translateY(26px)",
                    opacity: detailBlocksIn ? 1 : 0,
                    transition:
                      "transform 0.7s var(--out) 140ms, opacity 0.7s var(--out) 140ms",
                  }}
                >
                  <IslandMapThumbnail
                    stayId={selectedStay.id}
                    stayName={selectedStay.name}
                    area={selectedStay.area}
                    onOpenModal={() => setMapModalOpen(true)}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Info + Room Specs + Availability Booking Card + Rating + Amenities */}
              <div className="space-y-6">
                {/* Title + Room Type + Host */}
                <div
                  style={{
                    transform: detailBlocksIn
                      ? "translateY(0)"
                      : "translateY(26px)",
                    opacity: detailBlocksIn ? 1 : 0,
                    transition:
                      "transform 0.7s var(--out) 140ms, opacity 0.7s var(--out) 140ms",
                  }}
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#158b76]">
                    {selectedStay.roomType} · {selectedStay.area}
                  </div>
                  <h1 className="mt-1 font-display text-[34px] sm:text-[38px] leading-[1.12] text-[#112426]">
                    {selectedStay.name}
                  </h1>
                  <div className="mt-2.5 flex items-center gap-2 text-sm text-[#425a5d]">
                    <span>Resort Concierge</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#40c4aa] text-[10px] font-bold text-[#0d2426]">
                      {selectedStay.hostName.charAt(0)}
                    </span>
                    <span className="font-semibold text-[#112426]">
                      {selectedStay.hostName}
                    </span>
                  </div>

                  {/* Room Specifications Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <div className="rounded-xl bg-[#e0f7f4]/65 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#425a5d]">
                        <Maximize2 className="h-3 w-3 text-[#158b76]" />
                        <span>Room Size</span>
                      </div>
                      <div className="mt-0.5 text-sm font-bold tabular-nums text-[#112426]">
                        {selectedStay.sizeSqm} m²
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#e0f7f4]/65 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#425a5d]">
                        <BedDouble className="h-3 w-3 text-[#158b76]" />
                        <span>Bedding</span>
                      </div>
                      <div className="mt-0.5 truncate text-xs font-bold text-[#112426]">
                        {selectedStay.bedConfig}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#e0f7f4]/65 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#425a5d]">
                        <Users className="h-3 w-3 text-[#158b76]" />
                        <span>Capacity</span>
                      </div>
                      <div className="mt-0.5 text-sm font-bold tabular-nums text-[#112426]">
                        Up to {selectedStay.maxGuests}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#e0f7f4]/65 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#425a5d]">
                        <Sun className="h-3 w-3 text-[#158b76]" />
                        <span>View</span>
                      </div>
                      <div className="mt-0.5 truncate text-xs font-bold text-[#112426]">
                        {selectedStay.oceanView}
                      </div>
                    </div>
                  </div>
                </div>

                {/* About & Room Highlights */}
                <div
                  style={{
                    transform: detailBlocksIn
                      ? "translateY(0)"
                      : "translateY(26px)",
                    opacity: detailBlocksIn ? 1 : 0,
                    transition:
                      "transform 0.7s var(--out) 210ms, opacity 0.7s var(--out) 210ms",
                  }}
                >
                  <h2 className="font-display text-xl text-[#112426]">
                    About This Suite
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-[1.65] text-[#425a5d]">
                    {selectedStay.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-[#158b76]">
                    {selectedStay.highlights.map((hl, i) => (
                      <span key={hl} className="inline-flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" />
                        <span>{hl}</span>
                        {i < selectedStay.highlights.length - 1 && (
                          <span className="ml-2 text-[#425a5d]/30" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Room Availability & Booking Card */}
                {(() => {
                  const roomAvail = checkRoomAvailability(
                    selectedStay,
                    checkIn,
                    checkOut,
                    totalGuests,
                    userBookings
                  );
                  const nextWindow = !roomAvail.available
                    ? findNextAvailableWindow(
                        selectedStay,
                        checkIn,
                        nightsCount,
                        totalGuests,
                        userBookings
                      )
                    : null;

                  return (
                    <div
                      className="rounded-[18px] border border-[#40c4aa]/25 bg-white p-6"
                      style={{
                        boxShadow: "0 16px 46px rgba(17, 62, 60, 0.1)",
                        transform: detailBlocksIn
                          ? "translateY(0)"
                          : "translateY(26px)",
                        opacity: detailBlocksIn ? 1 : 0,
                        transition:
                          "transform 0.7s var(--out) 280ms, opacity 0.7s var(--out) 280ms",
                      }}
                    >
                      <div className="flex items-baseline justify-between">
                        <div className="text-[26px] font-bold tabular-nums text-[#112426]">
                          ${selectedStay.price.toLocaleString()}
                          <span className="text-sm font-normal text-[#425a5d]">
                            /night
                          </span>
                        </div>
                        <span className="text-xs font-medium tabular-nums text-[#158b76]">
                          {nightsCount} {nightsCount === 1 ? "night" : "nights"} · $
                          {(selectedStay.price * nightsCount).toLocaleString()} total
                        </span>
                      </div>

                      {/* Live Room Availability Status Banner */}
                      <div
                        className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                          roomAvail.available
                            ? "bg-[#e0f7f4] text-[#112426]"
                            : "bg-[#f4e4d3] text-[#112426]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {roomAvail.available ? (
                            <CalendarCheck className="h-4 w-4 shrink-0 text-[#158b76]" />
                          ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 text-[#b45309]" />
                          )}
                          <span>
                            {roomAvail.available
                              ? `Available · ${roomAvail.reason}`
                              : totalGuests > selectedStay.maxGuests
                                ? `Capacity exceeded · Max ${selectedStay.maxGuests} guests`
                                : roomAvail.reason}
                          </span>
                        </div>

                        {!roomAvail.available &&
                          totalGuests <= selectedStay.maxGuests &&
                          nextWindow && (
                            <button
                              type="button"
                              onClick={() => {
                                setCheckIn(nextWindow.start);
                                setCheckOut(nextWindow.end);
                                setLastBookedRef(null);
                                showToast(
                                  `Updated to next open dates: ${formatShortDate(nextWindow.start)}–${formatShortDate(nextWindow.end)}`
                                );
                              }}
                              className="rounded-lg bg-[#112426] px-2.5 py-1 text-[11px] font-semibold text-[#fdfaf6] transition-colors hover:bg-[#40c4aa] hover:text-[#0d2426]"
                            >
                              Find Next Open Dates
                            </button>
                          )}

                        {!roomAvail.available &&
                          totalGuests > selectedStay.maxGuests && (
                            <button
                              type="button"
                              onClick={() => {
                                setAdults(selectedStay.maxGuests);
                                setChildrenCount(0);
                                setLastBookedRef(null);
                              }}
                              className="rounded-lg bg-[#112426] px-2.5 py-1 text-[11px] font-semibold text-[#fdfaf6] transition-colors hover:bg-[#40c4aa] hover:text-[#0d2426]"
                            >
                              Fit {selectedStay.maxGuests} Guests
                            </button>
                          )}
                      </div>

                      {/* Seafoam Check-In / Check-Out Interactive Selector */}
                      <button
                        type="button"
                        onClick={() => setDetailCalendarOpen((o) => !o)}
                        className="mt-3 grid w-full grid-cols-2 divide-x divide-[#40c4aa]/25 rounded-xl border border-[#40c4aa]/25 bg-[#e0f7f4]/55 p-3 text-left transition-colors hover:bg-[#e0f7f4]"
                      >
                        <div className="pr-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#425a5d]">
                            Check In
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-[#112426]">
                            {formatFullDate(checkIn)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pl-3">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#425a5d]">
                              Check Out
                            </div>
                            <div className="mt-0.5 text-sm font-semibold text-[#112426]">
                              {formatFullDate(checkOut)}
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-[#158b76] transition-transform ${
                              detailCalendarOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Inline Availability Calendar inside Booking Card */}
                      {detailCalendarOpen && (
                        <div className="mt-3 rounded-xl border border-[#40c4aa]/25 bg-[#fdfaf6] p-3.5">
                          <div className="mb-2.5 flex items-center justify-between">
                            <button
                              type="button"
                              aria-label="Previous availability month"
                              onClick={() =>
                                setCalendarMonth(
                                  (m) =>
                                    new Date(m.getFullYear(), m.getMonth() - 1, 1)
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#112426] hover:bg-[#e0f7f4]"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-xs font-semibold text-[#112426]">
                              {calendarMonth.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <button
                              type="button"
                              aria-label="Next availability month"
                              onClick={() =>
                                setCalendarMonth(
                                  (m) =>
                                    new Date(m.getFullYear(), m.getMonth() + 1, 1)
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#112426] hover:bg-[#e0f7f4]"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold text-[#688083]">
                            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                              (d) => (
                                <span key={d} className="py-1">
                                  {d}
                                </span>
                              )
                            )}
                          </div>

                          <div className="grid grid-cols-7 gap-y-1">
                            {calendarDays.map((dateObj, idx) => {
                              if (!dateObj) {
                                return (
                                  <div key={`de-${idx}`} className="h-[30px]" />
                                );
                              }
                              const isStart = isSameDay(dateObj, checkIn);
                              const isEnd = isSameDay(dateObj, checkOut);
                              const inRange =
                                checkIn &&
                                checkOut &&
                                dateObj > checkIn &&
                                dateObj < checkOut;
                              const nightFull = isNightSoldOutForStay(
                                selectedStay,
                                dateObj,
                                userBookings
                              );

                              return (
                                <button
                                  key={dateObj.toISOString()}
                                  type="button"
                                  onClick={() => {
                                    setLastBookedRef(null);
                                    const day = startOfDay(dateObj);
                                    if (!checkIn || (checkIn && checkOut)) {
                                      setCheckIn(day);
                                      setCheckOut(null);
                                    } else if (day <= checkIn) {
                                      setCheckIn(day);
                                      setCheckOut(null);
                                    } else {
                                      setCheckOut(day);
                                      setDetailCalendarOpen(false);
                                    }
                                  }}
                                  className={`relative flex h-[30px] items-center justify-center text-[12px] font-medium tabular-nums transition-colors ${
                                    isStart || isEnd
                                      ? "rounded-lg bg-[#40c4aa] font-bold text-[#0d2426]"
                                      : inRange
                                        ? "bg-[#e0f7f4] text-[#112426]"
                                        : nightFull
                                          ? "rounded-lg text-[#688083]/60 line-through hover:bg-[#f4e4d3]/60"
                                          : "rounded-lg text-[#112426] hover:bg-[#f4e4d3]/70"
                                  }`}
                                >
                                  {dateObj.getDate()}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10.5px] text-[#425a5d]">
                            <span>Strikethrough dates = fully booked</span>
                            <button
                              type="button"
                              onClick={() => setDetailCalendarOpen(false)}
                              className="font-semibold text-[#158b76]"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Guests row */}
                      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#112426]/10 px-3.5 py-2.5">
                        <div>
                          <span className="text-sm font-medium text-[#112426]">
                            Guests
                          </span>
                          <span className="ml-2 text-xs text-[#688083]">
                            (max {selectedStay.maxGuests})
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label="Decrease booking guests"
                            onClick={() => {
                              setLastBookedRef(null);
                              if (childrenCount > 0) {
                                setChildrenCount((c) => c - 1);
                              } else {
                                setAdults((a) => Math.max(1, a - 1));
                              }
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] hover:bg-[#e0f7f4]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-semibold tabular-nums text-[#112426]">
                            {totalGuests}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase booking guests"
                            onClick={() => {
                              setLastBookedRef(null);
                              setAdults((a) => Math.min(10, a + 1));
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#112426]/20 text-[#112426] hover:bg-[#e0f7f4]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Resort Rate Breakdown */}
                      <div className="mt-4 space-y-1.5 border-t border-[#112426]/10 pt-3 text-xs text-[#425a5d]">
                        <div className="flex justify-between tabular-nums">
                          <span>
                            ${selectedStay.price.toLocaleString()} × {nightsCount}{" "}
                            {nightsCount === 1 ? "night" : "nights"}
                          </span>
                          <span className="font-medium text-[#112426]">
                            ${(selectedStay.price * nightsCount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Breakfast &amp; resort pier transfer</span>
                          <span className="font-medium text-[#158b76]">
                            Included
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 text-sm font-bold tabular-nums text-[#112426]">
                          <span>Total</span>
                          <span>
                            ${(selectedStay.price * nightsCount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Book Room CTA */}
                      <button
                        type="button"
                        disabled={!roomAvail.available || !checkIn || !checkOut}
                        onClick={() => {
                          if (!checkIn || !checkOut || !roomAvail.available) return;
                          const refCode = `AR-${Math.floor(100000 + Math.random() * 900000)}`;
                          const newRes: ResortReservation = {
                            id: refCode,
                            stayId: selectedStay.id,
                            stayName: selectedStay.name,
                            roomType: selectedStay.roomType,
                            area: selectedStay.area,
                            checkIn: toISODate(checkIn),
                            checkOut: toISODate(checkOut),
                            guests: totalGuests,
                            nights: nightsCount,
                            totalPrice: selectedStay.price * nightsCount,
                            createdAt: new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          };
                          setUserBookings((prev) => [newRes, ...prev]);
                          setLastBookedRef(refCode);
                          showToast(
                            `Booking ${refCode} confirmed at Anivon Resorts`
                          );
                        }}
                        className={`mt-4 w-full rounded-full py-3.5 text-sm font-semibold transition-all duration-300 ${
                          lastBookedRef
                            ? "bg-[#e0f7f4] text-[#158b76] ring-1 ring-[#40c4aa]"
                            : !roomAvail.available || !checkIn || !checkOut
                              ? "cursor-not-allowed bg-[#f4e4d3] text-[#688083]"
                              : "bg-[#40c4aa] text-[#0d2426] hover:bg-[#32b399] shadow-[0_10px_24px_rgba(64,196,170,0.34)]"
                        }`}
                      >
                        {lastBookedRef
                          ? `Confirmed · Ref ${lastBookedRef} ✓`
                          : !checkIn || !checkOut
                            ? "Select Check-in & Check-out"
                            : !roomAvail.available
                              ? "Unavailable for Selected Dates"
                              : "Book Room"}
                      </button>
                    </div>
                  );
                })()}

                {/* Rating Row between Hairlines */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 border-y border-[#112426]/10 py-4"
                  style={{
                    transform: detailBlocksIn
                      ? "translateY(0)"
                      : "translateY(26px)",
                    opacity: detailBlocksIn ? 1 : 0,
                    transition:
                      "transform 0.7s var(--out) 350ms, opacity 0.7s var(--out) 350ms",
                  }}
                >
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold tabular-nums text-[#112426]">
                        {selectedStay.rating}
                      </span>
                      <span className="text-xs text-[#425a5d]">
                        ({selectedStay.reviews + (hasRated ? 1 : 0)} reviews)
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-[#f2b84b] text-[#f2b84b]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Overlapping reviewer avatars */}
                  <div className="flex items-center">
                    {["S", "M", "K"].map((initial, i) => (
                      <div
                        key={initial}
                        className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-[#fdfaf6] text-xs font-bold text-[#112426]"
                        style={{
                          marginLeft: i === 0 ? 0 : "-10px",
                          backgroundColor:
                            i === 0
                              ? "#e0f7f4"
                              : i === 1
                                ? "#f4e4d3"
                                : "#40c4aa",
                        }}
                      >
                        {initial}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setHasRated(true);
                      showToast("Thank you for rating this sanctuary!");
                    }}
                    className="rounded-full border border-[#112426]/30 px-4 py-1.5 text-xs font-semibold text-[#112426] transition-colors hover:border-[#40c4aa] hover:bg-[#e0f7f4]"
                  >
                    {hasRated ? "Rated ★" : "Rate Now"}
                  </button>
                </div>

                {/* Amenities 3x2 Grid */}
                <div
                  style={{
                    transform: detailBlocksIn
                      ? "translateY(0)"
                      : "translateY(26px)",
                    opacity: detailBlocksIn ? 1 : 0,
                    transition:
                      "transform 0.7s var(--out) 420ms, opacity 0.7s var(--out) 420ms",
                  }}
                >
                  <h3 className="font-display text-lg text-[#112426]">
                    Amenities
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { icon: Wifi, label: "High-Speed Wi-Fi" },
                      { icon: Coffee, label: "Personal Bar" },
                      { icon: Compass, label: "Private Pier" },
                      { icon: ShieldCheck, label: "Superhost" },
                      { icon: Sun, label: "Sunset Terrace" },
                      { icon: Sparkles, label: "Room Service" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 rounded-xl bg-[#e0f7f4]/60 px-3 py-2.5 text-xs font-medium text-[#112426]"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#158b76] stroke-[1.75]" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Places to Stay */}
            <div className="mt-16 border-t border-[#112426]/10 pt-10">
              <h2 className="font-display text-[26px] text-[#112426]">
                Similar Places to Stay
              </h2>
              <div
                className="mt-6 grid grid-cols-2 lg:grid-cols-4"
                style={{ gap: "clamp(14px, 2.2vw, 30px)" }}
              >
                {STAYS.filter((s) => s.id !== selectedStay.id)
                  .slice(0, 4)
                  .map((sim) => {
                    const isFav = Boolean(favorites[sim.id]);
                    return (
                      <article
                        key={sim.id}
                        data-clickable="true"
                        onClick={(e) => {
                          const target = e.currentTarget.querySelector(
                            "[data-sim-img]"
                          ) as HTMLElement | null;
                          openStayDetail(sim, target);
                        }}
                        className="group cursor-pointer"
                      >
                        <div
                          data-sim-img
                          className="relative aspect-[203/268] w-full overflow-hidden rounded-[12px] bg-[#e0f7f4] transition-all duration-500 group-hover:-translate-y-[6px]"
                          style={{
                            boxShadow: "0 12px 30px rgba(24, 68, 66, 0.14)",
                          }}
                        >
                          <img
                            src={sim.image}
                            alt={sim.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(17,36,38,0.06) 0%, transparent 40%, rgba(12,30,32,0.78) 100%)",
                            }}
                          />
                          <div
                            className="absolute left-3 top-3 rounded-[6px] px-2.5 py-1 text-[11.5px] font-semibold tabular-nums text-[#112426]"
                            style={{
                              backgroundColor: "rgba(224, 247, 244, 0.88)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            ${sim.price.toLocaleString()}
                            <span className="font-normal text-[#425a5d]">
                              /night
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label="Favorite property"
                            onClick={(e) => toggleFavorite(e, sim.id)}
                            className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#fdfaf6]/92 shadow-sm"
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                isFav
                                  ? "fill-[#ff4d5e] text-[#ff4d5e]"
                                  : "text-[#112426]"
                              }`}
                            />
                          </button>
                          <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                            <h3 className="truncate text-[15.5px] font-semibold">
                              {sim.name}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-white/85">
                              <MapPin className="h-3 w-3 shrink-0 text-[#40c4aa]" />
                              <span className="truncate">{sim.area}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Shared-Element Flight Clone */}
      {flightRect && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[700] overflow-hidden shadow-[0_22px_54px_rgba(17,46,50,0.22)]"
          style={{
            left: flightRect.x,
            top: flightRect.y,
            width: flightRect.w,
            height: flightRect.h,
            borderRadius: flightRect.radius,
          }}
        >
          <img
            src={flightRect.src}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Close X floating button in Detail View */}
      {selectedStay && detailVisible && (
        <button
          type="button"
          aria-label="Return to stays"
          onClick={closeStayDetail}
          className="fixed bottom-6 right-6 z-[450] flex h-11 w-11 items-center justify-center rounded-full border border-[#40c4aa]/40 bg-[#fdfaf6]/95 text-[#112426] shadow-[0_12px_30px_rgba(17,46,50,0.18)] backdrop-blur-md transition-transform hover:scale-105 hover:bg-[#e0f7f4]"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Interactive Thai Island Map Modal */}
      {selectedStay && (
        <IslandMapModal
          stayId={selectedStay.id}
          stayName={selectedStay.name}
          area={selectedStay.area}
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
        />
      )}

      {/* 360-Degree Interactive Interior Virtual Tour Modal */}
      {selectedStay && (
        <VirtualTourModal
          stayName={selectedStay.name}
          area={selectedStay.area}
          stayImage={selectedStay.image}
          gallery={selectedStay.gallery}
          isOpen={virtualTourOpen}
          onClose={() => setVirtualTourOpen(false)}
        />
      )}

      {/* My Resort Bookings Drawer */}
      {reservationsDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Anivon Resorts Reservations"
          className="fixed inset-0 z-[660] flex justify-end bg-[#0c2224]/45 backdrop-blur-sm"
          onClick={() => setReservationsDrawerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col border-l border-[#40c4aa]/30 bg-[#fdfaf6] text-[#112426] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#112426]/10 bg-[#f4e4d3]/65 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl text-[#112426]">
                  My Bookings
                </h2>
                <p className="text-xs text-[#425a5d]">
                  Anivon Resorts · Live room availability sync
                </p>
              </div>
              <button
                type="button"
                aria-label="Close bookings drawer"
                onClick={() => setReservationsDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#112426]/15 bg-[#fdfaf6] hover:bg-[#e0f7f4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {userBookings.length === 0 ? (
                <div className="rounded-2xl border border-[#40c4aa]/25 bg-[#e0f7f4]/50 p-6 text-center">
                  <CalendarCheck className="mx-auto h-8 w-8 text-[#158b76]" />
                  <h3 className="mt-3 font-display text-lg text-[#112426]">
                    No Reservations Yet
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#425a5d]">
                    Select check-in and check-out dates to check live suite
                    availability across our tropical wings and confirm a stay.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setReservationsDrawerOpen(false);
                      if (checkIn && checkOut) {
                        setActivePage("availability");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        focusDateSearch();
                      }
                    }}
                    className="mt-4 rounded-full bg-[#40c4aa] px-5 py-2 text-xs font-semibold text-[#0d2426] hover:bg-[#32b399]"
                  >
                    {checkIn && checkOut
                      ? "View Available Suites"
                      : "Enter Dates & Search"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-[#40c4aa]/30 bg-white p-4 shadow-[0_8px_24px_rgba(17,46,50,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#158b76]">
                            Ref {booking.id} · Confirmed
                          </div>
                          <h3 className="mt-0.5 font-display text-lg text-[#112426]">
                            {booking.stayName}
                          </h3>
                          <div className="text-xs text-[#425a5d]">
                            {booking.roomType} · {booking.area}
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Cancel reservation ${booking.id}`}
                          onClick={() => {
                            setUserBookings((prev) =>
                              prev.filter((b) => b.id !== booking.id)
                            );
                            setLastBookedRef((cur) =>
                              cur === booking.id ? null : cur
                            );
                            showToast(
                              `Reservation ${booking.id} cancelled — dates reopened`
                            );
                          }}
                          className="rounded-lg p-1.5 text-[#688083] hover:bg-[#f4e4d3] hover:text-[#112426]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#e0f7f4]/60 p-2.5 text-xs">
                        <div>
                          <span className="text-[#425a5d]">Dates: </span>
                          <span className="font-semibold text-[#112426]">
                            {formatShortDate(parseISODate(booking.checkIn))} –{" "}
                            {formatShortDate(parseISODate(booking.checkOut))}
                          </span>
                        </div>
                        <div className="text-right tabular-nums">
                          <span className="font-bold text-[#112426]">
                            ${booking.totalPrice.toLocaleString()}
                          </span>{" "}
                          <span className="text-[#425a5d]">
                            ({booking.guests} guests)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
