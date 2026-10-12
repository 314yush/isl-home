/**
 * SINGLE MAP of every third-party image on the site.
 * Takedown / swap = edit or delete one entry here (missing entries fall back to
 * monograms, initials or gradient blocks automatically). Credits page + CREDITS.md read this.
 */
export type Asset = { src: string; credit?: string; license?: string; source?: string; owner?: string };

export const LEAGUE_LOGO: Asset | null = {
  "src": "/brand/isl-logo.svg",
  "credit": "Wikimedia Commons",
  "license": "CC BY-SA 4.0 (as tagged on Commons; mark belongs to FSDL/AIFF)",
  "source": "https://commons.wikimedia.org/wiki/File:AlFF_MG_Indian_Super_League_2026-27.svg"
};

/** keyed by club slug (lib/clubs.ts) */
export const CRESTS: Record<string, Asset> = {
  "bengaluru-fc": {
    "src": "/crests/bengaluru-fc.svg",
    "source": "https://en.wikipedia.org/wiki/File:Bengaluru_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "chennaiyin-fc": {
    "src": "/crests/chennaiyin-fc.svg",
    "source": "https://en.wikipedia.org/wiki/File:Chennaiyin_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "churchill-brothers": {
    "src": "/crests/churchill-brothers.svg",
    "source": "https://en.wikipedia.org/wiki/File:Churchill_Brothers.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "fc-goa": {
    "src": "/crests/fc-goa.svg",
    "source": "https://en.wikipedia.org/wiki/File:FC_Goa_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "inter-kashi": {
    "src": "/crests/inter-kashi.svg",
    "source": "https://en.wikipedia.org/wiki/File:Inter_Kashi_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "kerala-blasters": {
    "src": "/crests/kerala-blasters.svg",
    "source": "https://en.wikipedia.org/wiki/File:Kerala_Blasters_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "mohun-bagan-sg": {
    "src": "/crests/mohun-bagan-sg.svg",
    "source": "https://en.wikipedia.org/wiki/File:Mohun_Bagan_A.C._logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "mumbai-city": {
    "src": "/crests/mumbai-city.png",
    "source": "https://en.wikipedia.org/wiki/File:Mumbai_City_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "northeast-united": {
    "src": "/crests/northeast-united.svg",
    "source": "https://en.wikipedia.org/wiki/File:NorthEast_United_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "odisha-fc": {
    "src": "/crests/odisha-fc.svg",
    "source": "https://en.wikipedia.org/wiki/File:Odisha_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "punjab-fc": {
    "src": "/crests/punjab-fc.svg",
    "source": "https://en.wikipedia.org/wiki/File:Punjab_FC_2025_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "east-bengal": {
    "src": "/crests/east-bengal.svg",
    "source": "https://en.wikipedia.org/wiki/File:East_Bengal_FC_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  },
  "sc-delhi": {
    "src": "/crests/sc-delhi.svg",
    "source": "https://en.wikipedia.org/wiki/File:SC_Delhi_logo.svg",
    "license": "Non-free logo (used for identification; hosted on English Wikipedia under fair use)",
    "owner": "the club"
  }
};

/** photo library */
export const PHOTOS: Record<string, Asset> = {
  "salt_lake_stadium_indian_super_league_opener": {
    "src": "/photos/salt_lake_stadium_indian_super_league_opener.jpg",
    "credit": "ArsenalFan700 / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Salt_Lake_Stadium_Indian_Super_League_Opener.jpg"
  },
  "jewharlal_nehru_stadium_kochi_isl_2016_final": {
    "src": "/photos/jewharlal_nehru_stadium_kochi_isl_2016_final.jpg",
    "credit": "ArsenalFan700 / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Jewharlal_Nehru_Stadium_Kochi_ISL_2016_Final.jpg"
  },
  "kolkata_derby": {
    "src": "/photos/kolkata_derby.jpg",
    "credit": "ArnabSaha / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kolkata_Derby.jpg"
  },
  "fans_of_fc_goa_at_fatorda_stadium": {
    "src": "/photos/fans_of_fc_goa_at_fatorda_stadium.jpg",
    "credit": "Donkey335 / Wikimedia Commons",
    "license": "CC-BY-SA-4.0",
    "source": "https://en.wikipedia.org/wiki/File:Fans_of_FC_Goa_at_Fatorda_Stadium.jpg"
  },
  "sree_kanteerava_stadium": {
    "src": "/photos/sree_kanteerava_stadium.jpg",
    "credit": "KshitizBathwal / Skyscape Photography / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sree_Kanteerava_Stadium.jpg"
  },
  "bengaluru_fc_vs_shillong_lajong_7_january_2017": {
    "src": "/photos/bengaluru_fc_vs_shillong_lajong_7_january_2017.jpg",
    "credit": "Coderzombie / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Bengaluru_FC_vs_Shillong_Lajong,_7_January_2017.jpg"
  },
  "mumbai_football_arena": {
    "src": "/photos/mumbai_football_arena.jpg",
    "credit": "ArsenalFan700 / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Mumbai_Football_Arena.jpg"
  },
  "nehru_stadium_chennai": {
    "src": "/photos/nehru_stadium_chennai.jpg",
    "credit": "ArsenalFan700 / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Nehru_Stadium_Chennai.jpg"
  },
  "fatorda_stadium_goa": {
    "src": "/photos/fatorda_stadium_goa.jpg",
    "credit": "Donkey335 / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Fatorda_Stadium,_Goa.jpg"
  },
  "sarusajai2": {
    "src": "/photos/sarusajai2.jpg",
    "credit": "Phukan / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sarusajai2.jpg"
  },
  "ambedkar_stadium_in_delhi_at_morning": {
    "src": "/photos/ambedkar_stadium_in_delhi_at_morning.jpg",
    "credit": "Bill william compton at en.wikipedia / Wikimedia Commons",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ambedkar_stadium_in_delhi_at_morning.jpg"
  },
  "kalinga_stadium_during_isl": {
    "src": "/photos/kalinga_stadium_during_isl.jpg",
    "credit": "Government of Odisha / Wikimedia Commons",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kalinga_Stadium_during_ISL.jpg"
  },
  "east_bengal_club_supporters_at_the_salt_lake_stadium": {
    "src": "/photos/east_bengal_club_supporters_at_the_salt_lake_stadium.jpg",
    "credit": "Billjones94 / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:East_Bengal_Club_supporters_at_the_Salt_Lake_Stadium.jpg"
  },
  "panoramic_jawaharlal_nehru_stadium_new_delhi": {
    "src": "/photos/panoramic_jawaharlal_nehru_stadium_new_delhi.jpg",
    "credit": "HARSH RAWAT / Wikimedia Commons",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Panoramic_Jawaharlal_Nehru_Stadium,_New_Delhi.jpg"
  }
};

/** club slug -> PHOTOS key, used for club heroes and match heroes (home side) */
export const CLUB_HERO: Record<string, string> = {
  "bengaluru-fc": "bengaluru_fc_vs_shillong_lajong_7_january_2017",
  "chennaiyin-fc": "nehru_stadium_chennai",
  "churchill-brothers": "fatorda_stadium_goa",
  "fc-goa": "fans_of_fc_goa_at_fatorda_stadium",
  "inter-kashi": "salt_lake_stadium_indian_super_league_opener",
  "kerala-blasters": "jewharlal_nehru_stadium_kochi_isl_2016_final",
  "mohun-bagan-sg": "kolkata_derby",
  "mumbai-city": "mumbai_football_arena",
  "northeast-united": "sarusajai2",
  "odisha-fc": "kalinga_stadium_during_isl",
  "punjab-fc": "panoramic_jawaharlal_nehru_stadium_new_delhi",
  "east-bengal": "east_bengal_club_supporters_at_the_salt_lake_stadium",
  "sc-delhi": "ambedkar_stadium_in_delhi_at_morning"
};

/** home-page / news card images (PHOTOS keys) */
export const NEWS_IMAGES: string[] = ["kolkata_derby", "salt_lake_stadium_indian_super_league_opener", "jewharlal_nehru_stadium_kochi_isl_2016_final"];
export const DEFAULT_HERO = "salt_lake_stadium_indian_super_league_opener";

/** keyed by ESPN athlete id */
export const PLAYERS: Record<string, Asset> = {
  "237399": {
    "src": "/players/237399.jpg",
    "credit": "Mehdi Zare / Wikimedia",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Gurpreet_Singh_Sandhu_2019_AFC_Asian_Cup.jpg"
  },
  "159247": {
    "src": "/players/159247.jpg",
    "credit": "Biser Todorov / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Menno_Koch_2021.jpg"
  },
  "111682": {
    "src": "/players/111682.jpg",
    "credit": "President's Secretariat / Wikimedia",
    "license": "GODL-India",
    "source": "https://commons.wikimedia.org/wiki/File:The_President,_Shri_Ram_Nath_Kovind_presenting_the_Major_Dhyan_Chand_Khel_Ratna_Award,_2021_to_Shri_Sunil_Chhetri_for_Football,_at_Rashtrapati_Bhavan,_in_New_Delhi_on_13_November_2021_(cropped).jpg"
  },
  "268080": {
    "src": "/players/268080.jpg",
    "credit": "Ken Tony / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ashique_Kuruniyan.jpg"
  },
  "131756": {
    "src": "/players/131756.jpg",
    "credit": "Dfotev / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Nuno_reis.jpg"
  },
  "319986": {
    "src": "/players/319986.jpg",
    "credit": "FC Olympic Donetsk / Wikimedia",
    "license": "CC BY 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Dramane_Salou.png"
  },
  "226903": {
    "src": "/players/226903.jpg",
    "credit": "Mehdi Zare / Wikimedia",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sandesh_Jjhingan_2019_AFC_AsianCup.jpg"
  },
  "235238": {
    "src": "/players/235238.jpg",
    "credit": "Mehdi Zare / Wikimedia",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Uddanta_Singh_2019.jpg"
  },
  "300035": {
    "src": "/players/300035.jpg",
    "credit": "Morankutan / Wikimedia",
    "license": "CC0",
    "source": "https://commons.wikimedia.org/wiki/File:Hormipam_2024.jpg"
  },
  "144861": {
    "src": "/players/144861.jpg",
    "credit": "Sonu Shaji01 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Adrian_Luna_Kerala_(cropped).jpg"
  },
  "191230": {
    "src": "/players/191230.jpg",
    "credit": "Tadeáš Bednarz / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Neboj%C5%A1a_Kosovi%C4%87,_Czech_Rp.-Montenegro_EURO_2020_QR_10-06-2019_(3).jpg"
  },
  "256566": {
    "src": "/players/256566.jpg",
    "credit": "Дмитрий Пукалик / Wikimedia",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Momo_Yansan%C3%A9_2022.jpg"
  },
  "227975": {
    "src": "/players/227975.jpg",
    "credit": "Indianfootballfan29 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Rahul_Bheke_-_Mumbai_City_FC_-_2023.png"
  },
  "268007": {
    "src": "/players/268007.jpg",
    "credit": "Mehdi Zare / Wikimedia",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:India_NT_at_2019_AFC_Asian_Cup_(cropped).jpg"
  },
  "246791": {
    "src": "/players/246791.jpg",
    "credit": "Mehdi Zare / Wikimedia",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Anirudh_Thapa_2019_(cropped).jpg"
  },
  "269107": {
    "src": "/players/269107.jpg",
    "credit": "WhiteFalcon1 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sahal_Abdul_Samad.jpg"
  },
  "243306": {
    "src": "/players/243306.jpg",
    "credit": "Aman789101 / Wikimedia",
    "license": "CC0",
    "source": "https://commons.wikimedia.org/wiki/File:Lallianzuala-Chhangte-1-scaled.jpg"
  },
  "311688": {
    "src": "/players/311688.jpg",
    "credit": "Indianfootballfan29 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ahan_Prakash.png"
  },
  "195219": {
    "src": "/players/195219.jpg",
    "credit": "Biser  Todorov (User:Biso) from Sofia, Bulgaria / Wikimedia",
    "license": "CC BY-SA 2.0",
    "source": "https://commons.wikimedia.org/wiki/File:FK_Partizan_Belgrade_(51100339164)_(cropped).jpg"
  },
  "3144473": {
    "src": "/players/3144473.jpg",
    "credit": "Alfranca / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Carlos-Delgado-1.jpg"
  },
  "180171": {
    "src": "/players/180171.jpg",
    "credit": "Giovanni Batista Rodriguez from San Sebastian-Donostia, España / Wikimedia",
    "license": "CC BY-SA 2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sergio_Llamas_Pardo.jpg"
  },
  "419126": {
    "src": "/players/419126.jpg",
    "credit": "Drakovo / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ishaanshishodiavsnepal.jpg"
  },
  "282523": {
    "src": "/players/282523.jpg",
    "credit": "Indianfootballfan29 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Vikram_Partap_Singh.png"
  },
  "3144476": {
    "src": "/players/3144476.jpg",
    "credit": "Litexfan / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Wilmar_Jord%C3%A1n_Gil_1_(cropped).JPG"
  },
  "232717": {
    "src": "/players/232717.jpg",
    "credit": "Dfotev / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Stephen_eze.jpg"
  },
  "351185": {
    "src": "/players/351185.jpg",
    "credit": "Ken Tony / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Nihal_Sudeesh_with_Kerala_Blasters_FC_(cropped).jpg"
  },
  "418984": {
    "src": "/players/418984.jpg",
    "credit": "SaUp2014 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kartik_Hantal_with_Odisha_FC_(2026).png"
  },
  "3144523": {
    "src": "/players/3144523.jpg",
    "credit": "Henriklars / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Suhair_vp.jpg"
  },
  "266622": {
    "src": "/players/266622.jpg",
    "credit": "Prime Minister's Office / Wikimedia",
    "license": "GODL-India",
    "source": "https://commons.wikimedia.org/wiki/File:Ninthoinganba_Meetei_U17.jpg"
  },
  "206760": {
    "src": "/players/206760.jpg",
    "credit": "Biso / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Nacho_Monsalve.jpg"
  },
  "207280": {
    "src": "/players/207280.jpg",
    "credit": "Klapi / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Dani_Ram%C3%ADrez_Lech_Pozna%C5%84_2022_rozgrzewka_(cropped)_(cropped).jpg"
  },
  "227892": {
    "src": "/players/227892.jpg",
    "credit": "KevinOwens02 (talk) (Uploads) / Wikimedia",
    "license": "CC-BY-SA-4.0",
    "source": "https://en.wikipedia.org/wiki/File:SouvikChakrabarti.jpeg"
  },
  "266615": {
    "src": "/players/266615.jpg",
    "credit": "Sonu Shaji01 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Jeakson_(cropped).jpg"
  },
  "268011": {
    "src": "/players/268011.jpg",
    "credit": "Indianfootballfan29 / Wikimedia",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Bipin_Singh_Mumbai_City.png"
  }
};

export const crestFor = (slug: string) => CRESTS[slug] ?? null;
export const photo = (key?: string) => (key && PHOTOS[key]) || null;
export const heroFor = (slug?: string) => photo((slug && CLUB_HERO[slug]) || DEFAULT_HERO) ?? photo(DEFAULT_HERO);
export const playerPhoto = (id: string) => PLAYERS[id] ?? null;
