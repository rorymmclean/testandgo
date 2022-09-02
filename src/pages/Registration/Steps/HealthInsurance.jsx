import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './Steps.css';

const HealthInsurance = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row
            className="justify-content-center"
            xs="10"
            sm="8"
            md="6"
            lg="5"
            xl="4"
            xxl="4"
          >
            <Stepper step={1} width="70%" />
          </Row>
          <Row
            className=" justify-content-center mb-3"
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <h4 className="mt-3 HealthInsurance-h4">Do you have Insurance?</h4>
            <p className="mt-3 custom-p">Do you have Health Insurance?</p>

            <Form>
              <Form.Check
                className="mt-3"
                label="Yes"
                name="group1"
                type="radio"
                id={`radio-1`}
                isInvalid
                defaultChecked
              />
              <Form.Check
                label="No"
                name="group1"
                type="radio"
                id={`radio-2`}
                isInvalid
              />

              <Button
                className="CommonButton mt-3 "
                variant="secondary"
                style={{
                  marginBottom: '150px',
                }}
                onClick={() => navigate('/insurance-information')}
              >
                Next
              </Button>
            </Form>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default HealthInsurance;