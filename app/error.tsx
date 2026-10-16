"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="shell py-24 text-center">
      <p className="eyebrow text-mute mb-5">A brief stoppage</p>
      <h1 className="d text-6xl">Let’s try that again.</h1>
      <p className="text-mute my-6">
        This page couldn’t load. Give it another go.
      </p>
      <button onClick={reset} className="btn btn-dark">
        Retry page →
      </button>
    </main>
  );
}
