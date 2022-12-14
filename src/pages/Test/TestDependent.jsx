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

const TestDependent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };
  const [formData, setFormData] = useState('Myself');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData !== 'Myself') {
      console.log('navigate to add dependent');
      navigate('/test-For-dependent');
    } else {
      let patient = localStorage.getItem('user_token');
      axios
        .post(`${REACT_APP_API}/case`, {
          patient_guid: patient,
          test: 'covid-19',
          test_for: formData,
        })
        .then((res) => {
          if (res.data.statuscode == '200') {
            console.log(res.data.body);
            localStorage.setItem('case_id', res.data.body.case_guid);
            localStorage.setItem('test_step', 2);
            navigate('/covid-exposure');
          } else if (
            res.data.statuscode == '400' ||
            res.data.statuscode == '401'
          ) {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
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
            <Stepper step={6} width="70%" />
            <h4 className="mt-3 patiaentInformation-h4">
              Is this test for you or a dependent?
            </h4>
          </Row>
          <Row
            className="justify-content-center mb-3"
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
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

            <Form onSubmit={handleSubmit}>
              <Form.Label className="label">
                Please Select the best Option:
              </Form.Label>
              <Form.Group>
                <Form.Check
                  className="mt-3 custom-checkbox"
                  label="Myself"
                  name="group1"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  defaultChecked
                  onChange={() => setFormData('Myself')}
                />
                <Form.Check
                  label="Dependent Under the age of 18"
                  name="group1"
                  type="radio"
                  id={`radio-2`}
                  isInvalid
                  onChange={() => setFormData('Dependent Under the age of 18')}
                />
                <Form.Check
                  label="Dependent Over the age of 18"
                  name="group1"
                  type="radio"
                  id={`radio-3`}
                  isInvalid
                  onChange={() => setFormData('Dependent Over the age of 18')}
                />
              </Form.Group>

              <Button
                className="CommonButton mt-4"
                variant="secondary"
                type="submit"
                //onClick={() => navigate('/covid-exposure')}
              >
                Submit
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

export default TestDependent;
