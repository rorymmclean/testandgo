import React from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from './../../assets/images/testandgologo.png';
import './../Common.css';

const Login = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <h2 className="text-left ">Welcome to</h2>
          </Row>
          <Image className="w-50 " src={logo} />
          <Form>
            <Form.Label className="mt-3">email / Phone</Form.Label>
            <Form.Control
              className="hieght-50px"
              type="text"
              placeholder="name@example.com"
            />
            <Form.Label className="mt-3">password</Form.Label>
            <Form.Control
              className="mb-3 hieght-50px"
              type="email"
              placeholder="Your Password"
            />
            <Button
              variant="secondary CommonButton"
              className="mt-3 mb-4"
              onClick={() => navigate('/profile')}
            >
              Login
            </Button>
          </Form>
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
