import express from 'express';
import connectDatabase from './config/database';
import {check, validationResult} from 'express-validator';
import cors from "cors";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import Baker from './models/Baker';

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

                //Generate and return a JWT token
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
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

//Set up connection listener
const port = 5000;
recipeApp.listen(port, () => console.log(`Express server running on port ${port}`));