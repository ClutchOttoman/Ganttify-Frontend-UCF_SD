import React, { useState } from 'react';
import './login.css';
import {buildPath} from './buildPath';

function Login() {
  const [message, setMessage] = useState('');
  const [loginEmail,setLoginEmail] = useState('');
  const [loginPassword,setLoginPassword] = useState('');

  const doLogin = async event => {
    event.preventDefault();

    var obj = { email: loginEmail.toLowerCase(), password: loginPassword };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/login'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      var res = JSON.parse(await response.text());

      if (res.error !== "") {
        setMessage(res.error);
      } else {

        // Load user information and ui settings.
        var user = {
            token: res.token,
            _id: res._id,
            email: res.email,
            name: res.name,
            username: res.username,
            phone: res.phone,
            uiOptions: res.uiOptions,
            test: res.test,
            error: res.error
        };
        console.log(JSON.stringify(user));
        localStorage.setItem('theme', user.uiOptions.theme);
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        window.location.href = '/dashboard';
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  return (

    
    <div className = "loginContainer mt-5">
      <div className ="loginForm text-center">
          <div className ="card-header loginFormHeader">
              <h1 className = "loginTitle">Login</h1>
          </div>
          <div className = "card-body p-0">
      
              <form onSubmit={doLogin}>
                  <div className = "row text-start"><label className = "formLabel mb-1" htmlFor="nameForm">Email</label></div>
                  
                  <div className = "row text-center mb-3"><input id="nameForm" type="email" className="formItem mx-0 mt-0" placeholder='Email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required></input></div>
                  
                  <div className = "row text-start"><label className = "formLabel mb-1" htmlFor="passwordForm">Password</label></div>
                  
                  <div className = "row text-center  mb-3"><input id="passwordForm" type="password" className="formItem" placeholder='Password' value ={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required></input></div>
                  
                  <div className = "row text-center mb-1"><span>{message}</span></div>

                  <div className = "row text-center mb-2"><input id="submitLogin" className = "btn"type="submit" value="Login"/></div>

                  <div className ="row text-start mb-2"><a href="/forgot-password" className="forgot-password-link">Forgot your password?</a></div>
                  
              </form>
          </div> 
      </div>
    </div>
          
     
  );
};

export default Login;
