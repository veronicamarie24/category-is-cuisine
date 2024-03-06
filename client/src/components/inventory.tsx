import { useState, useEffect, ChangeEvent } from 'react';
import { API_BASE_URL, INVENTORY_ENDPOINT } from '../constants/api';
import { InventoryItem } from './types';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TextareaAutosize, Typography } from '@mui/material';
import { formatDate } from '../utils';

interface InventoryItemFormData {
    item_name: string;
    category: string;
    quantity: string;
    unit_of_measurement: string;
    purchase_date: string;
    expiration_date: string;
    notes: string;
}

const categoryList: Record<string, string> = {
    FRUITS: 'Fruits',
    VEGETABLES: 'Vegetables',
    DAIRY: 'Dairy',
    MEATS: 'Meats',
    GRAINS: 'Grains & Cereals',
    CANNED_GOODS: 'Canned Goods',
    FROZEN_FOODS: 'Frozen Foods',
    SNACKS: 'Snacks',
    BEVERAGES: 'Beverages',
    BAKING: 'Baking Essentials',
    SPICES: 'Spices & Herbs',
    CONDIMENTS: 'Condiments & Sauces',
    READY_TO_EAT: 'Ready To Eat Meals',
    OTHER: 'Other'
};

export const Inventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [newItem, setNewItem] = useState<InventoryItemFormData>({
        item_name: '',
        category: '',
        quantity: '',
        unit_of_measurement: '',
        purchase_date: '',
        expiration_date: '',
        notes: ''
    });

    const fetchItems = async () => {
        try {
            const apiUrl = `${API_BASE_URL}${INVENTORY_ENDPOINT}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch inventory items:', error);
            // Handle errors here, e.g., update the UI to show an error message
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;
        setNewItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setNewItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddItem = async () => {
        // Prepare the data for the API call
        const dataToSend = {
            ...newItem,
            quantity: Number(parseFloat(newItem.quantity).toFixed(2))
        };

        // API call to add the new item
        const response = await fetch(`${API_BASE_URL}${INVENTORY_ENDPOINT}`, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            // Clear the form only if the request was successful
            setNewItem({
                item_name: '',
                category: '',
                quantity: '',
                unit_of_measurement: '',
                purchase_date: '',
                expiration_date: '',
                notes: ''
            });

            // Refresh the list
            fetchItems();
        } else {
            // Handle errors here (e.g., show a message to the user)
            console.error('Failed to add the item:', await response.text());
        }
    };

    const handleEditItem = async (id: number, newName: string) => {
        await fetch(`${API_BASE_URL}${INVENTORY_ENDPOINT}/${id}`, { method: 'PATCH', body: JSON.stringify({ name: newName }), headers: { 'Content-Type': 'application/json' } });
        fetchItems();
    };

    const handleRemoveItem = async (id: number) => {
        await fetch(`${API_BASE_URL}${INVENTORY_ENDPOINT}/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const groupByCategory = (): Record<string, InventoryItem[]> => {
        return items.reduce<Record<string, InventoryItem[]>>((groups, item) => {
            const category = item.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
            return groups;
        }, {});
    };

    const groupedItems = groupByCategory();

    return (
        <Stack spacing={3}>
            <Typography variant='h3'>Kitchen Inventory</Typography>
            <Typography variant='h4'>Add New Item</Typography>
            <form>
                <TextField label='Item Name' name='item_name' value={newItem.item_name} onChange={handleInputChange} />
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select name='category' value={newItem.category} label='Category' onChange={handleSelectChange}>
                        {Object.entries(categoryList).map(([key, value]) =>
                            <MenuItem key={key} value={key}> {value} </MenuItem>)}
                    </Select>
                </FormControl>
                <TextField label='Quantity' name='quantity' value={newItem.quantity} onChange={handleInputChange} />
                <TextField label='Unit of Measurement' name='unit_of_measurement' value={newItem.unit_of_measurement} onChange={handleInputChange} />
                <TextField type='date' label='Purchase Date' name='purchase_date' InputLabelProps={{ shrink: true }} value={newItem.purchase_date} onChange={handleInputChange} />
                <TextField type='date' label='Expiration Date' name='expiration_date' InputLabelProps={{ shrink: true }} value={newItem.expiration_date} onChange={handleInputChange} />
                <TextareaAutosize minRows={3} placeholder='Notes' name='notes' value={newItem.notes} onChange={handleInputChange} />

                <Button variant='contained' onClick={handleAddItem}>Add Item</Button>
            </form>

            <Typography variant='h4'>Item List</Typography>

            {Object.entries(groupedItems).map(([group, items]) => (
                <Stack key={group}>
                    <Typography variant='h5'>{categoryList[group]}</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Purchase Date</TableCell>
                                    <TableCell align="right">Expiration Date</TableCell>
                                    <TableCell align="right">Notes</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            {item.item_name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.quantity}{' '}{item.unit_of_measurement}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatDate(new Date(item.purchase_date), 'MM/DD/YYYY')}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatDate(new Date(item.expiration_date), 'MM/DD/YYYY')}
                                        </TableCell>
                                        <TableCell align="right">
                                            { }
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant='outlined'
                                                color='primary'
                                                size='small'
                                                onClick={() => handleEditItem(item.id, 'new name here')}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                color='secondary'
                                                size='small'
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            ))}
        </Stack>
    );
};
