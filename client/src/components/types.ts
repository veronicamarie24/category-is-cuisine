export interface Recipe {
    id: number;
    title: string;
    ingredients: Ingredient[];
    instructions: string[];
    prep_time: number;
    cook_time: number;
    serving_size: number;
    calories_per_serving: number;
    img_url: string;
}

export interface Ingredient {
    ingredient_id: number;
    recipe_id: number;
    quantity: string;
    unit_of_measurement: string;
    item_name: string;
    notes: string;
}

export interface InventoryItem {
    id: number;
    item_name: string;
    category: string;
    quantity: number;
    unit_of_measurement: string;
    purchase_date: string; // Date
    expiration_date: string; // Date
    notes: string;
}

export interface MealPlan {
    id: number;
    start_date: string; // Date
    end_date: string; // Date
    recipes: Recipe[];
}

export type GroceryList = {
    id: number;
    meal_plan_id: number;
    items: GroceryListItem[];
};

export type GroceryListItem = {
    id: number;
    grocery_list_id: number;
    item_name: string;
    quantity: number;
    unit_of_measurement: string;
};