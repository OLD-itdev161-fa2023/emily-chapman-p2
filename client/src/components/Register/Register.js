import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './styles.css';

const Register = ({authenticateBaker}) => {
    let history = useHistory();
    
    const [bakerData, setBakerData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        favoriteDessert: ''
    });

    const [errorData, setErrorData] = useState({errors: null});

    const {name, email, password, passwordConfirm, favoriteDessert} = bakerData;
    const {errors} = errorData;

    const onChange = e => {
        const {name, value} = e.target;
        setBakerData ({
            ...bakerData,
            [name]: value
        })
    }

    const registerBaker = async () => {
        if (password !== passwordConfirm) {
            console.log('Passwords do not match. Please update and try again.');
        } else {
            const newBaker = {
                name: name,
                email: email,
                password: password,
                favoriteDessert: favoriteDessert
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                const body = JSON.stringify(newBaker);
                const res = await axios.post('http://localhost:5000/api/bakers', body, config);
                
                //Store baker data and redirect
                localStorage.setItem('token', res.data.token);
                history.push('/');
            } catch (error) {
                //Clear baker data and set errors
                localStorage.removeItem('token');
                
                setErrorData({
                    ...errors,
                    errors: error.response.data.errors
                })
            }

            authenticateBaker();
        }
    }

    return (
        <div>
            <h2>Create an Account</h2>
            <div className="form-container">
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Confirm Password"
                        name="passwordConfirm"
                        value={passwordConfirm}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Favorite Dessert"
                        name="favoriteDessert"
                        value={favoriteDessert}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div>
                    <button onClick={() => registerBaker()}>Register</button>
                </div>
                <div className="error_message">
                    {errors && errors.map(error => 
                        <div key={error.msg}>{error.msg}</div>)}
                </div>
            </div>
        </div>
    )
};

export default Register;