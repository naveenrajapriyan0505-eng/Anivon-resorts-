import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Anchor,
  Compass,
  Crosshair,
  Layers,
  MapPin,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Utensils,
  Waves,
  X,
} from "lucide-react";

export interface IslandLandmark {
  id: string;
  name: string;
  category: "beach" | "reef" | "pier" | "viewpoint" | "dining";
  x: number;
  y: number;
  travelTime: string;
  note: string;
}

interface IslandGeography {
  islandName: string;
  regionLabel: string;
  coordinates: string;
  scaleLabel: string;
  viewBox: string;
  landPaths: string[];
  contourPaths: string[];
  reefPaths: string[];
  waterLabels: Array<{ text: string; x: number; y: number }>;
}

interface PropertyMapMeta {
  islandKey: "Koh Samui" | "Krabi" | "Phuket" | "Koh Tao" | "Phi Phi";
  zoneLabel: string;
  villaX: number;
  villaY: number;
  landmarks: IslandLandmark[];
}

const ISLAND_GEOGRAPHY: Record<PropertyMapMeta["islandKey"], IslandGeography> = {
  "Koh Samui": {
    islandName: "Koh Samui",
    regionLabel: "Gulf of Thailand · Surat Thani",
    coordinates: "9°32'N · 100°03'E",
    scaleLabel: "5 km",
    viewBox: "0 0 640 440",
    landPaths: [
      // Main Koh Samui coastline
      "M 218 112 C 254 92, 312 88, 368 96 C 414 102, 444 128, 456 168 C 468 208, 464 256, 442 296 C 418 338, 370 356, 312 358 C 256 360, 206 346, 178 308 C 154 274, 152 222, 166 176 C 178 138, 194 124, 218 112 Z",
      // Koh Phangan hint top-right
      "M 498 34 C 528 24, 566 36, 578 66 C 584 86, 564 104, 534 100 C 506 96, 484 58, 498 34 Z",
      // Koh Matlang islet
      "M 468 142 C 478 138, 486 146, 482 156 C 476 164, 462 158, 468 142 Z",
      // Southern islet Koh Taen
      "M 184 374 C 204 368, 224 380, 216 398 C 206 410, 174 396, 184 374 Z",
    ],
    contourPaths: [
      "M 244 150 C 280 132, 336 132, 378 148 C 412 162, 424 206, 412 250 C 396 296, 352 318, 298 318 C 248 318, 214 294, 206 250 C 198 208, 214 166, 244 150 Z",
      "M 278 192 C 306 180, 344 184, 366 206 C 380 226, 370 258, 342 272 C 312 286, 274 276, 260 252 C 248 228, 256 204, 278 192 Z",
    ],
    reefPaths: [
      "M 192 96 C 248 70, 326 64, 394 78 C 446 88, 478 124, 486 174 C 494 224, 484 282, 456 322",
      "M 150 286 C 166 346, 224 380, 304 382",
    ],
    waterLabels: [
      { text: "Gulf of Thailand", x: 96, y: 84 },
      { text: "Chaweng Reef", x: 526, y: 234 },
      { text: "Coral Strait", x: 112, y: 368 },
    ],
  },
  Krabi: {
    islandName: "Krabi & Railay",
    regionLabel: "Andaman Sea · Krabi Province",
    coordinates: "8°01'N · 98°50'E",
    scaleLabel: "4 km",
    viewBox: "0 0 640 440",
    landPaths: [
      // Mainland Krabi / Ao Nang / Railay limestone peninsula
      "M 84 30 L 420 24 C 444 58, 442 104, 410 132 C 386 154, 396 184, 376 218 C 356 250, 322 260, 302 238 C 282 216, 294 176, 268 158 C 240 138, 198 152, 168 134 C 136 114, 108 80, 84 30 Z",
      // Koh Lanta Yai / Southern archipelago
      "M 432 232 C 454 224, 474 246, 472 288 C 470 334, 458 378, 434 398 C 412 406, 396 374, 400 326 C 404 278, 412 240, 432 232 Z",
      // Koh Poda & Chicken Island karsts
      "M 218 286 C 236 276, 254 288, 248 308 C 240 322, 210 310, 218 286 Z",
      "M 274 336 C 288 330, 300 342, 292 356 C 282 364, 266 350, 274 336 Z",
    ],
    contourPaths: [
      "M 164 62 L 368 56 C 382 84, 374 114, 348 136 C 324 156, 336 192, 320 210 C 300 198, 306 156, 278 138 C 238 112, 194 114, 164 62 Z",
      "M 432 262 C 444 260, 452 288, 448 330 C 444 360, 434 374, 424 366 C 416 350, 418 284, 432 262 Z",
    ],
    reefPaths: [
      "M 264 206 C 284 264, 336 286, 384 252 C 404 236, 418 192, 438 156",
      "M 196 278 C 228 256, 272 272, 266 318",
    ],
    waterLabels: [
      { text: "Andaman Sea", x: 112, y: 248 },
      { text: "Phra Nang Bay", x: 356, y: 288 },
      { text: "Lanta Channel", x: 526, y: 320 },
    ],
  },
  Phuket: {
    islandName: "Phuket & Phang Nga",
    regionLabel: "Andaman Sea · Southern Thailand",
    coordinates: "7°57'N · 98°17'E",
    scaleLabel: "8 km",
    viewBox: "0 0 640 440",
    landPaths: [
      // Phuket main island silhouette
      "M 232 62 C 266 50, 306 62, 324 98 C 340 132, 332 174, 338 214 C 344 258, 336 306, 312 346 C 292 380, 262 394, 240 374 C 218 354, 224 304, 208 262 C 194 222, 188 176, 200 128 C 208 94, 214 70, 232 62 Z",
      // Phang Nga Bay limestone islets east
      "M 412 108 C 434 94, 458 108, 452 134 C 444 156, 402 140, 412 108 Z",
      "M 472 152 C 492 144, 506 164, 494 184 C 480 198, 456 172, 472 152 Z",
      "M 428 214 C 448 206, 466 226, 454 248 C 440 264, 414 236, 428 214 Z",
      // Coral Island south
      "M 344 394 C 366 388, 384 402, 372 418 C 356 426, 332 410, 344 394 Z",
    ],
    contourPaths: [
      "M 248 98 C 272 90, 294 106, 302 140 C 310 180, 308 232, 298 282 C 290 322, 272 346, 256 336 C 242 324, 242 268, 230 222 C 218 176, 226 112, 248 98 Z",
    ],
    reefPaths: [
      "M 188 118 C 166 176, 168 242, 194 298 C 208 328, 206 372, 236 396",
      "M 384 114 C 414 78, 488 86, 514 142 C 534 186, 504 258, 444 276",
    ],
    waterLabels: [
      { text: "Andaman Sea", x: 98, y: 218 },
      { text: "Phang Nga Bay", x: 506, y: 94 },
      { text: "Kamala Bight", x: 112, y: 148 },
    ],
  },
  "Koh Tao": {
    islandName: "Koh Tao",
    regionLabel: "Chumphon Archipelago · Gulf of Thailand",
    coordinates: "10°05'N · 99°50'E",
    scaleLabel: "2 km",
    viewBox: "0 0 640 440",
    landPaths: [
      // Koh Tao main island
      "M 254 96 C 288 76, 338 82, 366 116 C 388 144, 396 184, 412 224 C 424 256, 418 302, 386 332 C 354 362, 302 368, 266 348 C 234 330, 232 288, 242 246 C 250 212, 230 176, 234 140 C 236 116, 242 104, 254 96 Z",
      // Koh Nang Yuan twin islets & sandbar top-left
      "M 146 84 C 164 76, 182 90, 174 108 C 164 120, 138 104, 146 84 Z",
      "M 184 122 C 198 118, 208 132, 198 144 C 186 150, 174 134, 184 122 Z",
    ],
    contourPaths: [
      "M 276 130 C 304 116, 338 126, 354 156 C 368 186, 378 232, 368 272 C 358 308, 324 326, 290 314 C 266 304, 268 260, 270 220 C 272 182, 258 144, 276 130 Z",
    ],
    reefPaths: [
      "M 126 98 C 134 62, 186 58, 212 102 C 218 148, 218 228, 210 294",
      "M 392 108 C 436 146, 456 226, 434 304 C 414 362, 352 392, 286 382",
    ],
    waterLabels: [
      { text: "Sairee Reef", x: 146, y: 224 },
      { text: "Shark Bay", x: 472, y: 332 },
      { text: "Nang Yuan Bar", x: 118, y: 58 },
    ],
  },
  "Phi Phi": {
    islandName: "Koh Phi Phi",
    regionLabel: "Hat Noppharat Thara · Andaman Sea",
    coordinates: "7°44'N · 98°46'E",
    scaleLabel: "3 km",
    viewBox: "0 0 640 440",
    landPaths: [
      // Phi Phi Don dumbbell-shaped silhouette
      "M 156 108 C 186 78, 246 82, 286 114 C 318 140, 356 146, 396 122 C 436 96, 486 106, 502 146 C 516 184, 492 228, 454 238 C 412 248, 376 222, 342 204 C 304 184, 264 202, 232 232 C 198 262, 152 244, 140 202 C 130 166, 134 130, 156 108 Z",
      // Phi Phi Leh (Maya Bay) south
      "M 272 288 C 302 278, 332 296, 336 334 C 340 374, 316 402, 288 394 C 266 388, 260 356, 278 340 C 292 328, 252 298, 272 288 Z",
      // Bamboo Island north-east
      "M 484 42 C 508 36, 526 50, 518 70 C 506 84, 472 64, 484 42 Z",
    ],
    contourPaths: [
      "M 178 134 C 204 114, 244 120, 268 146 C 246 176, 212 212, 182 204 C 158 194, 158 152, 178 134 Z",
      "M 406 144 C 436 128, 468 138, 474 166 C 478 192, 454 214, 424 210 C 398 206, 386 160, 406 144 Z",
    ],
    reefPaths: [
      "M 256 226 C 296 206, 346 210, 388 238",
      "M 244 316 C 234 366, 262 414, 316 416 C 358 416, 368 344, 350 294",
    ],
    waterLabels: [
      { text: "Loh Dalum Bay", x: 326, y: 108 },
      { text: "Tonsai Bay", x: 328, y: 244 },
      { text: "Maya Lagoon", x: 204, y: 356 },
    ],
  },
};

export const PROPERTY_MAP_META: Record<string, PropertyMapMeta> = {
  "turquoise-lagoon-villa": {
    islandKey: "Koh Samui",
    zoneLabel: "Bophut & Northeast Lagoon",
    villaX: 354,
    villaY: 112,
    landmarks: [
      {
        id: "lm-1",
        name: "Bophut Fisherman's Pier",
        category: "pier",
        x: 318,
        y: 104,
        travelTime: "5 min boat",
        note: "Private teak speedboat boarding to Ang Thong Marine Park.",
      },
      {
        id: "lm-2",
        name: "Choeng Mon Coral Shelf",
        category: "reef",
        x: 424,
        y: 116,
        travelTime: "7 min paddle",
        note: "Calm seafoam shallows with staghorn coral and parrotfish.",
      },
      {
        id: "lm-3",
        name: "Chaweng White Sand Cove",
        category: "beach",
        x: 448,
        y: 196,
        travelTime: "12 min drive",
        note: "Powdery crescent shoreline sheltered from afternoon trade winds.",
      },
      {
        id: "lm-4",
        name: "Big Buddha Sunset Point",
        category: "viewpoint",
        x: 382,
        y: 94,
        travelTime: "6 min drive",
        note: "Golden-hour headland overlooking Koh Phangan across the strait.",
      },
      {
        id: "lm-5",
        name: "Beachside Sea-Salt Kitchen",
        category: "dining",
        x: 284,
        y: 118,
        travelTime: "8 min walk",
        note: "Lantern-lit coastal seafood grill right on the water's edge.",
      },
    ],
  },
  "sandstone-arch-courtyard": {
    islandKey: "Koh Samui",
    zoneLabel: "Lamai Coral Cove Coast",
    villaX: 432,
    villaY: 266,
    landmarks: [
      {
        id: "lm-sa-1",
        name: "Crystal Silver Beach",
        category: "beach",
        x: 448,
        y: 234,
        travelTime: "4 min walk",
        note: "Granite-boulder cove with translucent turquoise swimming water.",
      },
      {
        id: "lm-sa-2",
        name: "Hin Ta Reef Garden",
        category: "reef",
        x: 426,
        y: 314,
        travelTime: "6 min kayak",
        note: "Sheltered snorkeling shelf rich in soft corals.",
      },
      {
        id: "lm-sa-3",
        name: "Lamai Coastal Pier",
        category: "pier",
        x: 404,
        y: 332,
        travelTime: "9 min drive",
        note: "Departure dock for southern Koh MatSum day trips.",
      },
      {
        id: "lm-sa-4",
        name: "Overlap Stone Ridge",
        category: "viewpoint",
        x: 378,
        y: 268,
        travelTime: "10 min drive",
        note: "Elevated granite overlook framing the eastern bay.",
      },
    ],
  },
  "baan-sai-pavilion": {
    islandKey: "Krabi",
    zoneLabel: "Railay West Limestone Cove",
    villaX: 310,
    villaY: 214,
    landmarks: [
      {
        id: "lm-bs-1",
        name: "Phra Nang Cave Beach",
        category: "beach",
        x: 336,
        y: 242,
        travelTime: "6 min walk",
        note: "Iconic karst-framed beach with emerald lagoon swimming.",
      },
      {
        id: "lm-bs-2",
        name: "Railay East Longtail Pier",
        category: "pier",
        x: 364,
        y: 204,
        travelTime: "4 min walk",
        note: "Direct longtail departures to Ao Nang and Koh Poda.",
      },
      {
        id: "lm-bs-3",
        name: "Diamond Cliff Viewpoint",
        category: "viewpoint",
        x: 332,
        y: 184,
        travelTime: "14 min trail",
        note: "Panoramic ridge overlooking both Railay bays.",
      },
      {
        id: "lm-bs-4",
        name: "Koh Poda Coral Reef",
        category: "reef",
        x: 236,
        y: 296,
        travelTime: "12 min longtail",
        note: "Vibrant shallow reef beside a pure white sandspit.",
      },
    ],
  },
  "palm-breeze-deck": {
    islandKey: "Krabi",
    zoneLabel: "Koh Lanta West Shoreline",
    villaX: 404,
    villaY: 296,
    landmarks: [
      {
        id: "lm-pb-1",
        name: "Klong Nin Sand Crescent",
        category: "beach",
        x: 402,
        y: 332,
        travelTime: "3 min walk",
        note: "Quiet palm-lined shoreline with gentle evening swells.",
      },
      {
        id: "lm-pb-2",
        name: "Saladan Island Pier",
        category: "pier",
        x: 422,
        y: 236,
        travelTime: "15 min drive",
        note: "Speedboat gateway to Phi Phi and Phuket.",
      },
      {
        id: "lm-pb-3",
        name: "Horizon Cliff Dining",
        category: "dining",
        x: 416,
        y: 366,
        travelTime: "7 min drive",
        note: "Candlelit Andaman terrace serving line-caught snapper.",
      },
      {
        id: "lm-pb-4",
        name: "Bamboo Bay Reef",
        category: "reef",
        x: 424,
        y: 392,
        travelTime: "14 min drive",
        note: "Secluded southern cove inside Mu Ko Lanta National Park.",
      },
    ],
  },
  "coral-horizon-cliff": {
    islandKey: "Phuket",
    zoneLabel: "Kamala Headland",
    villaX: 200,
    villaY: 184,
    landmarks: [
      {
        id: "lm-ch-1",
        name: "Laem Sing Secret Beach",
        category: "beach",
        x: 196,
        y: 152,
        travelTime: "5 min path",
        note: "Sheltered boulder-framed cove tucked below the headland.",
      },
      {
        id: "lm-ch-2",
        name: "Millionaire's Mile Reef",
        category: "reef",
        x: 194,
        y: 214,
        travelTime: "4 min swim",
        note: "Clear rocky drop-off ideal for morning paddleboarding.",
      },
      {
        id: "lm-ch-3",
        name: "Surin Beach Dining Row",
        category: "dining",
        x: 214,
        y: 126,
        travelTime: "8 min drive",
        note: "Open-air coastal bistros and sunset aperitif lounges.",
      },
      {
        id: "lm-ch-4",
        name: "Phuket Marina Pier",
        category: "pier",
        x: 326,
        y: 178,
        travelTime: "20 min drive",
        note: "Yacht charters into Phang Nga Bay's limestone islands.",
      },
    ],
  },
  "andaman-shore-residence": {
    islandKey: "Phuket",
    zoneLabel: "East Coast & Phang Nga View",
    villaX: 334,
    villaY: 162,
    landmarks: [
      {
        id: "lm-as-1",
        name: "Ao Po Yacht Marina",
        category: "pier",
        x: 332,
        y: 124,
        travelTime: "6 min drive",
        note: "Direct private catamaran embarkation into Phang Nga Bay.",
      },
      {
        id: "lm-as-2",
        name: "Koh Nakha Sandbar",
        category: "beach",
        x: 428,
        y: 122,
        travelTime: "14 min boat",
        note: "Tidal turquoise spit surrounded by calm emerald waters.",
      },
      {
        id: "lm-as-3",
        name: "Hong Island Sea Caves",
        category: "reef",
        x: 478,
        y: 168,
        travelTime: "22 min boat",
        note: "Hidden tidal lagoons accessible by kayak at mid-tide.",
      },
      {
        id: "lm-as-4",
        name: "Cape Yamu Viewpoint",
        category: "viewpoint",
        x: 338,
        y: 214,
        travelTime: "9 min drive",
        note: "Sweeping sunrise views over limestone sea stacks.",
      },
    ],
  },
  "seafoam-linen-cabana": {
    islandKey: "Koh Tao",
    zoneLabel: "Sairee Coral Bay",
    villaX: 242,
    villaY: 204,
    landmarks: [
      {
        id: "lm-sl-1",
        name: "Sairee White Sand Strip",
        category: "beach",
        x: 242,
        y: 172,
        travelTime: "2 min walk",
        note: "Kilometer-long shallow turquoise shoreline facing the sunset.",
      },
      {
        id: "lm-sl-2",
        name: "Koh Nang Yuan Sandbar",
        category: "viewpoint",
        x: 166,
        y: 108,
        travelTime: "10 min longtail",
        note: "Famous three-way white sandbridge linking twin granite peaks.",
      },
      {
        id: "lm-sl-3",
        name: "Japanese Gardens Reef",
        category: "reef",
        x: 192,
        y: 136,
        travelTime: "11 min longtail",
        note: "Vibrant coral plateau in waist-deep crystalline water.",
      },
      {
        id: "lm-sl-4",
        name: "Mae Haad Harbor Pier",
        category: "pier",
        x: 240,
        y: 256,
        travelTime: "6 min walk",
        note: "High-speed catamaran arrival dock from Samui.",
      },
    ],
  },
  "emerald-pier-bungalow": {
    islandKey: "Phi Phi",
    zoneLabel: "Laem Tong & Loh Bagao Reef",
    villaX: 468,
    villaY: 134,
    landmarks: [
      {
        id: "lm-ep-1",
        name: "Bamboo Island Coral Ring",
        category: "reef",
        x: 498,
        y: 60,
        travelTime: "12 min longtail",
        note: "Protected marine park reef circling a white-sand islet.",
      },
      {
        id: "lm-ep-2",
        name: "Loh Bagao Calm Beach",
        category: "beach",
        x: 486,
        y: 164,
        travelTime: "3 min walk",
        note: "Crescent bay sheltered by coconut groves and shallow seafoam surf.",
      },
      {
        id: "lm-ep-3",
        name: "Tonsai Village Pier",
        category: "pier",
        x: 332,
        y: 204,
        travelTime: "15 min boat",
        note: "Main ferry landing linking Krabi and Phuket.",
      },
      {
        id: "lm-ep-4",
        name: "Maya Bay Emerald Lagoon",
        category: "viewpoint",
        x: 300,
        y: 332,
        travelTime: "24 min longtail",
        note: "Towering 100m limestone cliffs enclosing a serene turquoise bay.",
      },
    ],
  },
};

function getCategoryIcon(category: IslandLandmark["category"]) {
  switch (category) {
    case "beach":
      return Sun;
    case "reef":
      return Waves;
    case "pier":
      return Anchor;
    case "viewpoint":
      return Compass;
    case "dining":
      return Utensils;
  }
}

/* -------------------------------------------------------------------------- */
/*                        1. STATIC MAP THUMBNAIL                             */
/* -------------------------------------------------------------------------- */

export function IslandMapThumbnail({
  stayId,
  stayName,
  area,
  onOpenModal,
}: {
  stayId: string;
  stayName: string;
  area: string;
  onOpenModal: () => void;
}) {
  const meta =
    PROPERTY_MAP_META[stayId] || PROPERTY_MAP_META["turquoise-lagoon-villa"];
  const geo = ISLAND_GEOGRAPHY[meta.islandKey];

  // Zoom the thumbnail slightly around the island + villa region for crisp detail
  const thumbViewBox = useMemo(() => {
    const w = 380;
    const h = 210;
    const cx = Math.max(w / 2, Math.min(640 - w / 2, meta.villaX));
    const cy = Math.max(h / 2, Math.min(440 - h / 2, meta.villaY));
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }, [meta.villaX, meta.villaY]);

  return (
    <button
      type="button"
      onClick={onOpenModal}
      aria-label={`Open interactive map of ${geo.islandName} for ${stayName}`}
      className="group relative mt-4 block w-full overflow-hidden rounded-[10px] border border-[#40c4aa]/30 bg-[#e0f7f4] text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#40c4aa]/65 hover:shadow-[0_14px_34px_rgba(17,62,60,0.14)]"
    >
      <div className="relative h-[168px] w-full overflow-hidden">
        {/* Stylized Static SVG Island Map */}
        <svg
          viewBox={thumbViewBox}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`sea-${stayId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f7f4" />
              <stop offset="100%" stopColor="#bfece4" />
            </linearGradient>
            <radialGradient id={`halo-${stayId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#40c4aa" stopOpacity="0.34" />
              <stop offset="70%" stopColor="#40c4aa" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#40c4aa" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sea background */}
          <rect x="0" y="0" width="640" height="440" fill={`url(#sea-${stayId})`} />

          {/* Subtle nautical grid */}
          {[100, 200, 300, 400, 500].map((x) => (
            <line
              key={`gx-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="440"
              stroke="rgba(17, 36, 38, 0.05)"
              strokeWidth="1"
            />
          ))}
          {[90, 180, 270, 360].map((y) => (
            <line
              key={`gy-${y}`}
              x1="0"
              y1={y}
              x2="640"
              y2={y}
              stroke="rgba(17, 36, 38, 0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Shallow reef contour lines */}
          {geo.reefPaths.map((d, i) => (
            <path
              key={`reef-${i}`}
              d={d}
              fill="none"
              stroke="#40c4aa"
              strokeOpacity="0.48"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          ))}

          {/* Sand-beige landmass */}
          {geo.landPaths.map((d, i) => (
            <path
              key={`land-${i}`}
              d={d}
              fill="#f4e4d3"
              stroke="#d6be9f"
              strokeWidth="2.2"
            />
          ))}

          {/* Terrain relief contour */}
          {geo.contourPaths.map((d, i) => (
            <path
              key={`cnt-${i}`}
              d={d}
              fill="#ebd5bd"
              fillOpacity="0.55"
              stroke="none"
            />
          ))}

          {/* Subtle nearby landmark dots */}
          {meta.landmarks.slice(0, 3).map((lm) => (
            <circle
              key={lm.id}
              cx={lm.x}
              cy={lm.y}
              r="3.2"
              fill="#fdfaf6"
              stroke="#158b76"
              strokeWidth="1.5"
            />
          ))}

          {/* Approximate villa radius halo */}
          <circle
            cx={meta.villaX}
            cy={meta.villaY}
            r="34"
            fill={`url(#halo-${stayId})`}
            stroke="#40c4aa"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Villa Pin */}
          <circle
            cx={meta.villaX}
            cy={meta.villaY}
            r="10"
            fill="#112426"
            stroke="#fdfaf6"
            strokeWidth="2.5"
          />
          <circle cx={meta.villaX} cy={meta.villaY} r="3.6" fill="#40c4aa" />
        </svg>

        {/* Bottom-left frosted island & zone label */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-[#40c4aa]/30 px-3 py-1.5"
          style={{
            backgroundColor: "rgba(253, 250, 246, 0.9)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#158b76]" />
          <div>
            <div className="text-[11.5px] font-semibold leading-tight text-[#112426]">
              {geo.islandName} · {meta.zoneLabel}
            </div>
            <div className="text-[10.5px] text-[#425a5d]">
              Approximate location · {area}
            </div>
          </div>
        </div>

        {/* Bottom-right interactive expand trigger */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-[#112426]/15 px-2.5 py-1.5 text-[11.5px] font-semibold text-[#112426] transition-colors group-hover:border-[#40c4aa] group-hover:bg-[#40c4aa] group-hover:text-[#0d2426]"
          style={{
            backgroundColor: "rgba(253, 250, 246, 0.92)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <Maximize2 className="h-3 w-3" />
          <span>Explore map</span>
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                       2. INTERACTIVE ISLAND MAP MODAL                      */
/* -------------------------------------------------------------------------- */

export function IslandMapModal({
  stayId,
  stayName,
  area,
  isOpen,
  onClose,
}: {
  stayId: string;
  stayName: string;
  area: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const meta =
    PROPERTY_MAP_META[stayId] || PROPERTY_MAP_META["turquoise-lagoon-villa"];
  const geo = ISLAND_GEOGRAPHY[meta.islandKey];

  const [zoom, setZoom] = useState(1.15);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | IslandLandmark["category"]
  >("all");
  const [showReefs, setShowReefs] = useState(true);
  const [showApproxRing, setShowApproxRing] = useState(true);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Center roughly near the villa when opened
  useEffect(() => {
    if (!isOpen) return;
    setZoom(1.18);
    setPan({
      x: (320 - meta.villaX) * 0.45,
      y: (220 - meta.villaY) * 0.45,
    });
    setSelectedLandmarkId(meta.landmarks[0]?.id ?? null);
    setCategoryFilter("all");
  }, [isOpen, stayId, meta.villaX, meta.villaY, meta.landmarks]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const visibleLandmarks = useMemo(() => {
    if (categoryFilter === "all") return meta.landmarks;
    return meta.landmarks.filter((lm) => lm.category === categoryFilter);
  }, [meta.landmarks, categoryFilter]);

  const selectedLandmark = useMemo(
    () => meta.landmarks.find((l) => l.id === selectedLandmarkId) || null,
    [meta.landmarks, selectedLandmarkId]
  );

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    setPan({
      x: Math.max(-240, Math.min(240, dragStartRef.current.panX + dx)),
      y: Math.max(-180, Math.min(180, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.16 : -0.16;
    setZoom((z) => Math.max(0.85, Math.min(2.6, Number((z + delta).toFixed(2)))));
  };

  const centerOnVilla = () => {
    setZoom(1.35);
    setPan({
      x: (320 - meta.villaX) * 0.65,
      y: (220 - meta.villaY) * 0.65,
    });
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${stayName} island location map`}
      className="fixed inset-0 z-[650] flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(12, 34, 36, 0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="animate-popover relative flex w-full max-w-[940px] flex-col overflow-hidden rounded-[22px] border border-[#40c4aa]/35 bg-[#fdfaf6] text-[#112426]"
        style={{
          height: "min(680px, 88vh)",
          boxShadow: "0 28px 80px rgba(10, 32, 34, 0.34)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#112426]/10 bg-[#f4e4d3]/65 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl sm:text-2xl text-[#112426]">
                {stayName}
              </h3>
              <span className="text-xs font-medium text-[#425a5d]">
                · {geo.islandName}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#425a5d]">
              {meta.zoneLabel} · {area} ·{" "}
              <span className="tabular-nums text-[#158b76]">{geo.coordinates}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReefs((r) => !r)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showReefs
                  ? "border-[#40c4aa] bg-[#e0f7f4] text-[#112426]"
                  : "border-[#112426]/15 bg-white text-[#425a5d]"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#158b76]" />
              <span className="hidden sm:inline">Reefs</span>
            </button>

            <button
              type="button"
              onClick={() => setShowApproxRing((r) => !r)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showApproxRing
                  ? "border-[#40c4aa] bg-[#e0f7f4] text-[#112426]"
                  : "border-[#112426]/15 bg-white text-[#425a5d]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#158b76]" />
              <span className="hidden sm:inline">Approx. Zone</span>
            </button>

            <button
              type="button"
              aria-label="Close map modal"
              onClick={onClose}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#112426]/15 bg-[#fdfaf6] text-[#112426] transition-colors hover:bg-[#e0f7f4]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Interactive Map Canvas */}
        <div
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={`relative flex-1 overflow-hidden bg-[#e0f7f4] select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Top-left Landmark Category Filter */}
          <div className="pointer-events-auto absolute left-4 top-4 z-20 flex flex-wrap gap-1.5">
            {(
              [
                { id: "all", label: "All Nearby" },
                { id: "beach", label: "Beaches" },
                { id: "reef", label: "Coral Reefs" },
                { id: "pier", label: "Piers" },
                { id: "viewpoint", label: "Viewpoints" },
                { id: "dining", label: "Dining" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  categoryFilter === tab.id
                    ? "bg-[#112426] text-[#fdfaf6] shadow-sm"
                    : "bg-[#fdfaf6]/88 text-[#112426] backdrop-blur-md hover:bg-[#fdfaf6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Transform Layer */}
          <div
            className="h-full w-full will-change-transform"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging
                ? "none"
                : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg
              viewBox={geo.viewBox}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="modal-sea" cx="50%" cy="45%" r="70%">
                  <stop offset="0%" stopColor="#e8fbf8" />
                  <stop offset="55%" stopColor="#d5f4ee" />
                  <stop offset="100%" stopColor="#b5e7de" />
                </radialGradient>
                <radialGradient id="modal-villa-zone" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#40c4aa" stopOpacity="0.32" />
                  <stop offset="65%" stopColor="#40c4aa" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#40c4aa" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect x="0" y="0" width="640" height="440" fill="url(#modal-sea)" />

              {/* Coordinate chart grid */}
              {[80, 160, 240, 320, 400, 480, 560].map((x) => (
                <line
                  key={`mx-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="440"
                  stroke="rgba(17, 36, 38, 0.055)"
                  strokeWidth="0.9"
                />
              ))}
              {[70, 140, 210, 280, 350].map((y) => (
                <line
                  key={`my-${y}`}
                  x1="0"
                  y1={y}
                  x2="640"
                  y2={y}
                  stroke="rgba(17, 36, 38, 0.055)"
                  strokeWidth="0.9"
                />
              ))}

              {/* Bathymetric shallow turquoise halos & reefs */}
              {showReefs && (
                <g>
                  {geo.landPaths.map((d, i) => (
                    <path
                      key={`halo-${i}`}
                      d={d}
                      fill="none"
                      stroke="#9ae2d5"
                      strokeOpacity="0.45"
                      strokeWidth="16"
                      strokeLinejoin="round"
                    />
                  ))}
                  {geo.reefPaths.map((d, i) => (
                    <path
                      key={`mreef-${i}`}
                      d={d}
                      fill="none"
                      stroke="#158b76"
                      strokeOpacity="0.42"
                      strokeWidth="1.6"
                      strokeDasharray="4 4"
                    />
                  ))}
                </g>
              )}

              {/* Warm sand-beige island landmasses */}
              {geo.landPaths.map((d, i) => (
                <path
                  key={`mland-${i}`}
                  d={d}
                  fill="#f4e4d3"
                  stroke="#cfb492"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              ))}

              {/* Relief contours */}
              {geo.contourPaths.map((d, i) => (
                <path
                  key={`mcnt-${i}`}
                  d={d}
                  fill="#ead2b7"
                  fillOpacity="0.6"
                  stroke="#dcc09f"
                  strokeWidth="0.8"
                />
              ))}

              {/* Water body labels */}
              {geo.waterLabels.map((lbl) => (
                <text
                  key={lbl.text}
                  x={lbl.x}
                  y={lbl.y}
                  fill="#158b76"
                  fillOpacity="0.58"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="0.12em"
                  style={{ textTransform: "uppercase" }}
                >
                  {lbl.text}
                </text>
              ))}

              {/* Dashed route line to selected landmark */}
              {selectedLandmark && (
                <line
                  x1={meta.villaX}
                  y1={meta.villaY}
                  x2={selectedLandmark.x}
                  y2={selectedLandmark.y}
                  stroke="#112426"
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                  strokeOpacity="0.65"
                />
              )}

              {/* Approximate villa location ring */}
              {showApproxRing && (
                <g>
                  <circle
                    cx={meta.villaX}
                    cy={meta.villaY}
                    r="44"
                    fill="url(#modal-villa-zone)"
                    stroke="#40c4aa"
                    strokeOpacity="0.72"
                    strokeWidth="1.3"
                    strokeDasharray="4 3"
                  />
                </g>
              )}

              {/* Interactive Landmark Pins */}
              {visibleLandmarks.map((lm) => {
                const isSelected = lm.id === selectedLandmarkId;
                return (
                  <g
                    key={lm.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLandmarkId(lm.id);
                    }}
                  >
                    <circle
                      cx={lm.x}
                      cy={lm.y}
                      r={isSelected ? 14 : 11}
                      fill="transparent"
                    />
                    <circle
                      cx={lm.x}
                      cy={lm.y}
                      r={isSelected ? 8.5 : 6.5}
                      fill={isSelected ? "#40c4aa" : "#fdfaf6"}
                      stroke="#112426"
                      strokeWidth={isSelected ? 2 : 1.5}
                    />
                    <circle
                      cx={lm.x}
                      cy={lm.y}
                      r={2.3}
                      fill="#112426"
                    />
                    <text
                      x={lm.x + 11}
                      y={lm.y + 3.5}
                      fontSize="9.5"
                      fontWeight={isSelected ? "700" : "600"}
                      fill="#112426"
                      stroke="#fdfaf6"
                      strokeWidth="2.5"
                      paintOrder="stroke"
                    >
                      {lm.name}
                    </text>
                  </g>
                );
              })}

              {/* Villa Central Pin */}
              <g
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLandmarkId(null);
                  centerOnVilla();
                }}
              >
                <circle
                  cx={meta.villaX}
                  cy={meta.villaY}
                  r="14"
                  fill="#40c4aa"
                  fillOpacity="0.28"
                />
                <circle
                  cx={meta.villaX}
                  cy={meta.villaY}
                  r="9.5"
                  fill="#112426"
                  stroke="#fdfaf6"
                  strokeWidth="2.5"
                />
                <circle cx={meta.villaX} cy={meta.villaY} r="3.5" fill="#40c4aa" />
                <text
                  x={meta.villaX}
                  y={meta.villaY - 15}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill="#112426"
                  stroke="#fdfaf6"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {stayName}
                </text>
              </g>
            </svg>
          </div>

          {/* Bottom-left Selected Landmark / Zone Card */}
          <div
            className="pointer-events-auto absolute bottom-4 left-4 z-20 max-w-[330px] rounded-2xl border border-[#40c4aa]/30 p-3.5 shadow-[0_14px_34px_rgba(17,46,50,0.16)]"
            style={{
              backgroundColor: "rgba(253, 250, 246, 0.94)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            {selectedLandmark ? (
              (() => {
                const Icon = getCategoryIcon(selectedLandmark.category);
                return (
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e0f7f4] text-[#158b76]">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#112426]">
                            {selectedLandmark.name}
                          </div>
                          <div className="text-[11px] font-medium text-[#158b76]">
                            {selectedLandmark.travelTime} from villa
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={centerOnVilla}
                        className="shrink-0 rounded-md px-2 py-1 text-[10.5px] font-semibold text-[#425a5d] hover:bg-[#e0f7f4] hover:text-[#112426]"
                      >
                        Villa
                      </button>
                    </div>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-[#425a5d]">
                      {selectedLandmark.note}
                    </p>
                  </div>
                );
              })()
            ) : (
              <div>
                <div className="text-xs font-bold text-[#112426]">
                  Approximate Villa Zone · {meta.zoneLabel}
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#425a5d]">
                  Exact beachfront pier & check-in coordinates are shared upon
                  booking confirmation. Tap any pin to preview nearby reefs and
                  beaches.
                </p>
              </div>
            )}
          </div>

          {/* Bottom-right Zoom & Navigation Controls */}
          <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
            {/* Scale Bar & Compass */}
            <div
              className="flex items-center gap-2.5 rounded-xl border border-[#40c4aa]/25 px-3 py-1.5 text-[11px] font-semibold text-[#112426]"
              style={{
                backgroundColor: "rgba(253, 250, 246, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Compass className="h-3.5 w-3.5 text-[#158b76]" />
              <span>N</span>
              <span className="h-3 w-px bg-[#112426]/15" />
              <div className="flex items-center gap-1.5">
                <span className="h-[2px] w-7 bg-[#112426]" />
                <span className="tabular-nums">{geo.scaleLabel}</span>
              </div>
            </div>

            <div
              className="flex items-center gap-1 rounded-xl border border-[#40c4aa]/25 p-1 shadow-[0_10px_24px_rgba(17,46,50,0.14)]"
              style={{
                backgroundColor: "rgba(253, 250, 246, 0.94)",
                backdropFilter: "blur(12px)",
              }}
            >
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() =>
                  setZoom((z) => Math.max(0.85, Number((z - 0.25).toFixed(2))))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#112426] hover:bg-[#e0f7f4]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[42px] text-center text-[11px] font-semibold tabular-nums text-[#425a5d]">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() =>
                  setZoom((z) => Math.min(2.6, Number((z + 0.25).toFixed(2))))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#112426] hover:bg-[#e0f7f4]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="mx-0.5 h-4 w-px bg-[#112426]/10" />
              <button
                type="button"
                aria-label="Center on villa"
                onClick={centerOnVilla}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#158b76] hover:bg-[#e0f7f4]"
              >
                <Crosshair className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Reset island view"
                onClick={resetView}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#425a5d] hover:bg-[#e0f7f4] hover:text-[#112426]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
