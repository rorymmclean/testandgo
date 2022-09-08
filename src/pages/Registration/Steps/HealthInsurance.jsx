import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import UserContext from '../../../Context/UserContext';
import './../../Common.css';
import './../../Steps.css';
import stepsObject from './stepsObject';

const HealthInsurance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [healthInsurance, setHealthInsurance] = useState('Yes');
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };

  useEffect(() => {
    //check were is the real step that user should be in!
    if (localStorage.getItem('r_step') === null) {
      navigate('/');
    } else if (localStorage.getItem('r_step') != 4) {
      navigate(stepsObject[localStorage.getItem('r_step')]);
    }
    //udapte or register mode
    if (
      location.pathname !== '/health-insurance' ||
      localStorage.getItem('Registered_user') === null
    ) {
      navigate('/');
    } else {
      setContextData((prevState) => {
        return {
          ...prevState,
          registrationInfo: {
            setp: 4,
            patient: localStorage.getItem('Registered_user'),
            patientCode: localStorage.getItem('Registered_user_code'),
          },
        };
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .put(
        `${REACT_APP_API}/patient?patient=${contextData.registrationInfo.patient}`,
        {
          health_insurance: healthInsurance,
        }
      )
      .then((res) => {
        if (res.data.statuscode == '200') {
          if (healthInsurance === 'Yes') {
            //if thier is Health Insurance
            localStorage.setItem('r_step', 5);
            setContextData((prevState) => {
              return {
                ...prevState,
                registrationInfo: {
                  ...prevState.registrationInfo,
                  setp: 5,
                },
              };
            });
            localStorage.setItem('healthi_nsurance', 'yes');
            navigate('/insurance-information');
            navigate(0);
          } else {
            //if thier is Health Insurance
            localStorage.setItem('r_step', 12);
            setContextData((prevState) => {
              return {
                ...prevState,
                registrationInfo: {
                  ...prevState.registrationInfo,
                  setp: 12,
                },
              };
            });
            localStorage.setItem('healthi_nsurance', 'no');
            navigate('/UsCareAct');
            navigate(0);
          }
        } else if (
          res.data.statuscode == '400' ||
          res.data.statuscode == '401'
        ) {
          localStorage.setItem('r_step', 1);
          navigate('/verification/step1');
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
            className="justify-content-center"
            xs="10"
            sm="8"
            md="6"
            lg="5"
            xl="4"
            xxl="4"
          >
            <Stepper step={2} width="70%" />
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

            <Form onSubmit={handleSubmit}>
              <Form.Check
                className="mt-3"
                label="Yes"
                name="group1"
                type="radio"
                id={`radio-1`}
                isInvalid
                defaultChecked
                onChange={() => setHealthInsurance('Yes')}
              />
              <Form.Check
                label="No"
                name="group1"
                type="radio"
                id={`radio-2`}
                isInvalid
                onChange={() => setHealthInsurance('No')}
              />

              <Button
                className="CommonButton mt-5 "
                variant="secondary"
                style={{
                  marginBottom: '150px',
                }}
                type="submit"
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
