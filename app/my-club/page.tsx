import { getAllMatches } from "@/lib/data";
import FavouriteClub from "@/components/FavouriteClub";
import PageBanner from "@/components/PageBanner";
import AutoRefresh from "@/components/AutoRefresh";
import StaleBanner from "@/components/StaleBanner";
export const dynamic = "force-dynamic";
export const metadata = { title: "My club" };
export default async function MyClub() {
  const { matches, meta } = await getAllMatches();
  return (
    <>
      <AutoRefresh label={false} />
      <PageBanner
        eyebrow="Your colours. Your corner."
        title="This one’s personal."
        description="Your next match, your latest result, your club. Choose the badge that means something to you."
      />
      <StaleBanner meta={meta} />
      <main className="shell py-10">
        <FavouriteClub matches={matches} />
      </main>
    </>
  );
}
