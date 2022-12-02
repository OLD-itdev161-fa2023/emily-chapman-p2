import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './styles.css';

const Login = ({authenticateBaker}) => {
    let history = useHistory();
    
    const [bakerData, setBakerData] = useState({
        email: '',
        password: ''
    });

    const [errorData, setErrorData] = useState({errors: null});

    const {email, password} = bakerData;
    const {errors} = errorData;

    const onChange = e => {
        const {name, value} = e.target;
        setBakerData ({
            ...bakerData,
            [name]: value
        })
    }

    const loginBaker = async () => {
        const newBaker = {
            email: email,
            password: password
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const body = JSON.stringify(newBaker);
            const res = await axios.post('http://localhost:5000/api/login', body, config);
            
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

    return (
        <div>
            <h2>Login to Your Account</h2>
            <div className="form-container">
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
                    <button onClick={() => loginBaker()}>Login</button>
                </div>
                <div className="error_message">
                    {errors && errors.map(error => 
                        <div key={error.msg}>{error.msg}</div>)}
                </div>
            </div>
        </div>
    )
}

export default Login;