import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './styles.css';

const AddRecipe = ({token, onRecipeAdded}) => {
    let history = useHistory();
    const [recipeData, setRecipeData] = useState({
        title: '',
        ingredientList: '',
        directions: '',
        notes: ''
    });

    const {title, ingredientList, directions, notes} = recipeData;

    const onChange = e => {
        const {name, value} = e.target;

        setRecipeData ({
            ...recipeData,
            [name]: value
        });
    };

    const add = async () => {
        if (!title || !ingredientList || !directions) {
            console.log('You must enter a recipe title, ingredient list, and directions.')
        } else {
            const newRecipe = {
                title: title,
                ingredientList: ingredientList,
                directions: directions,
                notes: notes
            };

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                //Add the recipe
                const body = JSON.stringify(newRecipe);
                const res = await axios.post('http://localhost:5000/api/recipes', body, config);

                //Call the handler and redirect
                onRecipeAdded(res.data);
                history.push('/');

            } catch (error) {
                console.error(`Error adding the recipe: ${error.response.data}`);
            }
        }

    };

    return (
        <div className="form-container">
            <h2>Add a Recipe</h2>
            <input
                name="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => onChange(e)}
            />
            <textarea
                name="ingredientList"
                placeholder="Ingredient List"
                value={ingredientList}
                cols="40"
                rows="20"
                onChange={e => onChange(e)}
            ></textarea>
            <textarea
                name="directions"
                placeholder="Directions"
                value={directions}
                cols="40"
                rows="20"
                onChange={e => onChange(e)}
            ></textarea>
            <textarea
                name="notes"
                placeholder="Notes"
                value={notes}
                cols="40"
                rows="20"
                onChange={e => onChange(e)}
            ></textarea>
            <button onClick={() => add()}>Submit</button>
        </div>
    );
};

export default AddRecipe;