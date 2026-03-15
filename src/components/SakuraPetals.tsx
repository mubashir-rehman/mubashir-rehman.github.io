import { useTheme } from "@/components/ThemeProvider";

const PETALS = [
  { id: 0,  left: 27,  size: 17.2, duration: 9.9,  delay: 7.7,  drift: 97,  rotate: 185, opacity: 0.64 },
  { id: 1,  left: 86,  size: 8.3,  duration: 9.7,  delay: 4.9,  drift: 85,  rotate: 192, opacity: 0.55 },
  { id: 2,  left: 95,  size: 9.1,  duration: 14.4, delay: 2.0,  drift: 86,  rotate: 15,  opacity: 0.54 },
  { id: 3,  left: 46,  size: 12.1, duration: 9.8,  delay: 3.9,  drift: 123, rotate: 231, opacity: 0.60 },
  { id: 4,  left: 93,  size: 14.9, duration: 10.0, delay: 0.8,  drift: 41,  rotate: 66,  opacity: 0.71 },
  { id: 5,  left: 47,  size: 12.6, duration: 12.4, delay: 2.9,  drift: 52,  rotate: 169, opacity: 0.71 },
  { id: 6,  left: 41,  size: 10.4, duration: 14.3, delay: 8.5,  drift: 102, rotate: 153, opacity: 0.69 },
  { id: 7,  left: 76,  size: 13.4, duration: 8.8,  delay: 2.9,  drift: 44,  rotate: 188, opacity: 0.74 },
  { id: 8,  left: 81,  size: 12.0, duration: 11.2, delay: 4.3,  drift: 124, rotate: 197, opacity: 0.60 },
  { id: 9,  left: 12,  size: 11.6, duration: 15.5, delay: 7.0,  drift: 98,  rotate: 237, opacity: 0.75 },
  { id: 10, left: 79,  size: 14.0, duration: 14.0, delay: 2.5,  drift: 129, rotate: 167, opacity: 0.74 },
  { id: 11, left: 77,  size: 17.6, duration: 15.7, delay: 1.1,  drift: 46,  rotate: 206, opacity: 0.66 },
  { id: 12, left: 33,  size: 13.3, duration: 12.6, delay: 9.0,  drift: 144, rotate: 154, opacity: 0.58 },
  { id: 13, left: 63,  size: 12.3, duration: 8.9,  delay: 3.0,  drift: 130, rotate: 347, opacity: 0.52 },
  { id: 14, left: 49,  size: 11.4, duration: 10.0, delay: 3.0,  drift: 64,  rotate: 312, opacity: 0.69 },
  { id: 15, left: 100, size: 14.9, duration: 15.8, delay: 2.6,  drift: 111, rotate: 45,  opacity: 0.59 },
  { id: 16, left: 5,   size: 17.2, duration: 11.9, delay: 3.4,  drift: 67,  rotate: 64,  opacity: 0.78 },
  { id: 17, left: 99,  size: 16.6, duration: 15.6, delay: 6.5,  drift: 93,  rotate: 150, opacity: 0.50 },
];

export default function SakuraPetals() {
  const { theme } = useTheme();
  if (theme !== "sakura") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {PETALS.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-60px",
            left: `${p.left}%`,
            opacity: p.opacity,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite,
                        petal-sway ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.5}
            viewBox="0 0 20 28"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${p.rotate}deg)` }}
          >
            <ellipse cx="10" cy="14" rx="8" ry="13" fill="#F2A0B8" opacity="0.9" />
            <ellipse cx="8" cy="10" rx="3" ry="6" fill="#FDD0DF" opacity="0.5" />
            <line x1="10" y1="3" x2="10" y2="25"
                  stroke="#E8759A" strokeWidth="0.5" opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );
}
