import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Stepper from '../../components/common/Stepper';
import './../Common.css';
import './../Steps.css';

const CovidTestRequest = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row
            className="justify-content-center mb-3"
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <Stepper step={6} width="70%" />
            <h4 className="mt-3 HealthInsurance-h4">Request COVID-19 Test</h4>
            <p className="mt-3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem
              blanditiis sint vitae architecto aut et est magni rem nam! Ipsa
              harum recusandae maiores nemo assumenda quidem quod blanditiis rem
              exercitationem.
            </p>
            <p className="mt-3 bold">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem
              blanditiis sint vitae architecto aut et est magni rem nam! Ipsa
              harum recusandae maiores nemo assumenda quidem quod blanditiis rem
              exercitationem.
            </p>
            <Form.Label className="label">
              Please Select from Below to receive your QR Code:
            </Form.Label>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: '0px',
                paddingRight: '0px',
              }}
            >
              <Button
                className="CommonButton"
                variant="secondary"
                style={{
                  fontSize: '1rem',
                  width: '48%',
                }}
                onClick={() => navigate('/QR-Code')}
              >
                Submit Request
              </Button>
              <Button
                className="CommonButton"
                variant="secondary"
                style={{
                  fontSize: '1rem',
                  width: '48%',
                }}
                onClick={() => navigate('')}
              >
                Cancel Request
              </Button>
            </Row>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              style={{
                fontSize: '1rem',
              }}
              onClick={() => navigate('/profile')}
            >
              Go to Profile
            </Button>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default CovidTestRequest;
