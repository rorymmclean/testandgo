import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import logo from './../../assets/images/testandgologo.png';
import './../Common.css';

const Login = () => {
  const navigate = useNavigate();
  const [validatedForm, setValidatedForm] = useState(false);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const [FormError, setFormError] = useState(false);
  const { contextData, setContextData } = useContext(UserContext);
  const [fromData, setFormData] = useState({
    email: '',
    password: '',
  });
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };

  useEffect(() => {
    if (localStorage.getItem('user_token') != null) {
      navigate('/profile');
    }
  }, []);

  const handleSubmit = (event) => {
    setFormError(false);

    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setValidatedForm(true);
    } else {
      console.log('جاهز');
      axios
        .get(
          `${REACT_APP_API}/login?loginid=${fromData.email}&password=${fromData.password}`
        )
        .then((res) => {
          console.log(res.data.body['0'].patient_guid);
          if (res.data.statuscode == '200') {
            localStorage.setItem('user_token', res.data.body['0'].patient_guid);
            setContextData((prevState) => {
              return {
                ...prevState,
                userData: res.data.body['0'],
              };
            });
            navigate('/profile');
          } else if (
            res.data.statuscode == '400' ||
            res.data.statuscode == '401'
          ) {
            setFormError(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <h2 className="text-left ">Welcome to</h2>
          </Row>
          <Image className="w-50 " src={logo} />
          <Form onSubmit={handleSubmit} noValidate validated={validatedForm}>
            <Form.Label className="mt-3">Email / Phone</Form.Label>
            <Form.Control
              required
              className="hieght-50px"
              type="text"
              placeholder="name@example.com"
              value={fromData.email}
              onChange={(e) => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    email: e.target.value,
                  };
                });
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please Enter Your Email or Phone.
            </Form.Control.Feedback>
            <Form.Label className="mt-3">password</Form.Label>
            <Form.Control
              required
              className="mb-3 hieght-50px"
              type="password"
              placeholder="Your Password"
              value={fromData.password}
              onChange={(e) => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    password: e.target.value,
                  };
                });
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please Enter Your Password.
            </Form.Control.Feedback>
            <Button
              variant="secondary CommonButton"
              className="mt-3 mb-4"
              type="submit"
            >
              Login
            </Button>
          </Form>
          {FormError && (
            <p
              style={{
                marginTop: ' 0.25rem',
                fontSize: '.875em',
                color: '#dc3545',
              }}
            >
              The Email/Phone or password you entered is incorrect.
            </p>
          )}
          <Link className="loginLinks" to="">
            Forget password?
          </Link>
          <br />
          <Link className="loginLinks" to="/privacy" target="_blank">
            Privacy
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
