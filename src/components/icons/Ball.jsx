export function Ball({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
