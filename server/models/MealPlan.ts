import { MealPlanRecipe } from "./Recipe";

export type MealPlan = {
    id: number;
    start_date: string; // or Date if you're working with Date objects
    end_date: string; // or Date
    recipes: MealPlanRecipe[];
};