import React, { useState } from 'react';
import 'react-phone-number-input/style.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import Footer from '../../../components/common/Footer';
import './../../Common.css';
import { Link, useNavigate } from 'react-router-dom';
import Stepper from '../../../components/common/Stepper';
import './Steps.css';

const Step1 = () => {
  const [phoneNumber, setPhoneNumbe] = useState();
  const navigate = useNavigate();
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <Stepper step={0} width="70%" />
            <h4 className="bt-3 steps-custom-h4-1">Verification Step 1</h4>
            <p className="mt-3">
              Click the button below to verify by either email or text message.
              This is the method that results will be sent to you. You must
              click the link in the message in order to verify.
            </p>
            <p className="bold">
              You must click the Verify By Text or Verify by Email Button to
              receive a Verification Code and Move forward
            </p>
            <Form>
              <Form.Label className="label">Phone</Form.Label>
              <PhoneInput
                className="PhoneInput"
                placeholder="(201) 555-0123"
                value={phoneNumber}
                onChange={setPhoneNumbe}
                defaultCountry="US"
              />
              <Button
                className="CommonButton"
                variant="secondary"
                onClick={() => navigate('/registration/step1/verification')}
              >
                Verify by Text Message
              </Button>
            </Form>
            <p className="step1-p">
              Message and data rates may apply. Text STOP to opt out. Text HELP
              for help. The number of texts may vary.
              <br />
              <Link className="step1-link" to="/privacy">
                SMS Privacy policy
              </Link>
            </p>
            <Form>
              <Form.Label className="label">Email Address</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="email"
                placeholder="name@example.com"
              />
              <Button
                className="CommonButton mb-3"
                variant="secondary"
                onClick={() => navigate('/registration/step1/verification')}
              >
                Verify by Email
              </Button>
            </Form>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default Step1;
