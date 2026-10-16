export default function Loading() {
  return (
    <main
      className="shell py-16"
      aria-busy="true"
      aria-label="Loading football content"
    >
      <p className="eyebrow text-mute mb-6">Getting the game ready</p>
      <div className="h-14 bg-line w-2/3 mb-8 animate-pulse" />
      <div className="grid md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 bg-line animate-pulse" />
        ))}
      </div>
      <p className="sr-only" role="status">
        Loading…
      </p>
    </main>
  );
}
