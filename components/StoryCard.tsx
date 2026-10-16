/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { photo } from "@/lib/assets";
import type { Story } from "@/lib/stories";
export default function StoryCard({ story }: { story: Story }) {
  const img = photo(story.image);
  return (
    <article className="story-card">
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="story-image">
          {img && <img src={img.src} alt="" loading="lazy" />}
        </div>
        <div className="pt-5">
          <p className="eyebrow text-[#b94322]">{story.category}</p>
          <h3>{story.title}</h3>
          <p className="text-sm leading-relaxed text-mute">{story.excerpt}</p>
          <p className="mt-4 text-[11px] text-mute">
            Maidan editorial <span className="mx-2">/</span> {story.readTime}
          </p>
        </div>
      </Link>
    </article>
  );
}
