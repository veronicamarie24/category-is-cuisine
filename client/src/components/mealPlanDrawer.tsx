import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { Ingredient, Recipe } from './types';
import { Button, Grid, IconButton, Stack, TextField, Typography, useTheme } from '@mui/material';
import { MouseEventHandler, useState } from 'react';
import { API_BASE_URL, GROCERY_LISTS_ENDPOINT, MEAL_PLANS_ENDPOINT } from '../constants/api';

function combineIngredients(recipes: Recipe[]) {
    const combinedIngredientsMap: { [key: string]: Ingredient } = {};

    recipes.forEach((recipe: Recipe) => {
        recipe.ingredients.forEach((ingredient: Ingredient) => {
            const key = `${ingredient.item_name}-${ingredient.unit_of_measurement}`;

            // Convert quantity to number
            let quantityAsNumber;
            try {
                quantityAsNumber = eval(ingredient.quantity);
            } catch (e) {
                console.error('Invalid quantity:', ingredient.quantity);
                quantityAsNumber = 0;
            }

            if (combinedIngredientsMap[key]) {
                combinedIngredientsMap[key].quantity += quantityAsNumber;
            } else {
                combinedIngredientsMap[key] = { ...ingredient, quantity: quantityAsNumber };
            }
        });
    });

    return Object.values(combinedIngredientsMap);
}



interface MealPlanDrawerProps {
    open: boolean;
    mealPlan: Recipe[];
    onClose: MouseEventHandler<HTMLButtonElement>;
    onRemove: (recipe: Recipe) => void;
}

const initialFormState = {
    startDate: '',
    endDate: '',
};

export default function MealPlanDrawer(props: MealPlanDrawerProps) {
    const { open, mealPlan, onClose, onRemove } = props;
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const apiUrl = `${API_BASE_URL}${MEAL_PLANS_ENDPOINT}`;
        e.preventDefault();

        try {
            const parsedFormData = {
                start_date: new Date(formData.startDate).toISOString().split('T')[0],
                end_date: new Date(formData.endDate).toISOString().split('T')[0],
                recipes: mealPlan
            };

            // First POST request to create meal plan
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parsedFormData),
            });

            if (response.ok) {
                setFormData(initialFormState);
                const mealPlanResponse = await response.json();

                // Build grocery list from recipes
                const combinedIngredients = combineIngredients(mealPlan);

                // Second POST request to create grocery list
                const groceryListApiUrl = `${API_BASE_URL}${GROCERY_LISTS_ENDPOINT}`;
                const groceryListResponse = await fetch(groceryListApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        meal_plan_id: mealPlanResponse.id,
                        items: combinedIngredients
                    }),
                });

                // TODO: if the meal plan is successfully posted but the grocery list is not,
                // there will be a discrepancy when trying to fetch the grocery list
                if (!groceryListResponse.ok) {
                    console.error('Error creating grocery list');
                }

            } else {
                console.error('Error adding meal plan');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const theme = useTheme();

    const borderStyle = `2px solid ${theme.palette.primary.light}`;

    return (
        <Drawer
            variant='persistent'
            anchor='bottom'
            open={open}
            onClose={onClose}
            hideBackdrop
            PaperProps={{
                sx: {
                    width: '350px',
                    bottom: 0,
                    right: '10px',
                    left: 'auto',
                    borderTop: borderStyle,
                    borderLeft: borderStyle,
                    borderRight: borderStyle,
                    backgroundColor: theme.palette.customBackground.light,
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                }
            }}
        >
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <RemoveIcon sx={{ color: theme.palette.primary.main, }} />
            </IconButton>
            <Stack spacing={2} sx={{ pl: 2, pr: 1, py: 2 }} component='form' onSubmit={handleSubmit}>
                <Typography variant='h6'>Current Meal Plan</Typography>
                {mealPlan.length > 0 ?
                    <Stack>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography component='label'>Start date:</Typography>
                                <TextField
                                    fullWidth
                                    name='startDate'
                                    placeholder={'MM/DD/YYYY'}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    size='small'
                                />
                            </Grid>

                            <Grid item xs={6} style={{ paddingLeft: '8px' }}>
                                <Typography component='label'>End date:</Typography>
                                <TextField
                                    fullWidth
                                    name='endDate'
                                    placeholder={'MM/DD/YYYY'}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    size='small'
                                />
                            </Grid>
                        </Grid>

                        <List>
                            {mealPlan.map((recipe, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => onRemove(recipe)}
                                            sx={{
                                                color: theme.palette.primary.main,
                                                "& .MuiSvgIcon-root": { // Target the icon within the IconButton
                                                    fontSize: '16px'
                                                }
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    }>
                                    <ListItemText primary={recipe.title} />
                                </ListItem>
                            ))}
                        </List>
                        <Button type='submit'>Save</Button>
                    </Stack>
                    :
                    <Typography sx={{ pl: 2 }}>Add some recipes!</Typography>}
            </Stack>
        </Drawer>
    );
}