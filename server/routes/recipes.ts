import { IngredientPayload, RecipePayload } from '../models/Recipe';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database'; // Import your MySQL connection pool

const recipesRouter = express.Router();

recipesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, ingredients, instructions, prep_time, cook_time, serving_size, calories_per_serving, img_url } = req.body;

    const newRecipe: RecipePayload = {
      title,
      instructions,
      prep_time,
      cook_time,
      serving_size,
      calories_per_serving,
      img_url
    };

    const recipesQuery = `
      INSERT INTO recipes 
      (title, instructions, prep_time, cook_time, serving_size, calories_per_serving, img_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [recipesResult] = await pool.query<ResultSetHeader>(
      recipesQuery,
      [newRecipe.title, newRecipe.instructions, newRecipe.prep_time, newRecipe.cook_time, newRecipe.serving_size, newRecipe.calories_per_serving, newRecipe.img_url]
    );

    const insertedId = recipesResult.insertId;

    // Insert ingredients for the new recipe
    if (ingredients && ingredients.length) {
      const ingredientInsertQuery = `
    INSERT INTO ingredients (recipe_id, quantity, unit_of_measurement, item_name, notes) 
    VALUES ?
  `;
      const ingredientValues = ingredients.map((ing: IngredientPayload) => ([insertedId, ing.quantity, ing.unit_of_measurement, ing.item_name, ing.notes]));
      await pool.query(ingredientInsertQuery, [ingredientValues]);
    }

    res.status(201).json({ message: `Recipe ${insertedId} added successfully`, recipe: newRecipe });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

recipesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const recipesQuery = 'SELECT * FROM recipes';
    const [recipesRows] = await pool.query<RowDataPacket[]>(recipesQuery);

    const recipesWithIngredients = await Promise.all(recipesRows.map(async (recipe) => {
      const ingredientsQuery = 'SELECT * FROM ingredients WHERE recipe_id = ?';
      const [ingredientsRows] = await pool.query<RowDataPacket[]>(ingredientsQuery, [recipe.id]);
      return { ...recipe, ingredients: ingredientsRows };
    }));

    res.status(200).json(recipesWithIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

recipesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Correctly type the query results
    const recipesQuery = `SELECT * FROM recipes WHERE id = ?`;
    const [recipesRows] = await pool.query<RowDataPacket[]>(recipesQuery, [id]);

    // Since it's a specific recipe, we expect only one row or none
    const recipe = recipesRows[0];

    if (recipe) {
      const ingredientsQuery = 'SELECT * FROM ingredients WHERE recipe_id = ?';
      const [ingredientsRows] = await pool.query<RowDataPacket[]>(ingredientsQuery, [id]);

      // Combine recipe and ingredients in the desired format
      const recipeWithIngredients = {
        ...recipe,
        ingredients: ingredientsRows
      };

      res.status(200).json(recipeWithIngredients);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});


export default recipesRouter;