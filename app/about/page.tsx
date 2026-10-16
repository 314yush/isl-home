import PageBanner from "@/components/PageBanner";
import Link from "next/link";
export const metadata = { title: "About Maidan" };
export default function About() {
  return (
    <>
      <PageBanner
        eyebrow="Independent. Fan-powered."
        title="Our game. Our ground."
        description="Maidan is a home for people who care about Indian football. Built from the stands, for the stands."
      />
      <main className="shell py-12 grid md:grid-cols-[1.5fr_1fr] gap-16">
        <article className="article-body">
          <h2>A place to follow your football</h2>
          <p>
            Find fixtures, results, league standings and club squads in one
            place. Explore the match centre, save your favourite club and
            discover the people and places around the game.
          </p>
          <h2>Independent by design</h2>
          <p>
            We are a fan-run, non-commercial project. Maidan is not affiliated
            with the Indian Super League, AIFF or any club. There are no ads or
            paid memberships.
          </p>
          <h2>Clear about our data</h2>
          <p>
            Football data comes from ESPN’s public feed. Updates can be delayed
            or unavailable; we show a notice when we serve an older copy.
            Confirm venue, ticketing and broadcast details with official club or
            competition channels before making plans.
          </p>
          <h2>Your club stays with you</h2>
          <p>
            Your favourite club is saved in this browser. No account is needed
            and the preference is not uploaded to a server. You can change or
            remove it in My club.
          </p>
        </article>
        <aside>
          <div className="bg-ind text-white p-8">
            <p className="eyebrow text-org">Start here</p>
            <h2 className="d text-5xl my-5">
              Find your
              <br />
              football.
            </h2>
            <div className="grid gap-4 text-sm">
              {[
                ["Explore the clubs", "/clubs"],
                ["Find a match", "/matches"],
                ["Read the stories", "/stories"],
                ["Image credits", "/credits"],
              ].map(([t, h]) => (
                <Link
                  key={h}
                  href={h}
                  className="border-t border-white/20 pt-4"
                >
                  {t} →
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
