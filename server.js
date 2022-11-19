import express from 'express';

//Initialize express application
const recipeApp = express();

//Create root API endpoint
recipeApp.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);

//Set up connection listener
const port = 5000;
recipeApp.listen(port, () => console.log(`Express server running on port ${port}`));