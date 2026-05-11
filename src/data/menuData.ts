export type Category = "All" | "Courses" | "Desserts" | "Starters" | "Appetizers";

export interface NutritionData {
  calories: number;   // kcal
  protein: number;    // g
  carbs: number;      // g
  fats: number;       // g
  fiber: number;      // g
  sodium: number;     // mg
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: Category[];
  logo?: string;
  description?: string;
  longDescription?: string;
  ingredients?: string[];
  balancedBites?: string;
  nutrition?: NutritionData;
}

export const menuItems: MenuItem[] = [
  // Unique root item (no duplicate in any category)
  { 
    id: "mashed-potatoes", 
    name: "Mashed potatoes", 
    price: "USD 10.00", 
    image: "/images/meal-section-images/mashed potatoes.avif", 
    category: ["All"], 
    logo: "/images/meal-section-images/logo/logo1.svg",
    description: "Creamy, buttery mashed potatoes whipped to perfection.",
    longDescription: "Our mashed potatoes are made from selected organic potatoes, slow-boiled and whipped with grass-fed butter and a touch of cream for that cloud-like texture.",
    ingredients: ["Organic potatoes", "Grass-fed butter", "Heavy cream", "Sea salt", "Black pepper"],
    balancedBites: "Perfect side for any main course, rich in potassium and energy.",
    nutrition: { calories: 210, protein: 4, carbs: 35, fats: 8, fiber: 3, sodium: 380 },
  },

  // Appetizers
  { 
    id: "bruschetta-trio-app", 
    name: "Bruschetta trio", 
    price: "USD 15.00", 
    image: "/images/meal-section-images/appetizer/bruschetta trio.avif", 
    category: ["All", "Appetizers"],
    nutrition: { calories: 180, protein: 5, carbs: 28, fats: 6, fiber: 2, sodium: 310 },
  },
  { 
    id: "crispy-calamari", 
    name: "Crispy calamari", 
    price: "USD 18.00", 
    image: "/images/meal-section-images/appetizer/crispy calamari.avif", 
    category: ["All", "Appetizers"],
    nutrition: { calories: 320, protein: 18, carbs: 30, fats: 14, fiber: 1, sodium: 680 },
  },
  { 
    id: "spicy-chicken-wing", 
    name: "Spicy chicken wing", 
    price: "USD 14.00", 
    image: "/images/meal-section-images/appetizer/spicy chicken wing.avif", 
    category: ["All", "Appetizers"], 
    logo: "/images/meal-section-images/logo/logo2.svg",
    nutrition: { calories: 290, protein: 22, carbs: 8, fats: 18, fiber: 0, sodium: 740 },
  },
  { 
    id: "stuffed-mushrooms", 
    name: "Stuffed mushrooms", 
    price: "USD 16.00", 
    image: "/images/meal-section-images/appetizer/stuffed mushrooms.avif", 
    category: ["All", "Appetizers"], 
    logo: "/images/meal-section-images/logo/logo1.svg",
    nutrition: { calories: 160, protein: 6, carbs: 12, fats: 10, fiber: 2, sodium: 390 },
  },

  // Courses
  { 
    id: "caesar-salad", 
    name: "Caesar salad", 
    price: "USD 30.00", 
    image: "/images/meal-section-images/starter/smoked salmon.avif",
    category: ["All", "Starters"], 
    description: "Crisp romaine lettuce tossed with Caesar dressing, parmesan shavings, garlic croutons, & optional",
    longDescription: "Caesar salad is a timeless favorite, combining crunch, creaminess, and bold flavors in a refreshing, satisfying bowl. It's simple yet always hits the mark.",
    ingredients: ["Crisp romaine lettuce", "Hand-flowered creamy Caesar dressing", "Egg yolk", "Anchovy", "Dijon mustard", "Lemon juice", "Garlic", "Olive oil", "Shaved parmesan", "Golden garlic croutons", "Freshly cracked black pepper"],
    balancedBites: "Ideal for light lunches, starters, or pairing with mains. Caesar salad is crisp, bold, and endlessly satisfying, whether served plain or topped with grilled chicken.",
    nutrition: { calories: 350, protein: 10, carbs: 22, fats: 26, fiber: 3, sodium: 820 },
  },
  { 
    id: "chicken-alfredo", 
    name: "Chicken alfredo", 
    price: "USD 22.00", 
    image: "/images/meal-section-images/courses/chicken alfredo.avif", 
    category: ["All", "Courses"],
    nutrition: { calories: 620, protein: 38, carbs: 55, fats: 26, fiber: 2, sodium: 960 },
  },
  { 
    id: "grilled-salmon", 
    name: "Grilled salmon", 
    price: "USD 28.00", 
    image: "/images/meal-section-images/courses/grilled salmon.avif", 
    category: ["All", "Courses"],
    nutrition: { calories: 410, protein: 42, carbs: 4, fats: 24, fiber: 0, sodium: 480 },
  },
  { 
    id: "steak-au-poivre", 
    name: "Steak au poivre", 
    price: "USD 35.00", 
    image: "/images/meal-section-images/courses/steak au poivre.avif", 
    category: ["All", "Courses"], 
    logo: "/images/meal-section-images/logo/logo2.svg",
    nutrition: { calories: 580, protein: 48, carbs: 6, fats: 38, fiber: 0, sodium: 720 },
  },
  { 
    id: "vegetarian-lasagna", 
    name: "Vegetarian lasagna", 
    price: "USD 20.00", 
    image: "/images/meal-section-images/courses/vegetarian lasagna.avif", 
    category: ["All", "Courses"], 
    logo: "/images/meal-section-images/logo/logo1.svg",
    nutrition: { calories: 390, protein: 18, carbs: 52, fats: 12, fiber: 6, sodium: 640 },
  },

  // Desserts
  { 
    id: "classic-tiramisu", 
    name: "Classic tiramisu", 
    price: "USD 12.00", 
    image: "/images/meal-section-images/desserts/classic tiramisu.avif", 
    category: ["All", "Desserts"],
    nutrition: { calories: 420, protein: 8, carbs: 48, fats: 22, fiber: 1, sodium: 180 },
  },
  { 
    id: "creme-brulee", 
    name: "Creme brulee", 
    price: "USD 14.00", 
    image: "/images/meal-section-images/desserts/creme brulee.avif", 
    category: ["All", "Desserts"],
    nutrition: { calories: 380, protein: 6, carbs: 42, fats: 20, fiber: 0, sodium: 120 },
  },
  { 
    id: "molten-lava-cake-dessert", 
    name: "Molten lava cake", 
    price: "USD 15.00", 
    image: "/images/meal-section-images/desserts/molten lava cake.avif", 
    category: ["All", "Desserts"],
    nutrition: { calories: 480, protein: 7, carbs: 58, fats: 24, fiber: 2, sodium: 290 },
  },
  { 
    id: "ny-cheesecake", 
    name: "NY cheesecake", 
    price: "USD 13.00", 
    image: "/images/meal-section-images/desserts/ny cheesecake.avif", 
    category: ["All", "Desserts"],
    nutrition: { calories: 440, protein: 9, carbs: 46, fats: 26, fiber: 1, sodium: 340 },
  },

  // Starters
  { 
    id: "caprese-salad", 
    name: "Caprese salad", 
    price: "USD 16.00", 
    image: "/images/meal-section-images/starter/caprese salad.avif", 
    category: ["All", "Starters"], 
    logo: "/images/meal-section-images/logo/logo1.svg",
    nutrition: { calories: 220, protein: 10, carbs: 8, fats: 16, fiber: 2, sodium: 360 },
  },
  { 
    id: "cheese-crostini", 
    name: "Cheese crostini", 
    price: "USD 14.00", 
    image: "/images/meal-section-images/starter/cheese crostini.avif", 
    category: ["All", "Starters"],
    nutrition: { calories: 260, protein: 9, carbs: 26, fats: 14, fiber: 1, sodium: 490 },
  },
  { 
    id: "chilled-gazpacho-starter", 
    name: "Chilled gazpacho", 
    price: "USD 12.00", 
    image: "/images/meal-section-images/starter/chilled gazpacho.avif", 
    category: ["All", "Starters"], 
    logo: "/images/meal-section-images/logo/logo1.svg",
    nutrition: { calories: 90, protein: 3, carbs: 14, fats: 3, fiber: 4, sodium: 420 },
  },
];
