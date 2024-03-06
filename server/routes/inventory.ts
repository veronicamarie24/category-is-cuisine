import { RecipePayload } from '../models/Recipe';
import { ResultSetHeader } from 'mysql2';
import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database'; // Import your MySQL connection pool
import { InventoryItemPayload } from '../models/InventoryItem';

const inventoryRouter = express.Router();

inventoryRouter.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM kitchen_inventory';

    const [result] = await pool.query<ResultSetHeader>(query);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

inventoryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { item_name, category, quantity, unit_of_measurement, purchase_date, expiration_date, notes } = req.body;

    const newInventoryItem: InventoryItemPayload = {
      item_name,
      category,
      quantity,
      unit_of_measurement,
      purchase_date,
      expiration_date,
      notes
    };

    const query = `
      INSERT INTO 
      kitchen_inventory 
      (item_name, category, quantity, unit_of_measurement, purchase_date, expiration_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query<ResultSetHeader>(
      query,
      [newInventoryItem.item_name,
      newInventoryItem.category,
      newInventoryItem.quantity,
      newInventoryItem.unit_of_measurement,
      newInventoryItem.purchase_date,
      newInventoryItem.expiration_date,
      newInventoryItem.notes]
    );

    const insertedId = result.insertId;

    res.status(201).json({ message: `Inventory item ${insertedId} added successfully`, inventoryItem: newInventoryItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

inventoryRouter.patch('/:itemId', async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const updates = req.body; // Object containing the fields to update

    const query = `
      UPDATE kitchen_inventory
      SET ?
      WHERE id = ?
    `;

    const [result] = await pool.query<ResultSetHeader>(
      query,
      [updates, itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Inventory item with ID ${itemId} not found` });
    }

    res.status(200).json({ message: `Inventory item ${itemId} updated successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

inventoryRouter.delete('/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const query = 'DELETE FROM kitchen_inventory WHERE id = ?';

    const [result] = await pool.query<ResultSetHeader>(query, [itemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Inventory item with ID ${itemId} not found` });
    }

    res.status(200).json({ message: `Inventory item ${itemId} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default inventoryRouter;