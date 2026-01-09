export interface Film {
  id: string;
  title: string;
  director: string;
  directorBio: string;
  directorImage?: string;
  year: number;
  duration: string;
  category: string;
  genre?: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  youtubeVideoId?: string;
  characteristics: string[];
  awards?: string[];
  cast?: string[];
  cinematographer?: string[];
  country?: string;
  language?: string;
  isFeatured?: boolean;
}

export const dummyFilms: Film[] = [
  {
    id: "1",
    title: "Sanctuary",
    director: "Zach Wigon",
    directorBio: "Zach Wigon is an American filmmaker known for his sharp, character-driven narratives. His work often explores power dynamics and psychological complexity, earning him recognition at major film festivals. Sanctuary marks his breakthrough feature, praised for its bold storytelling.",
    directorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    year: 2022,
    duration: "1h 36min",
    category: "Drama",
    description: "A wealthy heir attempts to sever ties with his dominatrix in this audacious two-hander. What unfolds is a battle of wits that reveals deeper truths about power dynamics and human connection.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["PSYCHOLOGICAL", "DRAMA", "INTIMATE", "PROVOCATIVE"],
    awards: ["Sundance Film Festival - Official Selection", "SXSW - Audience Award Nominee"],
    cast: ["Margaret Qualley", "Christopher Abbott"],
    cinematographer: ["Ludovica Isidori"],
    country: "United States",
    language: "English"
  },
  {
    id: "2",
    title: "Limonov",
    director: "Kirill Serebrennikov",
    directorBio: "Kirill Serebrennikov is a visionary Russian director and theater artist, known for his daring and politically charged work. Despite facing persecution in Russia, he continues to create provocative films that challenge convention.",
    directorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    year: 2024,
    duration: "2h 18min",
    category: "Biography",
    description: "The ballad of Eduard Limonov, the radical Soviet poet who became an infamous political figure. A sweeping epic of rebellion, art, and the search for identity across decades.",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["BIOGRAPHY", "EPIC", "POLITICAL", "ARTISTIC"],
    awards: ["Cannes Film Festival - In Competition", "European Film Award Nominee"],
    cast: ["Ben Whishaw", "Viktoria Miroshnichenko"],
    cinematographer: ["Roman Vasyanov"],
    country: "France / Italy",
    language: "English / Russian"
  },
  {
    id: "3",
    title: "Scarlet",
    director: "Pietro Marcello",
    directorBio: "Pietro Marcello is an Italian filmmaker celebrated for his lyrical storytelling and blend of documentary and fiction. His films often evoke a dreamlike quality, merging past and present in poetic ways.",
    directorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    year: 2022,
    duration: "1h 44min",
    category: "Romance",
    description: "A wounded WWI veteran returns to Normandy to raise his daughter alone. Years later, she dreams of a prince who will come for her on a ship with scarlet sails.",
    thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["ROMANTIC", "FAIRY TALE", "POST-WAR", "POETIC"],
    awards: ["Cannes Film Festival - Un Certain Regard", "David di Donatello Award"],
    cast: ["Raphaël Thiéry", "Juliette Jouan"],
    cinematographer: ["Marco Graziaplena"],
    country: "France / Italy",
    language: "French"
  },
  {
    id: "4",
    title: "The World To Come",
    director: "Mona Fastvold",
    directorBio: "Mona Fastvold is a Norwegian filmmaker and screenwriter known for her atmospheric period pieces. Her work often explores forbidden desires and the inner lives of women constrained by society.",
    directorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    year: 2020,
    duration: "1h 45min",
    category: "Drama",
    description: "In the harsh farmlands of 19th century America, two women forge an unexpected connection that defies the constraints of their time and circumstance.",
    thumbnail: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["PERIOD", "RELATIONSHIPS", "INTIMATE", "LYRICAL"],
    awards: ["Venice Film Festival - Queer Lion", "Berlin Film Festival Nominee"],
    cast: ["Katherine Waterston", "Vanessa Kirby", "Casey Affleck"],
    cinematographer: ["André Chemetoff"],
    country: "United States",
    language: "English"
  },
  {
    id: "5",
    title: "Persian Lessons",
    director: "Vadim Perelman",
    directorBio: "Vadim Perelman is a Ukrainian-American filmmaker known for intense dramas that explore survival and human resilience. His films often deal with historical tragedies through deeply personal narratives.",
    directorImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
    year: 2020,
    duration: "2h 7min",
    category: "War",
    description: "A Jewish man survives a concentration camp by pretending to be Persian. When a Nazi officer demands lessons, he must invent an entire language to stay alive.",
    thumbnail: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["SURVIVAL", "WAR", "THRILLER", "HISTORICAL"],
    awards: ["German Film Award - Best Picture Nominee", "Jerusalem Film Festival - Best Actor"],
    cast: ["Nahuel Pérez Biscayart", "Lars Eidinger"],
    cinematographer: ["Vladislav Opelyants"],
    country: "Germany / Russia",
    language: "German / Farsi"
  },
  {
    id: "6",
    title: "Docu-style",
    director: "Goh Iromoto",
    directorBio: "Goh Iromoto is a Canadian-Japanese documentary filmmaker known for authentic, emotionally resonant storytelling. His work captures intimate human moments with an unobtrusive, naturalistic approach.",
    directorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    year: 2025,
    duration: "45min",
    category: "Documentary",
    description: "Documentary-style shooting has experienced a significant surge in popularity. This ad style resonates because it reflects life as it is: honest, emotional, and deeply human.",
    thumbnail: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["PORTRAITS", "HANDHELD", "RELATIONSHIPS", "DOCUMENTARY"],
    awards: ["Hot Docs - World Premiere", "IDFA - Special Mention"],
    cast: ["Documentary subjects"],
    cinematographer: ["Goh Iromoto"],
    country: "Canada",
    language: "English / Japanese"
  },
  {
    id: "7",
    title: "Aftersun",
    director: "Charlotte Wells",
    directorBio: "Charlotte Wells is a Scottish filmmaker whose debut feature Aftersun earned widespread critical acclaim. Her work is characterized by its tender exploration of memory, grief, and the complexity of parent-child relationships.",
    directorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    year: 2022,
    duration: "1h 41min",
    category: "Drama",
    description: "Sophie reflects on the shared joy and private melancholy of a holiday she took with her father twenty years earlier. Memories real and imagined fill the gaps between as she tries to reconcile the father she knew with the man she didn't.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["MEMORY", "FATHER-DAUGHTER", "NOSTALGIC", "MELANCHOLIC"],
    awards: ["Cannes Film Festival - Critics' Week Grand Prize", "BAFTA - Outstanding British Film", "Independent Spirit Award - Best First Feature"],
    cast: ["Paul Mescal", "Frankie Corio"],
    cinematographer: ["Gregory Oke"],
    country: "United Kingdom / United States",
    language: "English"
  },
  {
    id: "8",
    title: "Past Lives",
    director: "Celine Song",
    directorBio: "Celine Song is a Korean-Canadian playwright and filmmaker. Her debut feature Past Lives draws from her own experiences of immigration and explores themes of fate, identity, and the paths not taken.",
    directorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    year: 2023,
    duration: "1h 46min",
    category: "Romance",
    description: "Two childhood friends reunite after decades apart, navigating the space between what might have been and what is.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["ROMANCE", "FATE", "CONNECTION", "BITTERSWEET"],
    awards: ["Sundance Film Festival - Premiere", "Golden Globe Nominee", "Academy Award Nominee - Best Picture"],
    cast: ["Greta Lee", "Teo Yoo", "John Magaro"],
    cinematographer: ["Shabier Kirchner"],
    country: "United States / South Korea",
    language: "English / Korean"
  },
  {
    id: "9",
    title: "All of Us Strangers",
    director: "Andrew Haigh",
    directorBio: "Andrew Haigh is a British filmmaker celebrated for his intimate character studies. Known for films like Weekend and 45 Years, his work delves into loneliness, desire, and the search for connection.",
    directorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    year: 2023,
    duration: "1h 45min",
    category: "Fantasy",
    description: "A screenwriter draws close to a mysterious neighbor while also reconnecting with his parents, who died thirty years ago.",
    thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["SUPERNATURAL", "GRIEF", "LOVE", "HAUNTING"],
    awards: ["BFI London Film Festival - Opening Night", "BAFTA Nominee", "Critics Choice Award Nominee"],
    cast: ["Andrew Scott", "Paul Mescal", "Jamie Bell", "Claire Foy"],
    cinematographer: ["Jamie D. Ramsay"],
    country: "United Kingdom",
    language: "English"
  },
  {
    id: "10",
    title: "Anatomy of a Fall",
    director: "Justine Triet",
    directorBio: "Justine Triet is a French filmmaker known for her incisive character studies and complex narratives. Anatomy of a Fall won the Palme d'Or, establishing her as one of contemporary cinema's most vital voices.",
    directorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    year: 2023,
    duration: "2h 32min",
    category: "Thriller",
    description: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as the key witness.",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["COURTROOM", "MYSTERY", "PSYCHOLOGICAL", "INTENSE"],
    awards: ["Cannes Film Festival - Palme d'Or", "Academy Award - Best Original Screenplay", "Golden Globe - Best Foreign Language Film"],
    cast: ["Sandra Hüller", "Swann Arlaud", "Milo Machado-Graner"],
    cinematographer: ["Simon Beaufils"],
    country: "France",
    language: "French / English / German"
  },
  {
    id: "11",
    title: "The Zone of Interest",
    director: "Jonathan Glazer",
    directorBio: "Jonathan Glazer is a British filmmaker and music video director known for his visually stunning and thematically daring work. His films, including Sexy Beast and Under the Skin, are marked by their unique formal approach.",
    directorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    year: 2023,
    duration: "1h 45min",
    category: "Drama",
    description: "The commandant of Auschwitz and his wife strive to build a dream life for their family in a house and garden next to the camp.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["HISTORICAL", "HORROR", "ARTISTIC", "DISTURBING"],
    awards: ["Cannes Film Festival - Grand Prix", "Academy Award - Best International Feature", "BAFTA - Best British Film"],
    cast: ["Christian Friedel", "Sandra Hüller"],
    cinematographer: ["Łukasz Żal"],
    country: "United Kingdom / Poland",
    language: "German / Polish"
  },
  {
    id: "12",
    title: "Poor Things",
    director: "Yorgos Lanthimos",
    directorBio: "Yorgos Lanthimos is a Greek filmmaker known for his darkly absurdist style. From The Lobster to The Favourite, his films explore societal norms through surreal, often unsettling narratives.",
    directorImage: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200&h=200&fit=crop",
    year: 2023,
    duration: "2h 21min",
    category: "Comedy",
    description: "The incredible tale of Bella Baxter, a young woman brought back to life by an eccentric scientist, who runs off with a lawyer on a whirlwind adventure across the continents.",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["SURREAL", "FEMINIST", "DARK COMEDY", "VISUAL"],
    awards: ["Venice Film Festival - Golden Lion", "Academy Award - Best Actress", "Golden Globe - Best Motion Picture Musical/Comedy"],
    cast: ["Emma Stone", "Mark Ruffalo", "Willem Dafoe"],
    cinematographer: ["Robbie Ryan"],
    country: "United Kingdom / Ireland / United States",
    language: "English"
  }
];
