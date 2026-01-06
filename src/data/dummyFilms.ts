export interface Film {
  id: string;
  title: string;
  director: string;
  year: number;
  duration: string;
  category: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  characteristics: string[];
}

export const dummyFilms: Film[] = [
  {
    id: "1",
    title: "Sanctuary",
    director: "Zach Wigon",
    year: 2022,
    duration: "1h 36min",
    category: "Drama",
    description: "A wealthy heir attempts to sever ties with his dominatrix in this audacious two-hander. What unfolds is a battle of wits that reveals deeper truths about power dynamics and human connection.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["PSYCHOLOGICAL", "DRAMA", "INTIMATE", "PROVOCATIVE"]
  },
  {
    id: "2",
    title: "Limonov",
    director: "Kirill Serebrennikov",
    year: 2024,
    duration: "2h 18min",
    category: "Biography",
    description: "The ballad of Eduard Limonov, the radical Soviet poet who became an infamous political figure. A sweeping epic of rebellion, art, and the search for identity across decades.",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["BIOGRAPHY", "EPIC", "POLITICAL", "ARTISTIC"]
  },
  {
    id: "3",
    title: "Scarlet",
    director: "Pietro Marcello",
    year: 2022,
    duration: "1h 44min",
    category: "Romance",
    description: "A wounded WWI veteran returns to Normandy to raise his daughter alone. Years later, she dreams of a prince who will come for her on a ship with scarlet sails.",
    thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["ROMANTIC", "FAIRY TALE", "POST-WAR", "POETIC"]
  },
  {
    id: "4",
    title: "The World To Come",
    director: "Mona Fastvold",
    year: 2020,
    duration: "1h 45min",
    category: "Drama",
    description: "In the harsh farmlands of 19th century America, two women forge an unexpected connection that defies the constraints of their time and circumstance.",
    thumbnail: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["PERIOD", "RELATIONSHIPS", "INTIMATE", "LYRICAL"]
  },
  {
    id: "5",
    title: "Persian Lessons",
    director: "Vadim Perelman",
    year: 2020,
    duration: "2h 7min",
    category: "War",
    description: "A Jewish man survives a concentration camp by pretending to be Persian. When a Nazi officer demands lessons, he must invent an entire language to stay alive.",
    thumbnail: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["SURVIVAL", "WAR", "THRILLER", "HISTORICAL"]
  },
  {
    id: "6",
    title: "Docu-style",
    director: "Goh Iromoto",
    year: 2025,
    duration: "45min",
    category: "Documentary",
    description: "Documentary-style shooting has experienced a significant surge in popularity. This ad style resonates because it reflects life as it is: honest, emotional, and deeply human.",
    thumbnail: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["PORTRAITS", "HANDHELD", "RELATIONSHIPS", "DOCUMENTARY"]
  },
  {
    id: "7",
    title: "Aftersun",
    director: "Charlotte Wells",
    year: 2022,
    duration: "1h 41min",
    category: "Drama",
    description: "Sophie reflects on the shared joy and private melancholy of a holiday she took with her father twenty years earlier. Memories real and imagined fill the gaps between as she tries to reconcile the father she knew with the man she didn't.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["MEMORY", "FATHER-DAUGHTER", "NOSTALGIC", "MELANCHOLIC"]
  },
  {
    id: "8",
    title: "Past Lives",
    director: "Celine Song",
    year: 2023,
    duration: "1h 46min",
    category: "Romance",
    description: "Two childhood friends reunite after decades apart, navigating the space between what might have been and what is.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["ROMANCE", "FATE", "CONNECTION", "BITTERSWEET"]
  },
  {
    id: "9",
    title: "All of Us Strangers",
    director: "Andrew Haigh",
    year: 2023,
    duration: "1h 45min",
    category: "Fantasy",
    description: "A screenwriter draws close to a mysterious neighbor while also reconnecting with his parents, who died thirty years ago.",
    thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["SUPERNATURAL", "GRIEF", "LOVE", "HAUNTING"]
  },
  {
    id: "10",
    title: "Anatomy of a Fall",
    director: "Justine Triet",
    year: 2023,
    duration: "2h 32min",
    category: "Thriller",
    description: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as the key witness.",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["COURTROOM", "MYSTERY", "PSYCHOLOGICAL", "INTENSE"]
  },
  {
    id: "11",
    title: "The Zone of Interest",
    director: "Jonathan Glazer",
    year: 2023,
    duration: "1h 45min",
    category: "Drama",
    description: "The commandant of Auschwitz and his wife strive to build a dream life for their family in a house and garden next to the camp.",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["HISTORICAL", "HORROR", "ARTISTIC", "DISTURBING"]
  },
  {
    id: "12",
    title: "Poor Things",
    director: "Yorgos Lanthimos",
    year: 2023,
    duration: "2h 21min",
    category: "Comedy",
    description: "The incredible tale of Bella Baxter, a young woman brought back to life by an eccentric scientist, who runs off with a lawyer on a whirlwind adventure across the continents.",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    characteristics: ["SURREAL", "FEMINIST", "DARK COMEDY", "VISUAL"]
  }
];
