export default function CubeGridBg({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-cube-grid bg-cube-size opacity-70 ${className}`}
    />
  );
}
