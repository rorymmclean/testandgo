import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './Steps.css';

const Step1Verification = () => {
  const navigate = useNavigate();
  const [validatedForm, setValidatedForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const handleVerificationSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    //validating input
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      if (verificationCode === '') {
        setError('This Field is Required');
      }
    }
    setValidatedForm(true);
  };
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <Stepper step={0} width="70%" />
            <h4 className="mt-3 steps-custom-h4-1">Verification Step 2</h4>
            <p style={{ marginTop: '30px' }}>
              Please Insert the code you received via Email or Text Message
              below.
            </p>
            <p className="bold">
              Click Next to Move to the Patient Information Step.
            </p>

            <Form
              noValidate
              validated={validatedForm}
              onSubmit={handleVerificationSubmit}
            >
              <Form.Label className="label">Enter Verification Code</Form.Label>
              <Form.Control
                autoFocus
                required
                className="hieght-50px"
                type="text"
                placeholder="1234567"
                onChange={(e) => setVerificationCode(e.target.value)}
                value={verificationCode}
              />
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
              <Button
                type="submit"
                className="CommonButton"
                variant="secondary"
                onClick={() => navigate('/PatiaentInformationStep')}
              >
                Next
              </Button>
              <Button className=" redSend" variant="link">
                Re-send Code
              </Button>
            </Form>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default Step1Verification;
