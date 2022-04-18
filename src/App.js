import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useState } from "react";


const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const handleNameBlur = (e) => {
    setName(e.target.value);
  }
  const handleEmailBlur = (e) => {
    setEmail(e.target.value);
  }
  const handlePasswordBlur = (e) => {
    setPassword(e.target.value);
  }
  const handleRegisteredChange = (e) => {
    setRegistered(e.target.checked);
  }
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
      console.log('Password reset email sent!')
      })
      .catch(() => {
          setError(error.message);
          setError(error.message);

    })
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      
      e.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('password should contain');
      return;
    }

    setValidated(true);
    setError('');
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
      })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setEmail('');
        setPassword('');
        verifyEmail('');
        setUserName('');
      })
      .catch(error => {
        console.error(error)
        setError(error.message);
      })
    }

    
    e.preventDefault();
  }

  const setUserName = () =>{
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() =>{
      console.log('updating name');
    })
    .catch(error =>{
      setError(error.message);
    })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
      console.log('Email verification sent!');
    })
    }

  return (
    <div>
      <div className="registration w-50 mx-auto mt-2">
        <h2 className="text-primary">Pleases {registered ? 'Login': 'Register'}</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      { !registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Your Name" required />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={ handleEmailBlur } type="email" placeholder="Enter email" required />
            <Form.Control.Feedback type="invalid">
              Please choose a email.
            </Form.Control.Feedback>
     </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
            <Form.Control onBlur={ handlePasswordBlur } type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please choose a Password.
            </Form.Control.Feedback>
          </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check onChange={handleRegisteredChange} type="checkbox" label="All-Ready Registered?" />
          </Form.Group>
          <p className='text-danger'>{ error }</p>
          <Button onClick={handlePasswordReset} variant="link">Forget-Password</Button>
  <Button variant="primary" type="submit">
    {registered ? 'Login': 'Register'}
  </Button>
</Form>
      </div>
    </div>
  );
}

export default App;
