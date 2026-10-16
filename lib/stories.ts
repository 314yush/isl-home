export type Story = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  sections: { heading: string; text: string }[];
};
export const STORIES: Story[] = [
  {
    slug: "a-game-that-belongs-to-everyone",
    category: "From the stands",
    title: "A game that belongs to all of us.",
    excerpt:
      "Different cities. Different colours. The same feeling when the ball hits the net. Welcome to your home for Indian football.",
    image: "salt_lake_stadium_indian_super_league_opener",
    readTime: "3 min read",
    sections: [
      {
        heading: "It starts long before kick-off",
        text: "A shirt laid out on a chair. A message in the group chat. The familiar walk towards the floodlights. Supporting a club is made of small rituals, repeated until they become a part of who you are. This is a space for those moments, and for the football that brings them together.",
      },
      {
        heading: "Every club has a place here",
        text: "You might follow the club in your city, the team your family introduced you to, or a side you discovered through a player. There is no entrance exam for belonging. Explore the club pages, follow their fixtures, and find the colours you want to stand behind.",
      },
      {
        heading: "Built from the stands",
        text: "Maidan is an independent fan project. Our aim is simple: make it easier to follow Indian football. Scores, fixtures and tables sit alongside guides to enjoying a matchday. We keep the source of our football data visible, credit our photographs, and tell you when an update is delayed.",
      },
    ],
  },
  {
    slug: "your-first-matchday",
    category: "Matchday guide",
    title: "Your first matchday starts here.",
    excerpt:
      "The shirt, the journey, the ninety minutes. A simple guide to making a day of it.",
    image: "fans_of_fc_goa_at_fatorda_stadium",
    readTime: "4 min read",
    sections: [
      {
        heading: "Start with the fixture",
        text: "Check the date, kick-off time and venue before making travel plans. Fixtures can move, so confirm the details with the club or official competition channels on the day. Times on Maidan are shown in Indian Standard Time.",
      },
      {
        heading: "Give yourself time",
        text: "Buy tickets through the club’s official ticketing links. Check the stadium’s entry rules, gate information and permitted items. Arriving early gives you time to find the right entrance, meet friends and watch the stands fill up.",
      },
      {
        heading: "Make room for everyone",
        text: "Follow steward instructions, keep aisles clear and respect the supporters around you. Ask before photographing someone up close. A good atmosphere is loud, welcoming and safe for people experiencing their very first game.",
      },
      {
        heading: "Take the feeling home",
        text: "Save your club on Maidan to find its fixtures quickly next time. Check the match centre for the result and the available match statistics. Then start planning the next one.",
      },
    ],
  },
  {
    slug: "reading-the-league-table",
    category: "The game explained",
    title: "More than a number. Reading the table.",
    excerpt:
      "Points, goal difference and form: the numbers that tell a season’s story.",
    image: "bengaluru_fc_vs_shillong_lajong_7_january_2017",
    readTime: "3 min read",
    sections: [
      {
        heading: "The essentials",
        text: "P is the number of matches played. W, D and L are wins, draws and losses. Teams receive three points for a win, one for a draw and none for a defeat. Points offer the quickest view of a club’s progress, but games played matter too.",
      },
      {
        heading: "What goal difference tells you",
        text: "GF is goals scored; GA is goals conceded. Goal difference subtracts GA from GF. It is a useful way to see the balance between a team’s attack and defence. The ordering of tied teams follows the competition’s rules and the source table, rather than a ranking invented by Maidan.",
      },
      {
        heading: "Look at the recent form",
        text: "The form strip shows recent completed matches, with the newest result at the right. A run of wins can signal momentum, but it does not tell you the strength of the opponents or the circumstances of those games. Open the fixtures to see the fuller picture.",
      },
    ],
  },
  {
    slug: "football-through-the-lens",
    category: "Photo essay",
    title: "The places we call home.",
    excerpt:
      "Floodlights, terraces and familiar views. Explore the grounds in our community photo collection.",
    image: "sree_kanteerava_stadium",
    readTime: "2 min read",
    sections: [
      {
        heading: "A ground is more than a pitch",
        text: "The view from a familiar stand becomes part of how you remember football. The colour of the seats, the approach from the street and the moment the lights come on all give a match its setting.",
      },
      {
        heading: "Seen by the community",
        text: "The photographs on Maidan come from a credited collection of community images. Some show earlier seasons and different moments in a ground’s history. They are used to celebrate the places and people around the game, rather than to depict a current match.",
      },
      {
        heading: "Explore the collection",
        text: "Visit our credits page to find the photographers, original sources and licence information behind the images. Club pages bring these views together with current fixtures and the available squad data.",
      },
    ],
  },
];
export const storyBySlug = (slug: string) =>
  STORIES.find((s) => s.slug === slug);
