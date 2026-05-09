export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      style={{
        margin: "48px auto",
        height: 4,
        width: "min(160px, 36vw)",
        borderRadius: 2,
        background: "var(--neutral-alpha-medium, rgba(128,128,128,0.28))",
      }}
    />
  );
}
