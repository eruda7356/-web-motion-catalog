export function LeafMotif({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="16" fill="#E6EFE7" />
      <path d="M11 24C11 16 17 11 25 11C25 19 20 24 11 24Z" fill="#7DA083" />
      <path
        d="M11 24C14.5 20.5 18 17 22 14"
        stroke="#FFFDF9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HouseMotif() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="16" fill="#F4E8DD" />
      <path
        d="M9 18L18 10.5L27 18"
        stroke="#B67653"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="12" y="17.5" width="12" height="9" rx="1.5" fill="#D59A78" />
      <rect x="16" y="21" width="4" height="5.5" rx="0.8" fill="#FFFDF9" />
    </svg>
  );
}
