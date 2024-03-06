export interface RecipePayload {
    title: string;
    instructions: string;
    prep_time: number;
    cook_time: number;
    serving_size: number;
    calories_per_serving: number;
    img_url: string;
}

export interface Recipe {
    id: number;
    title: string;
    ingredients: string[];
    instructions: string;
    prep_time: number;
    cook_time: number;
    serving_size: number;
    img_url: string;
}

export interface MealPlanRecipe {
    id: number;
    title: string;
    img_url: string;
}

export interface IngredientPayload {
    item_name: string;
    quantity: number;
    unit_of_measurement: string;
    notes: string;
}