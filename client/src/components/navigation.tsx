import React, { useEffect } from 'react';
import { Stack, styled, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export type NavigationItem = 'addRecipe' | 'viewRecipes' | 'kitchenInventory' | 'mealPlans';

const StyledLink = styled(Link)(() => ({
    color: '#D79922',
    cursor: 'pointer'
}));

interface NavigationProps {
    activeItem: NavigationItem;
    setActiveItem: (item: NavigationItem) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeItem, setActiveItem }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the pathname from the current location
        const pathname = location.pathname;

        // Determine the active item based on the pathname
        if (pathname === '/') {
            setActiveItem('addRecipe');
        } else if (pathname === '/recipes') {
            setActiveItem('viewRecipes');
        } else if (pathname === '/inventory') {
            setActiveItem('kitchenInventory');
        } else if (pathname === '/meal-plans') {
            setActiveItem('mealPlans');
        }
    }, [setActiveItem]);

    const handleNavigation = (tab: NavigationItem, url: string) => {
        setActiveItem(tab);
        navigate(url);
    };

    return (
        <Stack direction='row' spacing={2} justifyContent='center'>
            <StyledLink
                variant='body1'
                underline='none'
                onClick={() => handleNavigation('addRecipe', '/')}
                fontWeight={activeItem === 'addRecipe' ? '600' : '500'}
            >
                Add Recipe
            </StyledLink>
            <StyledLink
                variant='body1'
                underline='none'
                onClick={() => handleNavigation('viewRecipes', '/recipes')}
                fontWeight={activeItem === 'viewRecipes' ? '600' : '500'}
            >
                All Recipes
            </StyledLink>
            <StyledLink
                variant='body1'
                underline='none'
                onClick={() => handleNavigation('kitchenInventory', '/inventory')}
                fontWeight={activeItem === 'kitchenInventory' ? '600' : '500'}
            >
                Kitchen Inventory
            </StyledLink>
            <StyledLink
                variant='body1'
                underline='none'
                onClick={() => handleNavigation('mealPlans', '/meal-plans')}
                fontWeight={activeItem === 'mealPlans' ? '600' : '500'}
            >
                Meal Plans
            </StyledLink>
        </Stack>
    );
};