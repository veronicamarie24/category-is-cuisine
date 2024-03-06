import { Box, Button, Card, CardContent, CardMedia, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { GroceryList, GroceryListItem, MealPlan } from './types';
import { API_BASE_URL, GROCERY_LISTS_ENDPOINT, MEAL_PLANS_ENDPOINT } from '../constants/api';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils';


export function MealPlans() {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [groceryList, setGroceryList] = useState<GroceryList | null>(null);

    const fetchMealPlans = async () => {
        try {
            const apiUrl = `${API_BASE_URL}${MEAL_PLANS_ENDPOINT}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: MealPlan[] = await response.json();

            setMealPlans(data);
        } catch (error) {
            console.error('Failed to fetch meal plans:', error);
            // Handle errors here
        }
    };

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const handleViewGroceryList = useCallback(async (mealPlanId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}${GROCERY_LISTS_ENDPOINT}/${mealPlanId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: GroceryList = await response.json();
            setGroceryList(data);
        } catch (error) {
            console.error('Failed to fetch grocery list:', error);
            // Handle errors here
        }
    }, []);

    const handleDeletePlan = useCallback(async (mealPlanId: number) => {
        await fetch(`${API_BASE_URL}${MEAL_PLANS_ENDPOINT}/${mealPlanId}`, { method: 'DELETE' });
        fetchMealPlans();
    }, []);

    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex' }}>
            <Grid container spacing={3} maxWidth="600px">
                {Object.values(mealPlans).map((mealPlan) => (
                    <Grid item xs={12} key={mealPlan.id} spacing={2}>
                        <Typography variant='h5' gutterBottom>
                            {formatDate(new Date(mealPlan.start_date), 'MM/DD/YYYY')} - {formatDate(new Date(mealPlan.end_date), 'MM/DD/YYYY')}
                        </Typography>
                        <Grid container spacing={2}>
                            {mealPlan.recipes.map((recipe) => (
                                <Grid item xs={4} key={recipe.id}>
                                    <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
                                        <Card sx={{ width: '100%', height: 250, cursor: 'pointer' }}>
                                            <CardMedia
                                                component='img'
                                                alt={recipe.title}
                                                height='140'
                                                image={recipe.img_url}
                                                title={recipe.title}
                                            />
                                            <CardContent>
                                                <Typography>
                                                    {recipe.title}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>

                        <Stack direction='row' justifyContent='space-between' sx={{ mt: 2 }}>
                            <Button variant='contained' onClick={() => handleViewGroceryList(mealPlan.id)}>View Grocery List</Button>
                            <Button variant='contained' color='error' onClick={() => handleDeletePlan(mealPlan.id)}>Delete Plan</Button>
                        </Stack>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{
                width: '300px',
                position: 'fixed',
                right: 0,
                top: 0,
                height: '100vh',
                overflowY: 'auto',
                borderLeft: `4px solid ${theme.palette.primary.light}`,
                backgroundColor: theme.palette.customBackground.light
            }}>
                {groceryList ? (
                    <Box sx={{ padding: '20px' }}>
                        <Typography variant="h6">Grocery List</Typography>
                        {groceryList.items.map((item: GroceryListItem) => {
                            return <li>{item.item_name}</li>
                        })}
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ padding: '20px' }}>Select a meal plan to view the grocery list</Typography>
                )}
            </Box>
        </Box>

    );
}
