import React from 'react';
import {useHistory} from 'react-router-dom';
import slugify from 'slugify';
import './styles.css';

const RecipeListItem = props => {
    const {recipe, clickRecipe, deleteRecipe, editRecipe} = props;
    const history = useHistory();

    const handleClickRecipe = recipe => {
        const slug = slugify(recipe.title, {lower: true});

        clickRecipe(recipe);
        history.push(`/recipes/${slug}`);
    };

    const handleEditRecipe = recipe => {
        editRecipe(recipe);
        history.push(`/edit-recipe/${recipe._id}`)
    };

    return (
        <div>
            <div className="recipeListItem" onClick={() => handleClickRecipe(recipe)}>
                <h3>{recipe.title}</h3>
                <h4><strong>Ingredients</strong></h4>
                <p>{recipe.ingredientList}</p>
            </div>
            <div className="recipeButtons">
                <button onClick={() => deleteRecipe(recipe)}>Delete Recipe</button>
                <button onClick={() => handleEditRecipe(recipe)}>Edit Recipe</button>
            </div>
        </div>
    );
};

export default RecipeListItem;