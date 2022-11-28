import React from 'react';
import {useHistory} from 'react-router-dom';
import slugify from 'slugify';
import './styles.css';

const RecipeListItem = props => {
    const {recipe, clickRecipe} = props;
    const history = useHistory();

    const handleClickRecipe = recipe => {
        const slug = slugify(recipe.title, {lower: true});

        clickRecipe(recipe);
        history.push(`/recipes/${slug}`);
    };

    return (
        <div>
            <div className="recipeListItem" onClick={() => handleClickRecipe(recipe)}>
                <h2>{recipe.title}</h2>
                <h3><strong>Ingredients</strong></h3>
                <p>{recipe.ingredientList}</p>
            </div>
        </div>
    );
};

export default RecipeListItem;