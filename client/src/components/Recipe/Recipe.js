import React from 'react';
import './styles.css';

const Recipe = props => {
    const {recipe} = props;

    return (
        <div className="recipe">
            <h2>{recipe.title}</h2>
            <h3><strong>Ingredients</strong></h3>
            <p>{recipe.ingredientList}</p>
            <h3><strong>Directions</strong></h3>
            <p>{recipe.directions}</p>
            <h3><strong>Notes</strong></h3>
            <p>{recipe.notes}</p>
        </div>
    );
};

export default Recipe;