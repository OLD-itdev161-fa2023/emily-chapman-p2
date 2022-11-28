import React from 'react';
import RecipeListItem from './RecipeListItem';

const RecipeList = props => {
    const {recipes, clickRecipe, deleteRecipe} = props;
    
    return recipes.map(recipe => (
        <RecipeListItem
            key={recipe.id}
            recipe={recipe}
            clickRecipe={clickRecipe}
            deleteRecipe={deleteRecipe}
        />
    ));
};

export default RecipeList;