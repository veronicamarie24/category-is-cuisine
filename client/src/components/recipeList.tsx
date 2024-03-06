import { Button, Card, CardContent, CardMedia, Fab, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Recipe } from './types';
import { API_BASE_URL, RECIPES_ENDPOINT } from '../constants/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFireFlameCurved, faPlus } from '@fortawesome/free-solid-svg-icons';
import { minutesToHoursAndMinutes } from '../utils';
import MealPlanDrawer from './mealPlanDrawer';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export function RecipeList() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [mealPlan, setMealPlan] = useState<Recipe[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const apiUrl = `${API_BASE_URL}${RECIPES_ENDPOINT}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
                // Handle errors here, e.g., update the UI to show an error message
            }
        };

        fetchRecipes();
    }, []);

    const addToMealPlan = (event: React.MouseEvent, recipe: Recipe) => {
        // Prevent the button from triggering the recipe Link
        event.preventDefault();
        event.stopPropagation();

        setMealPlan([...mealPlan, recipe]);
        setIsDrawerOpen(true);
    };

    const handleToggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleRemoveRecipe = (recipeToRemove: Recipe) => {
        setMealPlan(mealPlan.filter(recipe => recipe !== recipeToRemove));
    };

    return (
        <>
            <Grid container maxWidth='lg' justifyContent='center'>
                {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id} style={{
                        padding: '8px',
                        marginBottom: '16px',
                        boxSizing: 'border-box',
                    }}>
                        <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ height: 360, maxWidth: 275, margin: '0 auto', cursor: 'pointer' }}>
                                <CardMedia
                                    component='img'
                                    alt={recipe.title}
                                    style={{ height: '200px', maxWidth: '100%', objectFit: 'cover' }}
                                    image={recipe.img_url}
                                    title={recipe.title} />
                                <CardContent sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '125px'
                                }}>
                                    <Typography variant='body1' sx={{ mb: 1 }} noWrap>
                                        {recipe.title}
                                    </Typography>
                                    <Stack spacing={1} direction='row' sx={{ mb: 1 }}>
                                        <Typography variant='caption'>
                                            <FontAwesomeIcon icon={faFireFlameCurved} /> {recipe.calories_per_serving} calories
                                        </Typography>
                                        <Typography variant='caption'>
                                            <FontAwesomeIcon icon={faClock} /> {minutesToHoursAndMinutes(recipe.prep_time + recipe.cook_time)}
                                        </Typography>
                                    </Stack>
                                    <div style={{ flexGrow: 1 }}></div> {/* Spacer */}
                                    <Button
                                        variant='outlined'
                                        color='secondary'
                                        size='small'
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={(event) => { addToMealPlan(event, recipe); }}
                                        sx={{ mt: 'auto' }}
                                    >
                                        Add to Meal Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            <Fab
                color="primary"
                aria-label="add"
                onClick={handleToggleDrawer}
                sx={{
                    position: 'fixed',
                    bottom: 10,
                    right: 10
                }}>
                <RestaurantIcon />
            </Fab>

            <MealPlanDrawer
                open={isDrawerOpen}
                mealPlan={mealPlan}
                onClose={handleToggleDrawer}
                onRemove={handleRemoveRecipe}
            />

        </>
    );
}
