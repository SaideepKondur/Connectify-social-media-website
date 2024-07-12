import React, { useState } from 'react';
import { axiosClient } from '../../utils/axiosClient';
import { Link } from 'react-router-dom';
import './Signup.scss';
import loginLeft from "../../assets/loginLeft.jpg";
import { useDispatch } from 'react-redux';
import { showToast, TOAST_SUCCESS } from '../../slices/appConfigSlice';


function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const result = await axiosClient.post('/auth/signup', { name, email, password });
            console.log(result);
            dispatch(showToast({ type: TOAST_SUCCESS, message: "Success! You've joined Connectify." }));
        } catch (error) {
            console.log(error);
        }   
    }

    function capitalizeWords(value) {
        return value.replace(/\b\w/g, char => char.toUpperCase());
    }

    function handleNameChange(e) {
        let value = e.target.value;
        if (value.length <= 18) {
            const capitalizedValue = capitalizeWords(value);
            setName(capitalizedValue);
        }
    }

    function handleEmailChange(e) {
        let value = e.target.value;
        if (value.length <= 25) {
            setEmail(value);
        }
    }

    function handlePasswordChange(e) {
        let value = e.target.value;
        if (value.length <= 20) {
            setPassword(value);
        }
    }

    return (
        <div className="Signup">
            <div className="left-side">
                <img className="left-image" src={loginLeft} alt="Login left" />
                <div className="website-name">Connectify</div>
                <div className="welcome-text">Welcome Page</div>
                <div className="signin-text">Sign up to <br /> continue access</div>
            </div>
            <div className="right-side">
                <h1 className="heading">Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="name"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    <input type="submit" className="submit" />
                </form>
                <p className="subheading">
                    Already have an account? <Link to="/Login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
