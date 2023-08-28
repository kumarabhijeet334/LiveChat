import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import Error from './error';


function Register() {
  
  // const [formData, setFormData] = useState({
  //   username: '',
  //   email: '',
  //   password: ''
  // });

  const {formData, updateFormData, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    updateFormData({ ...formData, [e.target.name]: e.target.value});
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    const newErrors = {};
    
    if(!username){
        newErrors.username = 'This field is required';
    }

    if (!email) {
      newErrors.email = 'This field is required.';
      
    }
    if(!password){
        newErrors.password = 'This field is required';
    }

    setErrors(newErrors);

    if (email && password && username) {
      registerUser();
    }
  };
  const customStyle = {
    fontSize: '13px', // Set your desired font size here
  };

  return (
    <>
    <div className="mt-5 mb-4">
      <h1 className="align-items-center text-center">Meta-Chat</h1>
    </div>
    <br/>
    <br/>
    <div className="d-flex justify-content-center align-items-center mb-15" style={{ height: '50vh' }}>
      
      <Form onSubmit={handleSubmit} className="">
        <Form.Group className="mb-2" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid" style={customStyle}>
            {errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid" style={customStyle}>
            {errors.email}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid" style={customStyle}>
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-grid gap-2 col-6 mx-auto mb-3">
          <Button variant="outline-primary" type="submit">
            {isRegisterLoading ? "Creating your account" : "Submit"}
          </Button>
            {
              // registerError?.error && (<Alert variant="danger"><p>{registerError?.message}</p></Alert>)
              registerError?.error && (<Error/>)
            }
          
        </div>
      </Form>
    </div>
    
    <br/>
    
    <div className="text-center mt-3">Already have an account ? &nbsp;
      <a href='/login'>Login</a>
    </div>
    </>
  );
}

export default Register;

