/**
 * This is the main app file for running in development.
 * CORS doesn't work as expected in production environment and has been removed in app.ts
 */

import express from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipes';
import inventoryRouter from './routes/inventory';
import mealPlansRouter from './routes/mealPlans';
import groceryListsRouter from './routes/groceryLists';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Set CORS options based on the environment
const corsOptions = {
  origin: process.env.ENV === 'prod'
    ? process.env.PROD_DOMAIN
    : process.env.DEV_FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build', 'dist')));

// API Routes
app.use('/api/recipes', recipesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/meal-plans', mealPlansRouter);
app.use('/api/grocery-lists', groceryListsRouter);

// The catchall handler: for any request that doesn't match the ones above,
// send back the React app's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});