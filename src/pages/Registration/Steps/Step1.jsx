import React, { useContext, useState, useEffect } from 'react';
import 'react-phone-number-input/style.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import Footer from '../../../components/common/Footer';
import './../../Common.css';
import { Link, useNavigate } from 'react-router-dom';
import Stepper from '../../../components/common/Stepper';
import './../../Steps.css';
import axios from 'axios';
import UserContext from '../../../Context/UserContext';

const Step1 = () => {
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const { setContextData } = useContext(UserContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneControl, setPhoneControl] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailControl, setEmailControl] = useState('');
  const navigate = useNavigate();
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };
  useEffect(() => {
    if (localStorage.getItem('user_token') !== null) {
      navigate('/profile');
    }
  }, []);

  const handlePhoneSubmit = (event) => {
    event.preventDefault();
    if (
      phoneNumber === undefined ||
      isValidPhoneNumber(phoneNumber) === false ||
      phoneNumber == ''
    ) {
      setPhoneError(true);
      setPhoneControl('You must enter a valid Phone Number');
    } else {
      setPhoneError(false);
      axios
        .post(
          `${REACT_APP_API}/registration?identityType=Phone&identityValue=${phoneNumber}`
        )
        .then((res) => {
          if (res.data.statuscode == '200') {
            localStorage.setItem('Registered_user', res.data.body.patient);
            localStorage.setItem('Registered_user_code', res.data.body.code);

            localStorage.setItem('r_step', 2);
            setContextData((prevState) => {
              return {
                ...prevState,
                registrationInfo: {
                  setp: 2,
                  patient: res.data.body.patient,
                  patientCode: res.data.body.code,
                },
              };
            });
            navigate('/verification/step2');
          } else if (res.data.statuscode == '400') {
            setPhoneError(true);
            setPhoneControl(
              'This mobile number is registered, please enter another number!'
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const validateEmail = (email) => {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
      email
    );
  };
  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setEmailError(false);
    if (email.length === 0 || validateEmail(email) === false) {
      setEmailError(true);
      setEmailControl('You must enter a valid Email Address');
    } else {
      axios
        .post(
          `${REACT_APP_API}/registration?identityType=Email&identityValue=${email}`
        )
        .then((res) => {
          if (res.data.statuscode == '200') {
            setEmailError(false);
            localStorage.setItem('Registered_user', res.data.body.patient);
            localStorage.setItem('Registered_user_code', res.data.body.code);
            localStorage.setItem('r_step', 2);
            setContextData((prevState) => {
              return {
                ...prevState,
                patient: res.data.body.patient,
                patientCode: res.data.body.code,
              };
            });
            navigate('/verification/step2');
          } else if (res.data.statuscode == '400') {
            setEmailError(true);
            setEmailControl(
              'This Email is registered, please enter another Email!'
            );
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
          <Row className="justify-content-center" sm="8" md="8" xl="8" xxl="8">
            <Stepper step={0} width="70%" />
            <h4 className="bt-3 steps-custom-h4-1">Verification Step 1</h4>
            <p className="mt-3">
              Please Provide either your Phone Number or Email Below and Click
              the Button below your option to verify by EMAIL or TEXT Message.
              This is the method that the results of your Test will be sent to
              you.
            </p>
            <p className="bold">
              You must click the Verify By Text or Verify by Email Button to
              receive a Verification Code and Move forward.
            </p>
            <Form onSubmit={handlePhoneSubmit}>
              <Form.Label className="label">Phone</Form.Label>
              <PhoneInput
                className="PhoneInput"
                placeholder="(201) 555-0123"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e);
                  if (
                    e === undefined ||
                    isValidPhoneNumber(e) === false ||
                    e == ''
                  ) {
                    setPhoneError(true);
                  } else {
                    setPhoneError(false);
                  }
                }}
                defaultCountry="US"
              />
              {phoneError && <p className="errorNotify">{phoneControl}</p>}
              <Button
                type="submit"
                className="CommonButton"
                variant="secondary"
                /*                 onClick={() => navigate('/verification/step2')}
                 */
              >
                Verify by Text Message
              </Button>
            </Form>
            <p className="step1-p">
              Message and data rates may apply. Text STOP to opt out. Text HELP
              for help. The number of texts may vary.
              <br />
              <Link className="step1-link" to="/privacy">
                SMS Privacy Policy
              </Link>
            </p>
            <Form onSubmit={handleEmailSubmit}>
              <Form.Label className="label mt-2">Email Address</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="errorNotify">{emailControl}</p>}
              <Button
                type="submit"
                className="CommonButton mb-3"
                variant="secondary"
                /* onClick={() => navigate('/verification/step2')} */
              >
                Verify by Email
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

export default Step1;
