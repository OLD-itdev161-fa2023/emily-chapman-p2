import express, { application } from 'express';
import connectDatabase from './config/database';
import {check, validationResult} from 'express-validator';
import cors from "cors";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import Baker from './models/Baker';
import Recipe from './models/Recipe'
import auth from './middleware/auth';

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

//Root API endpoint
recipeApp.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);

//Register baker API endpoint
recipeApp.post(
    '/api/bakers', 
    [
        check('name', 'Please enter your name.').not().isEmpty(),
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Please enter a password with six or more characters.').isLength({min: 6}),
        check('favoriteDessert', 'Please enter your favorite dessert.').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        } else {
            const {name, email, password, favoriteDessert} = req.body;
            try {
                //Check if baker exists
                let baker = await Baker.findOne({ email: email });
                if (baker) {
                    return res
                        .status(400)
                        .json({ errors: [{msg: 'Baker already exists'}] });
                }

                //Create a new baker
                baker = new Baker({
                    name: name,
                    email: email,
                    password: password,
                    favoriteDessert: favoriteDessert
                });

                //Encrypt the password
                const salt = await bcrypt.genSalt(10);
                baker.password = await bcrypt.hash(password, salt);

                //Save to the database and return
                await baker.save();

                returnToken(baker, res);
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

//Authorize baker API endpoint
recipeApp.get('/api/auth', auth, async (req, res) => {
    try {
        const baker = await Baker.findById(req.baker.id);
        res.status(200).json(baker);
    } catch (error) {
        res.status(500).send('Unknown server error.');
    }
});

//Login API endpoint
recipeApp.post(
    '/api/login', 
    [
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Please enter your password.').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        } else {
            const {email, password} = req.body;
            try {
                //Check if baker exists
                let baker = await Baker.findOne({email: email});
                if (!baker) {
                    return res
                        .status(400)
                        .json({errors: [{msg: 'Invalid email or password.'}] });
                }

                //Check password entered
                const match = await bcrypt.compare(password, baker.password);
                if (!match) {
                    return res
                        .status(400)
                        .json({errors: [{msg: 'Invalid email or password.'}] });
                }

                returnToken(baker, res);
            } catch (error) {
                res.status(500).send('Server error.');
            }
        }
    }
);

//Generate and return a JWT Token
const returnToken = (baker, res) => {
    const payload = {
        baker: {
            id: baker.id
        }
    };

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '10hr' },
        (err, token) => {
            if (err) throw err;
            res.json({ token: token });
        }
    );
};

//Add Recipe API Endpoint
recipeApp.post (
    '/api/recipes',
    [auth,
        [
            check('title', 'A recipe title is required.').not().isEmpty(),
            check('ingredientList', 'A list of ingredients is required.').not().isEmpty(),
            check('directions', 'Directions for the recipe are required.').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()}); 
        }
        else {
            const {title, ingredientList, directions, notes} = req.body;
            try {
                //Find the baker who added the recipe
                const baker = await Baker.findById(req.baker.id);

                //Add a new recipe
                const recipe = new Recipe ({
                    baker: baker.id,
                    title: title,
                    ingredientList: ingredientList,
                    directions: directions,
                    notes: notes
                });

                //Save to the database and return
                await recipe.save();

                res.json(recipe);
            } catch (error) {
                console.error(error);
                res.status(500).send('Server error.');
            }
        }
    }
);

//Get Recipes API Endpoint
recipeApp.get('/api/recipes', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

//Set up connection listener
const port = 5000;
recipeApp.listen(port, () => console.log(`Express server running on port ${port}`));