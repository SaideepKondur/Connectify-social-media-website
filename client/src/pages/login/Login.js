import React, { useState } from 'react';
import './Login.scss';
import loginLeft from "../../assets/loginLeft.jpg"
import { Link, useNavigate } from 'react-router-dom';
import {axiosClient} from '../../utils/axiosClient';
import { setItem, KEY_ACCESS_TOKEN } from '../../utils/localStorageManager';


function Login() {

    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault();
        try {
            const response = await axiosClient.post('/auth/login', {email, password});
            setItem(KEY_ACCESS_TOKEN,  response.result.accessToken);
            navigate('/');


        } catch (error) {
            console.log(error);
        }
        
    }
     


  return (
    <div className ="Login">
        <div className="left-side">
            <img className="left-image" src={loginLeft} alt="Login left" />
            <div className="website-name"> Connectify </div>
            <div className="welcome-text"> Welcome Page </div>
            <div className="signin-text"> Sign in to <br/> continue access </div>
        </div>
        <div className="right-side">
            {/* <div className ="login-box"> */}
                <h1 className="heading">Log in</h1>
                <form  onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email" 
                    className='email' 
                    id="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                    type="password" 
                    className='password' 
                    id="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <input type="submit" className='submit' value="SUBMIT"/>
                </form>
                <p className="subheading">Do not have an account? <Link to="/signup"> Sign up</Link></p>
            {/* </div> */}
        </div>
    </div>
            
  );
}

export default Login