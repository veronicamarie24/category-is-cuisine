import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL, RECIPES_ENDPOINT } from '../constants/api'; // Adjust paths as necessary
import { Recipe } from './types';
import { Stack, Typography } from '@mui/material';
import { minutesToHoursAndMinutes } from '../utils';

export const RecipeDetails = () => {
    const { id } = useParams<{ id: string }>(); // Extracting ID from URL
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${RECIPES_ENDPOINT}/${id}`);
                if (!response.ok) {
                    throw new Error('Recipe not found');
                }
                const data = await response.json();
                const parsedRecipe: Recipe = {
                    ...data,
                    instructions: data.instructions.split('#'),
                }
                setRecipe(parsedRecipe);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    const totalTime = recipe && minutesToHoursAndMinutes(recipe.prep_time + recipe.cook_time);

    return (
        <Stack spacing={3} alignItems='center'>
            {isLoading ?
                <Typography>Loading...</Typography> :
                !recipe ?
                    <Typography>Recipe not found.</Typography> :

                    <>
                        <Stack spacing={2} maxWidth='800px'>
                            <Stack direction='row' spacing={3}>
                                <Stack spacing={2} sx={{ width: '60%' }}>
                                    <Typography variant='h4'>{recipe.title}</Typography>
                                    <Typography variant='body1'>
                                        <Typography component='span' sx={{ fontWeight: '600' }}>Prep time:</Typography> {recipe.prep_time} min {' '}
                                        <Typography component='span' sx={{ fontWeight: '600' }}>Cook time:</Typography> {recipe.cook_time} min {' '}
                                        <Typography component='span' sx={{ fontWeight: '600' }}>Total time:</Typography> {totalTime}
                                    </Typography>
                                    <Typography>
                                        <Typography component='span' sx={{ fontWeight: '600' }}>Servings:</Typography> {recipe.serving_size} {' '}
                                        <Typography component='span' sx={{ fontWeight: '600' }}>Cal/serving:</Typography> {recipe.calories_per_serving}
                                    </Typography>
                                    <Typography variant='h6'>Ingredients</Typography>
                                    <Stack component='ul'>
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li key={index}>
                                                <Typography>
                                                    {ingredient.quantity}{' '}
                                                    {ingredient.unit_of_measurement}{' '}
                                                    {ingredient.item_name}
                                                    <span style={{ fontStyle: 'italic', color: 'gray' }}> {ingredient.notes} </span>
                                                </Typography>
                                            </li>

                                        ))}
                                    </Stack>
                                </Stack>
                                <img src={recipe.img_url} alt={recipe.title} style={{ maxWidth: '40%', height: 'auto', objectFit: 'contain' }} />
                            </Stack>


                            <>
                                <Typography variant='h6'>Instructions</Typography>
                                <Stack component='ul' spacing={1} sx={{ listStyleType: 'decimal' }}>
                                    {recipe.instructions.map((instructions, index) =>
                                        <li key={index}>
                                            <Typography>
                                                {instructions}
                                            </Typography>
                                        </li>
                                    )}
                                </Stack>
                            </>


                        </Stack>

                    </>
            }
        </Stack>
    );
};