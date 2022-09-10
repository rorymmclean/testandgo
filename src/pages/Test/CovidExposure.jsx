import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Stepper from '../../components/common/Stepper';
import UserContext from '../../Context/UserContext';
import './../Common.css';
import './../Steps.css';
const CovidExposure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };
  const [formData, setFormData] = useState('Yes');
  const handleSubmit = (event) => {
    event.preventDefault();
    let case_id = localStorage.getItem('case_id');
    axios
      .put(`${REACT_APP_API}/case?case=${case_id}`, {
        exposed_to_covid19: formData,
      })
      .then((res) => {
        if (res.data.statuscode == '200') {
          localStorage.setItem('test_step', 3);
          navigate('/covid-symptoms');
        } else if (
          res.data.statuscode == '400' ||
          res.data.statuscode == '401'
        ) {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
            <h4 className="mt-3 HealthInsurance-h4 ">Exposure to COVID-19</h4>
            <p className="mt-3">
              If you were exposed to the virus that causes COVID-19 or have been
              told by a healthcare provider or public health authrity that you
              were exposed, here are the steps that you should take, regardless
              of your vaccination status or if you have had a previous
              infection. Learn how COVID-19 spreads and the
              <a
                className="regiserLink-1 link2"
                rel="noopener noreferrer"
                target="_blank"
                href="https://home.treasury.gov/policy-issues/coronavirus"
              >
                {' '}
                factors that make risk of spread higher or lower.
              </a>
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Label className="label">
                Have you or your dependent recently been exposed to COVID?{' '}
              </Form.Label>
              <Form.Group>
                <Form.Check
                  className="mt-3"
                  label="Yes"
                  name="group1"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  defaultChecked
                  onChange={() => setFormData('Yes')}
                />
                <Form.Check
                  label="No"
                  name="group1"
                  type="radio"
                  id={`radio-2`}
                  isInvalid
                  onChange={() => setFormData('No')}
                />
                <Form.Check
                  label="I do not know"
                  name="group1"
                  type="radio"
                  id={`radio-3`}
                  isInvalid
                  onChange={() => setFormData('I do not know')}
                />
              </Form.Group>

              <Button
                className="CommonButton mt-4"
                variant="secondary"
                type="submit"
                /* onClick={() => navigate('/covid-symptoms')} */
              >
                Next
              </Button>
            </Form>
          </Row>
          <Row className="mt-5">
            <Footer />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CovidExposure;
