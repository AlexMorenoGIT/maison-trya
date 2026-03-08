"use client";

interface ImagePlaceholderProps {
  aspect?: "portrait" | "landscape" | "square" | "wide";
  seed?: number;
  className?: string;
  overlay?: boolean;
}

const aspectRatios = {
  portrait: "3 / 4",
  landscape: "4 / 3",
  square: "1 / 1",
  wide: "16 / 9",
};

const gradientColors = [
  "#C4A882", // sable
  "#754926", // rubber
  "#3C2413", // tortoise
  "#D3AC58", // gold
  "#2B2B28", // dark
];

const directions = [
  "135deg",
  "180deg",
  "225deg",
  "160deg",
  "200deg",
  "145deg",
];

export default function ImagePlaceholder({
  aspect = "portrait",
  seed = 0,
  className = "",
  overlay = false,
}: ImagePlaceholderProps) {
  const idx = Math.abs(seed) % gradientColors.length;
  const dir = directions[Math.abs(seed) % directions.length];
  const c1 = gradientColors[idx];
  const c2 = gradientColors[(idx + 2) % gradientColors.length];
  const c3 = gradientColors[(idx + 4) % gradientColors.length];

  const gradient = `linear-gradient(${dir}, ${c1} 0%, ${c2} 55%, ${c3} 100%)`;

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: aspectRatios[aspect] }}
    >
      <div
        className="absolute inset-0"
        style={{ background: gradient }}
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/20" />
      )}
    </div>
  );
}
