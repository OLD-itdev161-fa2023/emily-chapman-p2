import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    baker: {
        type: 'ObjectId',
        ref: 'Baker'
    },
    title: {
        type: String,
        required: true
    },
    ingredientList: {
        type: String,
        required: true
    },
    directions: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
})

const Recipe = mongoose.model('recipe', RecipeSchema);

export default Recipe;