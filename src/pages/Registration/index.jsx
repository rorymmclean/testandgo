import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import logo from './../../assets/images/testandgologo.png';
import './../Common.css';
import './Registration.css';
const Registration = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <Image className="w-80" src={logo} />

            <h4 className="mb-3 registration-h4-page1">
              COVID-19 Test Vending Machine
            </h4>
            <Button
              className="CommonButton mt-3"
              variant="secondary"
              onClick={() => navigate('/registration/step1')}
            >
              Get Started
            </Button>
            <Row className="registration-row-page1">
              <Button
                className="CommonButton  width-48"
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
              <Button
                className="CommonButton width-48"
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Home
              </Button>
            </Row>
            <a
              className="regiserLink-1 registration-a-page1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://lts.com/wp-content/uploads/2022/08/20220801_LTS-TAG_English-5.mp4"
            >
              Test at a Kiosk - What to Expect (English audio)
            </a>

            <a
              className="regiserLink-1 registration-a-page1 mb-5"
              to="/"
              rel="noopener noreferrer"
              target="_blank"
              href="https://lts.com/wp-content/uploads/2022/08/20220801_LTS-TAG_Spanish-6.mp4"
            >
              Prueba en un Quiosco - Qué Esperar (audio en Español)
            </a>
            <Footer />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
