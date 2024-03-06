import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { API_BASE_URL, RECIPES_ENDPOINT } from '../constants/api';

type IngredientFormInput = {
    item_name: string,
    quantity: string,
    unit_of_measurement: string,
    notes: string
}

type recipeFormData = {
    title: string,
    ingredients: IngredientFormInput[],
    instructions: string[],
    prep_time: string,
    cook_time: string,
    serving_size: string,
    calories_per_serving: string,
    img_url: string
}

const initialIngredientState: IngredientFormInput = {
    item_name: '',
    quantity: '',
    unit_of_measurement: '',
    notes: ''
}

const initialFormState: recipeFormData = {
    title: '',
    ingredients: [initialIngredientState],
    instructions: [''],
    prep_time: '',
    cook_time: '',
    serving_size: '',
    calories_per_serving: '',
    img_url: ''
};

export function RecipeForm() {
    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInstructionChange = (index: number, value: string) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index] = value;
        setFormData({
            ...formData,
            instructions: newInstructions
        });
    };

    const handleIngredientChange = (index: number, field: string, value: string) => {
        const newIngredients = [...formData.ingredients];
        const updatedIngredient = { ...newIngredients[index], [field]: value };
        newIngredients[index] = updatedIngredient;

        setFormData({
            ...formData,
            ingredients: newIngredients
        });
    };


    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, initialIngredientState]
        });
    };


    const addInstruction = () => {
        setFormData({
            ...formData,
            instructions: [...formData.instructions, '']
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const apiUrl = `${API_BASE_URL}${RECIPES_ENDPOINT}`;
        e.preventDefault();
        try {
            const parsedFormData = {
                ...formData,
                instructions: formData.instructions.join('#'),
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parsedFormData),
            });

            if (response.ok) {
                setFormData(initialFormState);

            } else {
                console.error('Error adding recipe');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Stack spacing={3} component='form' onSubmit={handleSubmit} maxWidth='500px'>
            <Typography component='label'>Title:</Typography>
            <TextField name='title' value={formData.title} onChange={handleChange} />

            <Typography component='label'>Ingredients:</Typography>
            <Stack spacing={2}>
                {formData.ingredients.map((ingredient, index) => (
                    <Stack key={index} spacing={2} direction="row">
                        <TextField
                            label="Quantity"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            style={{ width: '20%' }}
                        />
                        <TextField
                            label="Unit"
                            value={ingredient.unit_of_measurement}
                            onChange={(e) => handleIngredientChange(index, 'unit_of_measurement', e.target.value)}
                            style={{ width: '20%' }}
                        />
                        <TextField
                            label="Item Name"
                            value={ingredient.item_name}
                            onChange={(e) => handleIngredientChange(index, 'item_name', e.target.value)}
                            style={{ width: '40%' }}
                        />
                        <TextField
                            label="Notes"
                            value={ingredient.notes}
                            onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                            style={{ width: '20%' }}
                        />
                    </Stack>
                ))}
                <Button variant='outlined' onClick={addIngredient}>
                    Add Ingredient
                </Button>
            </Stack>

            <Typography component='label'>Instructions:</Typography>
            <Stack spacing={2}>
                {formData.instructions.map((instruction, index) => (
                    <TextField
                        key={index}
                        minRows={2}
                        placeholder={`Instruction ${index + 1}`}
                        style={{ width: '100%' }}
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                    />
                ))}
                <Button variant='outlined' onClick={addInstruction}>
                    Add Instruction
                </Button>
            </Stack>

            <Grid container>
                <Grid item xs={6}>
                    <Typography component='label'>Prep Time (min):</Typography>
                    <TextField
                        fullWidth
                        name='prep_time'
                        value={formData.prep_time}
                        onChange={handleChange}
                        size='small'
                    />
                </Grid>

                <Grid item xs={6} style={{ paddingLeft: '8px' }}>
                    <Typography component='label'>Cook Time (min):</Typography>
                    <TextField
                        fullWidth
                        name='cook_time'
                        value={formData.cook_time}
                        onChange={handleChange}
                        size='small'
                    />
                </Grid>
            </Grid>


            <Grid container>
                <Grid item xs={6}>
                    <Typography component='label'>Serving Size:</Typography>
                    <TextField
                        fullWidth
                        name='serving_size'
                        value={formData.serving_size}
                        onChange={handleChange}
                        size='small'
                    />
                </Grid>

                <Grid item xs={6} style={{ paddingLeft: '8px' }}>
                    <Typography component='label'>Calories per serving:</Typography>
                    <TextField
                        fullWidth
                        name='calories_per_serving'
                        value={formData.calories_per_serving}
                        onChange={handleChange}
                        size='small'
                    />
                </Grid>
            </Grid>


            <Typography component='label'>Image URL:</Typography>
            <TextField name='img_url' value={formData.img_url} onChange={handleChange} size='small' />

            <Button type='submit' variant='contained'>Save Recipe</Button>
        </Stack>
    );
}
