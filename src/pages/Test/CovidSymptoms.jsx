import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Stepper from '../../components/common/Stepper';
import Footer from '../../components/common/Footer';
import './../Common.css';
import './../Steps.css';

const CovidSyptoms = () => {
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
            <h4 className="mt-3 HealthInsurance-h4">Symptoms to COVID-19</h4>
            <p className="mt-3">
              People with COVID-19 have had a wide range of symptoms reported -
              ranging from mild symptoms to severe illness. Sypmtoms may appear
              2-14 days after exposure to the virus. Anyone can have mild to
              severe symptoms.
            </p>

            <Form>
              <Form.Label className="label">
                Do you or your dependent have any of the following symptoms?
              </Form.Label>
              <Form.Group>
                <Form.Check
                  className="mt-3"
                  label="Fever or chills"
                  name="group1"
                  type="checkbox"
                  id={`radio-1`}
                  isInvalid
                />
                <Form.Check
                  label="Cough"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="Shortness of breath or difficulty breathing"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="Fatigue"
                  name="group1"
                  type="checkbox"
                  id={`radio-1`}
                  isInvalid
                />
                <Form.Check
                  label="Muscle or body aches"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="Headache"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="New loss of taste or smell"
                  name="group1"
                  type="checkbox"
                  id={`radio-1`}
                  isInvalid
                />
                <Form.Check
                  label="sore throat"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="congestion or runny nose"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="Nausea or vomiting"
                  name="group1"
                  type="checkbox"
                  id={`radio-1`}
                  isInvalid
                />
                <Form.Check
                  label="Diarrhea"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
                <Form.Check
                  label="None of the above"
                  name="group1"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                />
              </Form.Group>
              <p className="mt-4 bold">
                This list does not include all possible symptoms.
                <span style={{ fontWeight: 'normal' }}>
                  CDC will continue to update this list as we learn more about
                  Covid-19.
                  <a
                    className="regiserLink-1 "
                    style={{
                      marginTop: '10px',
                      fontSize: '15px',
                      fontWeight: '400',
                      textDecoration: 'none',
                      color: 'red',
                    }}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://home.treasury.gov/policy-issues/coronavirus"
                  >
                    {' '}
                    Oleder adults
                  </a>
                  and people who have underlying
                  <a
                    className="regiserLink-1 "
                    style={{
                      marginTop: '10px',
                      fontSize: '15px',
                      fontWeight: '400',
                      textDecoration: 'none',
                      color: 'red',
                    }}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://home.treasury.gov/policy-issues/coronavirus"
                  >
                    {' '}
                    medical conditions{' '}
                  </a>
                  like heart or lung disease or diabetes are at higher risk for
                  getting very sick from COVID-19.
                </span>
              </p>
              <Form.Label className="mt-3 label">Confirmation</Form.Label>
              <Form.Check
                className="mt-1"
                label="Acknowledge / Acceptance"
                name="group2"
                type="checkbox"
                id={`radio-1`}
                isInvalid
              />
              <Button
                className="CommonButton mt-4"
                variant="secondary"
                onClick={() => navigate('/covid-test-request')}
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

export default CovidSyptoms;
