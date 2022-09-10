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
            <Image
              className="w-80"
              style={{ cursor: 'pointer' }}
              src={logo}
              onClick={() =>
                window.open('https://www.testandgo.com/', '_blank')
              }
            />

            <h4 className="mb-5 registration-h4-page1">
              COVID-19 Test Vending Machine
            </h4>
            <Button
              className="CommonButton mt-3"
              variant="secondary"
              onClick={() => navigate('/verification/step1')}
            >
              Get Started
            </Button>
            <Row className="d-flex justify-content-between p-0">
              <Button
                style={{ width: '48%' }}
                className="CommonButton  "
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
              <Button
                style={{ width: '49%' }}
                className="CommonButton"
                variant="secondary"
                onClick={() => navigate('/profile')}
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
              style={{ marginTop: '10px' }}
              to="/"
              rel="noopener noreferrer"
              target="_blank"
              href="https://lts.com/wp-content/uploads/2022/08/20220801_LTS-TAG_Spanish-6.mp4"
            >
              Prueba en un Quiosco - Qué Esperar (audio en Español)
            </a>
            <div style={{ position: 'absolute', bottom: '0' }}>
              <Footer />
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
