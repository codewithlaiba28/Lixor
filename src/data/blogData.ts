export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tag: string;
  tagColor: string;
  image: string;
  description: string;
  content: {
    sectionTitle: string;
    paragraphs: string[];
    list?: {
      title: string;
      items: string[];
    };
  }[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "acid-power",
    title: "The silent hidden power of acid in every dish",
    date: "May 8, 2025",
    tag: "Cooking",
    tagColor: "bg-[#FF5C00]",
    image: "/images/Food stories and blogs/image1.avif",
    description: "Acid is often what separates good food from great. It's that zip of lemon on roasted fish, that splash of vinegar in a stew — it brightens, balances, and brings dishes to life.",
    content: [
      {
        sectionTitle: "The ingredient you're not using enough",
        paragraphs: [
          "Acid is often what separates good food from great. It's that zip of lemon on roasted fish, that splash of vinegar in a stew — it brightens, balances, and brings dishes to life.",
          "While salt brings depth, acid adds contrast. It sharpens sweetness, cuts through fat, and ties everything together."
        ]
      },
      {
        sectionTitle: "Go beyond lemon",
        paragraphs: [
          "Explore vinegars, fermented ingredients, citrus zests, or even sour fruits like pomegranate. Just a few drops can shift a dish's entire mood.",
          "Once you start tasting for acid — not just salt — your cooking will never be the same.",
          "Acid helps with digestion too. A squeeze of citrus over fatty meat makes it feel lighter and fresher.",
          "Experiment with pickled vegetables or yogurt-based sauces — they're acidic and add cooling contrast."
        ],
        list: {
          title: "Try this at home",
          items: [
            "Add lime to avocado toast, not just salt.",
            "Use white balsamic in salad dressings.",
            "Stir in a splash of vinegar at the end of soups."
          ]
        }
      }
    ]
  },
  {
    id: "timing-everything",
    title: "From pan to plate: timing is everything",
    date: "May 14, 2025",
    tag: "Cooking",
    tagColor: "bg-[#FF5C00]",
    image: "/images/Food stories and blogs/image2.avif",
    description: "Learn how seconds can make the difference between a perfectly seared steak and a rubbery mess.",
    content: [
      {
        sectionTitle: "Master the clock",
        paragraphs: [
          "In the kitchen, time is your most valuable ingredient. Understanding residual heat and resting times is crucial for high-end results.",
          "A steak continues to cook after it leaves the pan. Give it 5-10 minutes of rest to ensure the juices redistribute."
        ]
      }
    ]
  },
  {
    id: "cooking-with-color",
    title: "Cooking with color: what your plate is missing",
    date: "May 18, 2025",
    tag: "Insights",
    tagColor: "bg-[#2D6A4F]",
    image: "/images/Food stories and blogs/image3.avif",
    description: "Visual appeal is the first step to a great dining experience. Discover how to plate like a pro.",
    content: [
      {
        sectionTitle: "Eat with your eyes",
        paragraphs: [
          "The first bite is taken with the eyes. Contrasting colors and varied textures create a dynamic presentation that excites the palate before the first taste.",
          "Think about height, negative space, and natural garnishes that complement the main flavors."
        ]
      }
    ]
  },
  {
    id: "knife-skill",
    title: "The one knife skill that changes everything",
    date: "May 2, 2025",
    tag: "Tips",
    tagColor: "bg-[#E07B39]",
    image: "/images/Food stories and blogs/image4.avif",
    description: "Safety and efficiency start with how you hold your knife. Master the pinch grip.",
    content: [
      {
        sectionTitle: "The Pinch Grip",
        paragraphs: [
          "Most home cooks hold the handle like a hammer. Professional chefs pinch the blade for maximum control and precision.",
          "This simple adjustment reduces fatigue and significantly improves your cutting speed and safety."
        ]
      }
    ]
  }
];
