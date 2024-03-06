import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Stack, ThemeProvider, Typography } from '@mui/material';
import { RecipeForm } from './components/recipeForm';
import { RecipeList } from './components/recipeList';
import { Navigation, NavigationItem } from './components/navigation';
import { RecipeDetails } from './components/recipeDetails';
import { Inventory } from './components/inventory';
import { MealPlans } from './components/mealPlans';
import { theme } from './theme';

function App() {
  const [activeItem, setActiveItem] = useState<NavigationItem>('addRecipe');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Stack spacing={3}>
            <Navigation activeItem={activeItem} setActiveItem={setActiveItem} />
            <Typography variant='h2' textAlign='center'>
              Category Is: Cuisine
            </Typography>
            <Routes>
              <Route path="/" element={<RecipeForm />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/meal-plans" element={<MealPlans />} />
            </Routes>
          </Stack>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;