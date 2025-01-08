import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';
import {buildPath} from './buildPath';

function EditEmail() {
  const { email, token } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const doEditEmail = async () => {
      try {
        console.log("id: " + email);
        const response = await fetch(buildPath(`api/edit-email/${email}/${token}`), {
          method: 'GET'
        });

        if (!response.ok) {
          const res = await response.text();
          setMessage(res);
          return;
        }

        //console.log(res);
        setMessage('Your email has been successfully verified and your account has been assigned a new email!');
      } catch (e) {
        setMessage('There was an issue with changing your email address.');
      }
    };

    doEditEmail();
  }, [email, token]);

  return (
    <div className="verify-email-container">
    
      <div className="verify-email-card">
    
        <h1 className="verify-email-title">Edit Email</h1>
    
        <p className='verify-email-description'>{message}</p>
    
        <div className="button-container d-grid gap-2">
          <a href="/login" className="btn-2 btn-link mt-2">Back to Login</a>
        </div>
      </div>
    </div>
  );
}

export default EditEmail;