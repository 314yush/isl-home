import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import StoryCard from "@/components/StoryCard";
import { STORIES } from "@/lib/stories";
export const metadata: Metadata = { title: "Stories & guides" };
export default function Stories() {
  return (
    <>
      <PageBanner
        eyebrow="Beyond the ninety"
        title="From the stands."
        description="The places, people and rituals that make the game ours. Original guides and perspectives from Maidan."
      />
      <main className="shell py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {STORIES.map((s) => (
            <StoryCard story={s} key={s.slug} />
          ))}
        </div>
        <section className="mt-16 pt-8 border-t border-line">
          <h2 className="section-title mb-4">Around the game</h2>
          <p className="text-mute text-sm mb-6">
            For reporting and breaking news, visit these independent publishers.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              [
                "Khel Now",
                "https://khelnow.com/football/indian-super-league",
                "News & transfers",
              ],
              [
                "The Bridge",
                "https://thebridge.in/football",
                "Indian football coverage",
              ],
              [
                "Sportstar",
                "https://sportstar.thehindu.com/football/indian-football/",
                "Reports & analysis",
              ],
            ].map(([name, url, desc]) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-6 hover:border-ind"
              >
                <p className="eyebrow text-mute">{desc}</p>
                <h3 className="d text-3xl mt-3">{name} ↗</h3>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
