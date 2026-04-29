export type Category = "All" | "Courses" | "Desserts" | "Starters" | "Appetizers";

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
}

export const menuItems: MenuItem[] = [
  // 4 items from root folder
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
    balancedBites: "Perfect side for any main course, rich in potassium and energy."
  },
  { id: "bruschetta-trio-1", name: "Bruschetta trio", price: "USD 12.00", image: "/images/meal-section-images/bruschetta trio.avif", category: ["All"] },
  { id: "chilled-gazpacho-1", name: "Chilled gazpacho", price: "USD 30.00", image: "/images/meal-section-images/chilled gazpacho.avif", category: ["All"] },
  { id: "molten-lava-cake-1", name: "Molten lava cake", price: "USD 70.00", image: "/images/meal-section-images/molten lava cake.avif", category: ["All"] },
  
  // Appetizers
  { id: "bruschetta-trio-app", name: "Bruschetta trio", price: "USD 15.00", image: "/images/meal-section-images/appetizer/bruschetta trio.avif", category: ["All", "Appetizers"] },
  { id: "crispy-calamari", name: "Crispy calamari", price: "USD 18.00", image: "/images/meal-section-images/appetizer/crispy calamari.avif", category: ["All", "Appetizers"] },
  { id: "spicy-chicken-wing", name: "Spicy chicken wing", price: "USD 14.00", image: "/images/meal-section-images/appetizer/spicy chicken wing.avif", category: ["All", "Appetizers"], logo: "/images/meal-section-images/logo/logo2.svg" },
  { id: "stuffed-mushrooms", name: "Stuffed mushrooms", price: "USD 16.00", image: "/images/meal-section-images/appetizer/stuffed mushrooms.avif", category: ["All", "Appetizers"], logo: "/images/meal-section-images/logo/logo1.svg" },

  // Courses
  { 
    id: "caesar-salad", 
    name: "Caesar salad", 
    price: "USD 30.00", 
    image: "/images/meal-section-images/starter/caprese salad.avif", // Using existing as placeholder if needed
    category: ["All", "Starters"], 
    description: "Crisp romaine lettuce tossed with Caesar dressing, parmesan shavings, garlic croutons, & optional",
    longDescription: "Caesar salad is a timeless favorite, combining crunch, creaminess, and bold flavors in a refreshing, satisfying bowl. It's simple yet always hits the mark.",
    ingredients: ["Crisp romaine lettuce", "Hand-flowered creamy Caesar dressing", "Egg yolk", "Anchovy", "Dijon mustard", "Lemon juice", "Garlic", "Olive oil", "Shaved parmesan", "Golden garlic croutons", "Freshly cracked black pepper"],
    balancedBites: "Ideal for light lunches, starters, or pairing with mains. Caesar salad is crisp, bold, and endlessly satisfying, whether served plain or topped with grilled chicken."
  },
  { id: "chicken-alfredo", name: "Chicken alfredo", price: "USD 22.00", image: "/images/meal-section-images/courses/chicken alfredo.avif", category: ["All", "Courses"] },
  { id: "grilled-salmon", name: "Grilled salmon", price: "USD 28.00", image: "/images/meal-section-images/courses/grilled salmon.avif", category: ["All", "Courses"] },
  { id: "steak-au-poivre", name: "Steak au poivre", price: "USD 35.00", image: "/images/meal-section-images/courses/steak au poivre.avif", category: ["All", "Courses"], logo: "/images/meal-section-images/logo/logo2.svg" },
  { id: "vegetarian-lasagna", name: "Vegetarian lasagna", price: "USD 20.00", image: "/images/meal-section-images/courses/vegetarian lasagna.avif", category: ["All", "Courses"], logo: "/images/meal-section-images/logo/logo1.svg" },

  // Desserts
  { id: "classic-tiramisu", name: "Classic tiramisu", price: "USD 12.00", image: "/images/meal-section-images/desserts/classic tiramisu.avif", category: ["All", "Desserts"] },
  { id: "creme-brulee", name: "Creme brulee", price: "USD 14.00", image: "/images/meal-section-images/desserts/creme brulee.avif", category: ["All", "Desserts"] },
  { id: "molten-lava-cake-dessert", name: "Molten lava cake", price: "USD 15.00", image: "/images/meal-section-images/desserts/molten lava cake.avif", category: ["All", "Desserts"] },
  { id: "ny-cheesecake", name: "NY cheesecake", price: "USD 13.00", image: "/images/meal-section-images/desserts/ny cheesecake.avif", category: ["All", "Desserts"] },

  // Starters
  { id: "caprese-salad", name: "Caprese salad", price: "USD 16.00", image: "/images/meal-section-images/starter/caprese salad.avif", category: ["All", "Starters"], logo: "/images/meal-section-images/logo/logo1.svg" },
  { id: "cheese-crostini", name: "Cheese crostini", price: "USD 14.00", image: "/images/meal-section-images/starter/cheese crostini.avif", category: ["All", "Starters"] },
  { id: "chilled-gazpacho-starter", name: "Chilled gazpacho", price: "USD 12.00", image: "/images/meal-section-images/starter/chilled gazpacho.avif", category: ["All", "Starters"], logo: "/images/meal-section-images/logo/logo1.svg" },
];
