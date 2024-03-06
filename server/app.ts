/**
 * This is the main app file for running in production.
 * Navigate to the node.js app in the Control Panel to make changes to the configuration
 * (Extra Features > Setup Node.js App > cuisine.veronicamakes.com)
 * Environment variables are also able to be changed in the Control Panel. The .env file is only used in development environment.
 * 
 * Restart the app if necessary.
 * To rebuild TS code, click edit on the Node.js app > Run JS Script > build
 * Run NPM install if any packages were changed.
 * Use this command in the Control Panel Terminal if you want further access to the virtual environment:
 * source /home/veronica/nodevenv/domains/cuisine.veronicamakes.com/server/18/bin/activate && cd /home/veronica/domains/cuisine.veronicamakes.com/server
 */

import express from 'express';
import recipesRouter from './routes/recipes';
import inventoryRouter from './routes/inventory';
import mealPlansRouter from './routes/mealPlans';
import groceryListsRouter from './routes/groceryLists';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

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