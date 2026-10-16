import { getAllMatches } from "@/lib/data";
import PageBanner from "@/components/PageBanner";
import StaleBanner from "@/components/StaleBanner";
import AutoRefresh from "@/components/AutoRefresh";
import MatchExplorer from "@/components/MatchExplorer";
export const dynamic = "force-dynamic";
export const metadata = { title: "Fixtures & results" };
export default async function Matches() {
  const { matches, meta } = await getAllMatches();
  return (
    <>
      <AutoRefresh label={false} />
      <PageBanner
        eyebrow="The match centre"
        title="Every match. Every moment."
        description="Plan your next ninety minutes. Explore fixtures, follow live scores and catch up on results. All times in IST."
      />
      <StaleBanner meta={meta} empty={!matches.length} />
      <main className="shell max-w-[1100px] py-8">
        <aside
          className="mb-8 border border-line bg-[#e9ede6] p-5 md:p-6"
          aria-label="Match tickets"
        >
          <p className="eyebrow text-mute mb-2">Be there. In the stands.</p>
          <h2 className="d text-3xl">Make it a matchday.</h2>
          <p className="text-sm text-mute mt-2">
            Find District ticket links beside upcoming fixtures and inside each
            match centre. Verified listings open the event directly; other links
            search for that matchup.
          </p>
        </aside>
        <MatchExplorer matches={matches} />
      </main>
    </>
  );
}
