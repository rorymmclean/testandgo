import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './Steps.css';

const VerificationDirections = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <Stepper step={1.5} width="70%" />
            <h4 className="mt-3 HealthInsurance-h4">Verification Directions</h4>
            <p className="mt-3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus
              ipsam corrupti quaerat eaque voluptate eius sit debitis. Ipsum
              quam, eos amet aliquid enim numquam quis deleniti molestiae,
              placeat vero commodi.
            </p>
            <p className="bold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              deleniti atque, veniam rem enim consequuntur itaque.
            </p>

            <Form>
              <Form.Label className="label">Confirmation</Form.Label>
              <Form.Check
                className="mt-2"
                style={{ color: '#000' }}
                label="Acknowledge / Acceptance"
                name="group2"
                type="radio"
                id={`radio-1`}
                isInvalid
                defaultChecked
              />
              <Button
                className="CommonButton mt-4 mb-3"
                variant="secondary"
                onClick={() => {
                  localStorage.setItem('r_step', 8);
                  navigate('/driver-license-front');
                }}
              >
                Submit
              </Button>
            </Form>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default VerificationDirections;
