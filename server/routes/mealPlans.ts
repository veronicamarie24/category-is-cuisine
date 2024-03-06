import { ResultSetHeader } from 'mysql2';
import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';
import { Recipe } from '../models/Recipe';
import { MealPlan } from '../models/MealPlan';

const mealPlansRouter = express.Router();

mealPlansRouter.get('/', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        mp.id AS meal_plan_id,
        mp.start_date,
        mp.end_date,
        r.id AS recipe_id,
        r.img_url,
        r.title
      FROM 
        meal_plans mp
      JOIN 
        meal_plan_recipes mpr ON mp.id = mpr.meal_plan_id
      JOIN  
        recipes r ON mpr.recipe_id = r.id
      ORDER BY 
        mp.start_date DESC, mp.id;
    `;

    const [mealPlansData] = await pool.query<any[]>(query);

    const mealPlans: MealPlan[] = [];
    mealPlansData.forEach(row => {
      let mealPlan = mealPlans.find((mp: MealPlan) => mp.id === row.meal_plan_id);

      if (!mealPlan) {
        mealPlan = {
          id: row.meal_plan_id,
          start_date: row.start_date,
          end_date: row.end_date,
          recipes: []
        };
        mealPlans.push(mealPlan);
      }

      mealPlan.recipes.push({
        id: row.recipe_id,
        img_url: row.img_url,
        title: row.title
      });
    });

    res.status(200).json(mealPlans);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

mealPlansRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, recipes } = req.body;

    // Insert into meal_plans table
    const mealPlanQuery = `
      INSERT INTO 
      meal_plans 
      (start_date, end_date)
      VALUES (?, ?)
    `;

    const [mealPlanResult] = await pool.query<ResultSetHeader>(
      mealPlanQuery,
      [start_date, end_date]
    );

    const mealPlanId = mealPlanResult.insertId;

    // Insert into meal_plan_recipes table
    const mealPlanRecipesQuery = `
      INSERT INTO 
      meal_plan_recipes 
      (meal_plan_id, recipe_id)
      VALUES 
    `;

    const values = recipes.map((recipe: Recipe) => `(${mealPlanId}, ${recipe.id})`).join(', ');
    const finalQuery = mealPlanRecipesQuery + values;

    const mealPlanRecipesData = recipes.map((recipe: Recipe) => [mealPlanId, recipe.id]);

    await pool.query<ResultSetHeader>(
      finalQuery,
      [mealPlanRecipesData]
    );

    res.status(201).json({ message: 'Meal plan created successfully', id: mealPlanId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

mealPlansRouter.delete('/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Remove all grocery list items associated with the meal plan
    const groceryListItemsQuery = 'DELETE FROM grocery_list_items WHERE grocery_list_id IN (SELECT id FROM grocery_lists WHERE meal_plan_id = ?)';
    await pool.query<ResultSetHeader>(groceryListItemsQuery, [itemId]);

    // Remove the grocery list associated with the meal plan
    const groceryListQuery = 'DELETE FROM grocery_lists WHERE meal_plan_id = ?';
    await pool.query<ResultSetHeader>(groceryListQuery, [itemId]);

    // Remove all recipes from the meal plan
    const mealPlanRecipesQuery = 'DELETE FROM meal_plan_recipes WHERE meal_plan_id = ?';
    await pool.query<ResultSetHeader>(mealPlanRecipesQuery, [itemId]);

    // Delete the meal plan
    const query = 'DELETE FROM meal_plans WHERE id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [itemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Meal plan with ID ${itemId} not found` });
    }

    res.status(200).json({ message: `Meal plan ${itemId} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default mealPlansRouter;
