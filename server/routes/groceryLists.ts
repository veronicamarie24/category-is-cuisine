import { ResultSetHeader, RowDataPacket } from 'mysql2';
import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';
import { Recipe } from '../models/Recipe';
import { MealPlan } from '../models/MealPlan';
import { GroceryList, GroceryListItem } from '../models/GroceryLists';

const groceryListsRouter = express.Router();

groceryListsRouter.get('/:mealPlanId', async (req: Request, res: Response) => {
  try {
    const mealPlanId = req.params.mealPlanId;

    // SQL query to join grocery_lists and grocery_list_items for a specific meal plan
    const query = `
      SELECT 
        gl.id AS grocery_list_id,
        gl.meal_plan_id,
        gli.id AS item_id,
        gli.grocery_list_id,
        gli.item_name,
        gli.quantity,
        gli.unit_of_measurement
      FROM 
        grocery_lists gl
      LEFT JOIN 
        grocery_list_items gli ON gl.id = gli.grocery_list_id
      WHERE 
        gl.meal_plan_id = ?
      ORDER BY 
        gli.id;
    `;

    // Executing the query with the specific meal plan ID
    const [groceryListsData] = await pool.query<RowDataPacket[]>(query, [mealPlanId]);

    // Process the data into the required format
    let groceryList: GroceryList = {
      id: 0, // Placeholder, will be updated
      meal_plan_id: Number(mealPlanId),
      items: []
    };

    groceryListsData.forEach(row => {
      if (!groceryList.id) {
        groceryList.id = row.grocery_list_id;
      }
      if (row.item_id) {
        groceryList.items.push({
          id: row.item_id,
          grocery_list_id: row.grocery_list_id,
          item_name: row.item_name,
          quantity: row.quantity,
          unit_of_measurement: row.unit_of_measurement
        });
      }
    });

    // Check if the grocery list was found
    if (!groceryList.id) {
      return res.status(404).json({ message: `Grocery list for meal plan ID ${mealPlanId} not found` });
    }

    // Sending the response
    res.status(200).json(groceryList);
  } catch (error: unknown) {
    // Error handling
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

groceryListsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { meal_plan_id, items } = req.body;

    // Insert into grocery_lists table
    const groceryListQuery = `
          INSERT INTO grocery_lists (meal_plan_id)
          VALUES (?)
      `;
    const [groceryListResult] = await pool.query<ResultSetHeader>(groceryListQuery, [meal_plan_id]);
    const groceryListId = groceryListResult.insertId;

    // Insert grocery list items
    const groceryListItemsQuery = `
          INSERT INTO grocery_list_items (grocery_list_id, item_name, quantity, unit_of_measurement)
          VALUES ?
      `;
    const groceryListItemsData = items.map((item: Ingredient) => [
      groceryListId,
      item.item_name,
      item.quantity,
      item.unit_of_measurement
    ]);

    await pool.query<ResultSetHeader>(groceryListItemsQuery, [groceryListItemsData]);

    res.status(201).json({ message: 'Grocery list created successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Assuming Ingredient type is defined
interface Ingredient {
  item_name: string;
  quantity: number;
  unit_of_measurement: string;
}

export default groceryListsRouter;
