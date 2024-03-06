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