import express from 'express';
import connectDatabase from './config/database';

//Initialize express application
const recipeApp = express();

//Connect to Database
connectDatabase();

//Create root API endpoint
recipeApp.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);

//Set up connection listener
const port = 5000;
recipeApp.listen(port, () => console.log(`Express server running on port ${port}`));