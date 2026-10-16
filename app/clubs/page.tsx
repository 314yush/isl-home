import PageBanner from "@/components/PageBanner";
import ClubDirectory from "@/components/ClubDirectory";
export const metadata = { title: "The clubs" };
export default function Clubs() {
  return (
    <>
      <PageBanner
        eyebrow="Find your colours"
        title="A club. A city. A family."
        description="Discover the clubs, explore their squads and follow their journey. There’s a corner of the game for everyone."
      />
      <main className="shell py-10">
        <ClubDirectory />
      </main>
    </>
  );
}
