/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STORIES, storyBySlug } from "@/lib/stories";
import { photo } from "@/lib/assets";
import StoryCard from "@/components/StoryCard";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return STORIES.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = storyBySlug((await params).slug);
  return { title: s?.title ?? "Story", description: s?.excerpt };
}
export default async function Story({ params }: Props) {
  const s = storyBySlug((await params).slug);
  if (!s) notFound();
  const img = photo(s.image);
  return (
    <main>
      <div className="shell py-10 md:py-16">
        <Link href="/stories" className="text-link text-mute">
          ← All stories
        </Link>
        <div className="max-w-4xl mt-10">
          <p className="eyebrow text-[#b94322] mb-5">{s.category}</p>
          <h1 className="d text-[56px] md:text-[88px]">{s.title}</h1>
          <p className="text-xl text-mute mt-6 max-w-2xl leading-relaxed">
            {s.excerpt}
          </p>
          <p className="text-xs text-mute mt-7">
            Maidan editorial · {s.readTime}
          </p>
        </div>
      </div>
      {img && (
        <figure className="shell">
          <img
            src={img.src}
            alt="Indian football stadium and supporters from the community photo archive"
            className="w-full aspect-[16/8] object-cover"
          />
          <figcaption className="text-[11px] text-mute mt-3">
            Archive photograph · {img.credit} ·{" "}
            <Link href="/credits" className="underline">
              Credits & licence
            </Link>
          </figcaption>
        </figure>
      )}
      <article className="shell">
        <div className="article-body max-w-[720px] mx-auto py-10">
          {s.sections.map((p) => (
            <section key={p.heading}>
              <h2>{p.heading}</h2>
              <p>{p.text}</p>
            </section>
          ))}
          <Link href="/clubs" className="btn btn-dark mt-6">
            Explore the clubs →
          </Link>
        </div>
      </article>
      <section className="shell border-t border-line pt-10">
        <h2 className="section-title mb-7">Keep exploring</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STORIES.filter((x) => x.slug !== s.slug).map((x) => (
            <StoryCard key={x.slug} story={x} />
          ))}
        </div>
      </section>
    </main>
  );
}
