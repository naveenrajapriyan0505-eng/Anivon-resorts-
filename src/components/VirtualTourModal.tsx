import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Compass,
  Eye,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

interface TourHotspot {
  id: string;
  label: string;
  detail: string;
  /** Position along the 0..360 degree panoramic loop */
  yawDeg: number;
  /** Vertical percentage 20..80 */
  yPct: number;
  targetRoomId?: string;
}

interface TourRoom {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  initialYaw: number;
  hotspots: TourHotspot[];
}

const LIVING_LOUNGE_IMG =
  "/src/assets/images/interior_living_lounge_1794995276333.jpg";
const MASTER_SUITE_IMG =
  "/src/assets/images/interior_master_suite_1794995276614.jpg";
const TEAK_TERRACE_IMG =
  "/src/assets/images/hero_teak_terrace_1794994735581.jpg";

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function VirtualTourModal({
  stayName,
  area,
  stayImage,
  gallery,
  isOpen,
  onClose,
}: {
  stayName: string;
  area: string;
  stayImage: string;
  gallery: [string, string, string];
  isOpen: boolean;
  onClose: () => void;
}) {
  const rooms: TourRoom[] = useMemo(
    () => [
      {
        id: "living-pavilion",
        name: "Living Pavilion",
        subtitle: "Open-air travertine & woven rattan lounge",
        image: LIVING_LOUNGE_IMG,
        initialYaw: 95,
        hotspots: [
          {
            id: "hs-1",
            label: "Lagoon Folding Doors",
            detail:
              "Floor-to-ceiling teak pocket doors slide completely clear to merge the indoor lounge with the sea-breeze deck.",
            yawDeg: 112,
            yPct: 48,
          },
          {
            id: "hs-2",
            label: "Step into Master Suite",
            detail: "Follow the coral-stone gallery into the oceanfront suite.",
            yawDeg: 42,
            yPct: 54,
            targetRoomId: "master-suite",
          },
          {
            id: "hs-3",
            label: "Hand-Carved Teak Dining",
            detail:
              "Single-slab northern Thai teak table seated for eight guests.",
            yawDeg: 225,
            yPct: 56,
          },
        ],
      },
      {
        id: "master-suite",
        name: "Master Suite",
        subtitle: "Four-poster teak canopy & private pool access",
        image: MASTER_SUITE_IMG,
        initialYaw: 90,
        hotspots: [
          {
            id: "ms-1",
            label: "Four-Poster Linen Canopy",
            detail:
              "Breathable organic cotton drapes paired with sand-washed Belgian linen bedding.",
            yawDeg: 58,
            yPct: 48,
          },
          {
            id: "ms-2",
            label: "Step out to Sun Terrace",
            detail: "Direct sliding-glass access to the infinity sun deck.",
            yawDeg: 132,
            yPct: 55,
            targetRoomId: "ocean-terrace",
          },
          {
            id: "ms-3",
            label: "Vaulted Timber Ceiling",
            detail:
              "Cross-ventilated coastal roof pitch engineered for passive cooling.",
            yawDeg: 265,
            yPct: 28,
          },
        ],
      },
      {
        id: "ocean-terrace",
        name: "Ocean Terrace",
        subtitle: "Saltwater infinity edge & shaded teak loungers",
        image: TEAK_TERRACE_IMG,
        initialYaw: 88,
        hotspots: [
          {
            id: "ot-1",
            label: "Teak Loungers & Reef View",
            detail:
              "Unobstructed horizon views across turquoise shallows and outer islets.",
            yawDeg: 66,
            yPct: 58,
          },
          {
            id: "ot-2",
            label: "Return to Living Pavilion",
            detail: "Head back inside through the breezy linen-draped arch.",
            yawDeg: 145,
            yPct: 52,
            targetRoomId: "living-pavilion",
          },
          {
            id: "ot-3",
            label: "Private Villa Overview",
            detail: "Inspect the exterior coastal setting and pier approach.",
            yawDeg: 280,
            yPct: 50,
            targetRoomId: "villa-deck",
          },
        ],
      },
      {
        id: "villa-deck",
        name: "Sanctuary Exterior",
        subtitle: `${stayName} · ${area}`,
        image: gallery[0] || stayImage,
        initialYaw: 90,
        hotspots: [
          {
            id: "vd-1",
            label: "Coastal Architecture",
            detail:
              "Locally quarried sandstone and reclaimed teak tuned to the tropical climate.",
            yawDeg: 95,
            yPct: 46,
          },
          {
            id: "vd-2",
            label: "Enter Living Pavilion",
            detail: "Step inside the sunlit living sanctuary.",
            yawDeg: 255,
            yPct: 54,
            targetRoomId: "living-pavilion",
          },
        ],
      },
    ],
    [stayName, area, stayImage, gallery]
  );

  const [activeRoomId, setActiveRoomId] = useState(rooms[0].id);
  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) || rooms[0],
    [rooms, activeRoomId]
  );

  // Continuous yaw in degrees (0..360 wrapped seamlessly) and pitch (-12..12)
  const [yaw, setYaw] = useState(rooms[0].initialYaw);
  const [pitch, setPitch] = useState(0);
  const [zoom, setZoom] = useState(1.12);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [roomFading, setRoomFading] = useState(false);

  const velocityRef = useRef({ vx: 0, vy: 0 });
  const dragRef = useRef<{
    lastX: number;
    lastY: number;
    lastTime: number;
  } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    setActiveRoomId(rooms[0].id);
    setYaw(rooms[0].initialYaw);
    setPitch(0);
    setZoom(1.12);
    setAutoRotate(true);
    setActiveHotspotId(rooms[0].hotspots[0]?.id ?? null);
  }, [isOpen, rooms]);

  // Escape & Arrow keys
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setAutoRotate(false);
        setYaw((y) => y - 14);
      }
      if (e.key === "ArrowRight") {
        setAutoRotate(false);
        setYaw((y) => y + 14);
      }
      if (e.key === "ArrowUp") {
        setPitch((p) => Math.max(-12, p - 4));
      }
      if (e.key === "ArrowDown") {
        setPitch((p) => Math.min(12, p + 4));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Inertia + gentle 360 auto-sweep loop
  useEffect(() => {
    if (!isOpen) return;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      if (!isDragging) {
        const { vx, vy } = velocityRef.current;
        if (Math.abs(vx) > 0.08 || Math.abs(vy) > 0.08) {
          setYaw((y) => y + vx * dt * 60);
          setPitch((p) => Math.max(-12, Math.min(12, p + vy * dt * 60)));
          velocityRef.current.vx *= 0.92;
          velocityRef.current.vy *= 0.92;
        } else if (autoRotate) {
          setYaw((y) => y + 7.5 * dt);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, isDragging, autoRotate]);

  const switchRoom = useCallback(
    (roomId: string) => {
      const target = rooms.find((r) => r.id === roomId);
      if (!target || roomId === activeRoomId) return;
      setRoomFading(true);
      setActiveHotspotId(null);
      setTimeout(() => {
        setActiveRoomId(roomId);
        setYaw(target.initialYaw);
        setPitch(0);
        setActiveHotspotId(target.hotspots[0]?.id ?? null);
        setRoomFading(false);
      }, 220);
    },
    [rooms, activeRoomId]
  );

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    setAutoRotate(false);
    velocityRef.current = { vx: 0, vy: 0 };
    dragRef.current = {
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    const sensitivity = 0.22 / zoom;

    const deltaYaw = -dx * sensitivity;
    const deltaPitch = dy * sensitivity * 0.45;

    setYaw((y) => y + deltaYaw);
    setPitch((p) => Math.max(-12, Math.min(12, p + deltaPitch)));

    velocityRef.current = {
      vx: deltaYaw * 0.45,
      vy: deltaPitch * 0.35,
    };

    dragRef.current = {
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom((z) =>
      Math.max(1.0, Math.min(2.1, Number((z + delta).toFixed(2))))
    );
  };

  // Normalized 0..360 angle for compass & seamless panoramic strip
  const headingDeg = normalizeDeg(yaw);
  // 1 full 360° cycle spans 200% of strip width (photo + mirrored photo for zero seam).
  // We render a 400%-wide strip (2 cycles = 720°) and wrap offset into [0, -50%] of strip.
  const cycleFraction = headingDeg / 360; // 0..1
  const stripTranslatePct = -(cycleFraction * 50); // moves 0% -> -50% (exactly 1 full cycle of the 2-cycle strip)

  const selectedHotspot = activeRoom.hotspots.find(
    (h) => h.id === activeHotspotId
  );

  const cardinalLabel =
    headingDeg < 22.5 || headingDeg >= 337.5
      ? "N"
      : headingDeg < 67.5
        ? "NE"
        : headingDeg < 112.5
          ? "E"
          : headingDeg < 157.5
            ? "SE"
            : headingDeg < 202.5
              ? "S"
              : headingDeg < 247.5
                ? "SW"
                : headingDeg < 292.5
                  ? "W"
                  : "NW";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`360-degree virtual tour of ${stayName}`}
      className="fixed inset-0 z-[680] flex items-center justify-center p-3 sm:p-6"
      style={{
        backgroundColor: "rgba(10, 28, 30, 0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="animate-popover relative flex w-full max-w-[1060px] flex-col overflow-hidden rounded-[22px] border border-[#40c4aa]/35 bg-[#0e2022] text-[#fdfaf6]"
        style={{
          height: "min(720px, 90vh)",
          boxShadow: "0 30px 90px rgba(6, 20, 22, 0.55)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#112426]/90 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#40c4aa]/20 text-[#40c4aa]">
              <Eye className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl text-[#fdfaf6]">
                  {stayName}
                </h3>
                <span className="text-xs font-semibold text-[#40c4aa]">
                  · 360° Interior Tour
                </span>
              </div>
              <p className="text-[11.5px] text-white/70">
                {activeRoom.name} — {activeRoom.subtitle}
              </p>
            </div>
          </div>

          {/* Live 360° Compass Heading */}
          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/90 md:flex">
            <Compass className="h-3.5 w-3.5 text-[#40c4aa]" />
            <span className="tabular-nums font-semibold">
              {Math.round(headingDeg)}° {cardinalLabel}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/65">Drag to look around</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoRotate((a) => !a)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                autoRotate
                  ? "border-[#40c4aa] bg-[#40c4aa]/20 text-[#e0f7f4]"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {autoRotate ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>Auto-Sweep</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>Auto-Sweep</span>
                </>
              )}
            </button>

            <button
              type="button"
              aria-label="Close virtual tour"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-[#40c4aa] hover:text-[#0d2426]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 360° Interactive Panoramic Viewport */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={`relative flex-1 overflow-hidden select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Panoramic Zoom + Pitch Container */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              opacity: roomFading ? 0.15 : 1,
              transform: `scale(${zoom}) translate3d(0, ${pitch * 1.1}%, 0)`,
              transition: isDragging
                ? "opacity 0.22s ease"
                : "transform 0.25s ease-out, opacity 0.22s ease",
            }}
          >
            {/* 400%-wide seamless 720° strip (2x 360° cycles of [normal + mirrored]) */}
            <div
              className="relative flex h-full w-[400%] will-change-transform"
              style={{
                transform: `translate3d(${stripTranslatePct}%, 0, 0)`,
              }}
            >
              {[
                { key: "c1-a", mirror: false },
                { key: "c1-b", mirror: true },
                { key: "c2-a", mirror: false },
                { key: "c2-b", mirror: true },
              ].map((panel) => (
                <div key={panel.key} className="relative h-full w-1/4 shrink-0">
                  <img
                    src={activeRoom.image}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{
                      transform: panel.mirror ? "scaleX(-1)" : "none",
                    }}
                  />
                </div>
              ))}

              {/* Hotspots rendered across both cycles so they stay visible across the 360° seam */}
              {[0, 360].map((cycleOffset) =>
                activeRoom.hotspots.map((hs) => {
                  const leftPct = ((hs.yawDeg + cycleOffset) / 720) * 100;
                  const isActive = activeHotspotId === hs.id;
                  const isPortal = Boolean(hs.targetRoomId);

                  return (
                    <button
                      key={`${hs.id}-${cycleOffset}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hs.targetRoomId) {
                          switchRoom(hs.targetRoomId);
                        } else {
                          setActiveHotspotId((cur) =>
                            cur === hs.id ? null : hs.id
                          );
                        }
                      }}
                      style={{
                        left: `${leftPct}%`,
                        top: `${hs.yPct}%`,
                      }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    >
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform duration-200 group-hover:scale-105 ${
                          isPortal
                            ? "border border-[#40c4aa] bg-[#112426]/88 text-[#fdfaf6]"
                            : isActive
                              ? "bg-[#40c4aa] text-[#0d2426]"
                              : "border border-white/50 bg-[#fdfaf6]/90 text-[#112426]"
                        }`}
                      >
                        {isPortal ? (
                          <ArrowRight className="h-3.5 w-3.5 text-[#40c4aa]" />
                        ) : (
                          <Sparkles className="h-3 w-3 text-[#158b76]" />
                        )}
                        <span className="whitespace-nowrap">{hs.label}</span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Subtle top/bottom vignette for HUD legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,32,34,0.35) 0%, transparent 22%, transparent 74%, rgba(14,32,34,0.72) 100%)",
            }}
          />

          {/* Selected Hotspot Info Card (bottom-left) */}
          {selectedHotspot && (
            <div
              className="animate-popover pointer-events-auto absolute bottom-4 left-4 z-20 max-w-[320px] rounded-2xl border border-[#40c4aa]/35 p-3.5 text-[#112426] shadow-[0_14px_38px_rgba(0,0,0,0.35)]"
              style={{
                backgroundColor: "rgba(253, 250, 246, 0.94)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#112426]">
                  {selectedHotspot.label}
                </span>
                <button
                  type="button"
                  aria-label="Dismiss hotspot note"
                  onClick={() => setActiveHotspotId(null)}
                  className="rounded-full p-1 text-[#425a5d] hover:bg-[#e0f7f4]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#425a5d]">
                {selectedHotspot.detail}
              </p>
            </div>
          )}

          {/* Zoom & Reset HUD (bottom-right) */}
          <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-1 rounded-xl border border-white/20 bg-[#112426]/85 p-1 backdrop-blur-md">
            <button
              type="button"
              aria-label="Zoom out 360 view"
              onClick={() =>
                setZoom((z) => Math.max(1.0, Number((z - 0.2).toFixed(2))))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/15"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[40px] text-center text-[11px] font-semibold tabular-nums text-white/85">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              aria-label="Zoom in 360 view"
              onClick={() =>
                setZoom((z) => Math.min(2.1, Number((z + 0.2).toFixed(2))))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/15"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <span className="mx-0.5 h-4 w-px bg-white/15" />
            <button
              type="button"
              aria-label="Reset camera angle"
              onClick={() => {
                setYaw(activeRoom.initialYaw);
                setPitch(0);
                setZoom(1.12);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#40c4aa] hover:bg-white/15"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Room Switcher Strip */}
        <div className="z-20 flex items-center gap-2.5 overflow-x-auto border-t border-white/10 bg-[#112426]/95 px-5 py-3">
          {rooms.map((room) => {
            const isCurrent = room.id === activeRoomId;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => switchRoom(room.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-1.5 text-left transition-all ${
                  isCurrent
                    ? "border-[#40c4aa] bg-[#e0f7f4] text-[#112426]"
                    : "border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                }`}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-8 w-12 rounded-md object-cover"
                />
                <div>
                  <div className="text-xs font-semibold leading-tight">
                    {room.name}
                  </div>
                  <div
                    className={`text-[10.5px] ${
                      isCurrent ? "text-[#158b76]" : "text-white/60"
                    }`}
                  >
                    360° View
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
