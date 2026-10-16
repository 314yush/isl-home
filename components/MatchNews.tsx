import type { Match, MatchPreview } from "@/lib/types";
import { relatedReading } from "@/lib/match-context";

export default function MatchNews({
  match,
  preview,
}: {
  match: Match;
  preview?: MatchPreview;
}) {
  const news = relatedReading(match, preview?.news);
  return (
    <section
      className="lg:col-span-2 border-t border-line pt-5 pb-8"
      aria-labelledby="news"
    >
      <h2 id="news" className="d text-[24px] mb-3">
        News &amp; stories
      </h2>
      {news.length ? (
        <div className="grid md:grid-cols-3 gap-x-6 gap-y-4">
          {news.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-line pb-3"
            >
              <p className="text-[10px] text-mute mb-1">
                {article.source} ·{" "}
                {new Intl.DateTimeFormat("en-IN", {
                  day: "numeric",
                  month: "short",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(article.published))}
              </p>
              <h3 className="text-sm font-semibold group-hover:text-org">
                {article.title} ↗
              </h3>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-mute">
          No recent fixture-related articles available yet.
        </p>
      )}
    </section>
  );
}
