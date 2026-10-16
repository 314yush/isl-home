import Link from "next/link";
export default function NotFound() {
  return (
    <main className="shell py-24 text-center">
      <p className="eyebrow text-mute mb-6">404 · Out of play</p>
      <h1 className="d text-[64px] md:text-[96px]">This one’s gone wide.</h1>
      <p className="text-mute mt-6 mb-8">
        We couldn’t find that page. Let’s get you back to the game.
      </p>
      <Link href="/" className="btn btn-dark">
        Back to Maidan →
      </Link>
    </main>
  );
}
