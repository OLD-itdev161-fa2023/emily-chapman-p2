import mongoose from 'mongoose';

const BakerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    favoriteDessert: {
        type: String,
        required: true
    }
});

const Baker = mongoose.model('baker', BakerSchema);

export default Baker;