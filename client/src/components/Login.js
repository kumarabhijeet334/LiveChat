import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../context/AuthContext';
import Error from './error';


function Login() {
  const { loginData, loginError, loginUser, isLoginLoading, updateLoginData } = useContext(AuthContext);

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    updateLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    const newErrors = {};

    if (!email) {
      newErrors.email = 'This field is required.';
      
    }
    if(!password){
        newErrors.password = 'This field is required';
    }

    setErrors(newErrors);

    if (email && password) {
      loginUser();
    }
  };
  const customStyle = {
    fontSize: '13px', // Set your desired font size here
  };

  return (
    <div className="mt-14">
      <h1 className="align-items-center text-center mt-5">Meta-Chat</h1>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '58vh' }}>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid" style={customStyle}>
              {errors.email}
            </Form.Control.Feedback>
            <Form.Text className="text-info">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid" style={customStyle}>
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-2 col-6 mx-auto mb-0">
            <Button variant="outline-primary" type="submit">
              {isLoginLoading ? "Logging you in" : "Submit"}
            </Button>
          </div>
            {
              // loginError?.error && (<Alert  variant="danger"><p>{loginError?.message}</p></Alert>)
              loginError?.error && (<Error/>)
            }
        </Form>
        
      </div>
        <div className="text-center">
            New User ? &nbsp;
            <a href='/register'>Sign Up</a>
        </div>
    </div>
  );
}

export default Login;

