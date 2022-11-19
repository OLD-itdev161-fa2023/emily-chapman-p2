import express from 'express';
import connectDatabase from './config/database';
import {check, validationResult} from 'express-validator';
import cors from "cors";

//Initialize Express Server
const recipeApp = express();

//Connect to Database
connectDatabase();

//Configure Middleware
recipeApp.use(express.json({ extended: false }));
recipeApp.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

//Create root API endpoint
recipeApp.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);

//Create register API endpoint
recipeApp.post(
    '/api/bakers', 
    [
        check('name', 'Please enter your name.').not().isEmpty(),
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Please enter a password with six or more characters.').isLength({min: 6}),
        check('favoriteDessert', 'Please enter your favorite dessert.').not().isEmpty()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        } else {
            res.send(req.body);
        }
    }
);

//Set up connection listener
const port = 5000;
recipeApp.listen(port, () => console.log(`Express server running on port ${port}`));