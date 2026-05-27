export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Корона */}
      <path
        d="M12 16L16 8L20 14L24 6L28 14L32 8L36 16L34 36H14L12 16Z"
        fill="#FF7A00"
        stroke="#1A1A1A"
        strokeWidth="1.5"
      />
      {/* Голова лева */}
      <circle cx="24" cy="28" r="10" fill="#FF7A00" stroke="#1A1A1A" strokeWidth="1.5" />
      {/* Грива */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={24 + 12 * Math.cos((angle * Math.PI) / 180)}
          y1={28 + 12 * Math.sin((angle * Math.PI) / 180)}
          x2={24 + 15 * Math.cos((angle * Math.PI) / 180)}
          y2={28 + 15 * Math.sin((angle * Math.PI) / 180)}
          stroke="#1A1A1A"
          strokeWidth="2"
        />
      ))}
      {/* Очі */}
      <circle cx="20" cy="27" r="1.5" fill="#1A1A1A" />
      <circle cx="28" cy="27" r="1.5" fill="#1A1A1A" />
      {/* Ніс */}
      <path d="M23 30L24 31L25 30" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      {/* Рот */}
      <path d="M21 33Q24 36 27 33" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
