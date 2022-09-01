import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './Steps.css';

const UsCareAct = () => {
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
            <Stepper step={3} width="70%" />
            <h4 className="mt-3 HealthInsurance-h4">U.S CARES Act</h4>
            <p style={{ marginTop: '0px' }}>
              Please Provide the Below Information Below as it is required by
              the U.S. Act. Then click the Next Button.
              <br />
              <a
                className="regiserLink-1 link2"
                rel="noopener noreferrer"
                target="_blank"
                href="https://home.treasury.gov/policy-issues/coronavirus"
              >
                U.S. CARES Act
              </a>
            </p>

            <Form>
              <Form.Label className="label">Patient Rate</Form.Label>
              <select className="dropDwon" name="day" id="day">
                <option value="1">1</option>
              </select>
              <Form.Label className="label">Patient Eithnicity</Form.Label>
              <select className="dropDwon" name="day" id="day">
                <option value="1">1</option>
              </select>
              <Form.Label className="label">Patient Sex</Form.Label>
              <select className="dropDwon" name="day" id="day">
                <option value="1">Male</option>
                <option value="1">Female</option>
              </select>
              <Button
                className="CommonButton mt-4"
                variant="secondary"
                onClick={() => navigate('/test-dependent')}
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

export default UsCareAct;
