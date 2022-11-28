import React from 'react';
import RecipeListItem from './RecipeListItem';

const RecipeList = props => {
    const {recipes, clickRecipe} = props;
    
    return recipes.map(recipe => (
        <RecipeListItem
            key={recipe._id}
            recipe={recipe}
            clickRecipe={clickRecipe}
        />
    ));
};

export default RecipeList;