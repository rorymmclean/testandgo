import React, { useContext, useState } from 'react';
import 'react-phone-number-input/style.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import Footer from '../../../components/common/Footer';
import './../../Common.css';
import { Link, useNavigate } from 'react-router-dom';
import Stepper from '../../../components/common/Stepper';
import './Steps.css';
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
  const handlePhoneSubmit = (event) => {
    event.preventDefault();
    if (
      phoneNumber === undefined ||
      isValidPhoneNumber(phoneNumber) === false ||
      phoneNumber == ''
    ) {
      setPhoneError(true);
      setPhoneControl('You must enter a valid Phone');
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
            navigate('/registration/step1/verification');
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
  const handleEmailSubmit = (event) => {
    event.preventDefault();
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
          navigate('/registration/step1/verification');
        } else if (res.data.statuscode == '400') {
          setEmailError(true);
          setEmailControl(
            'This mobile number is registered, please enter another number!'
          );
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
              {phoneError && (
                <p
                  style={{
                    marginTop: ' 0.25rem',
                    fontSize: '.875em',
                    color: '#dc3545',
                  }}
                >
                  {phoneControl}
                </p>
              )}
              <Button
                type="submit"
                className="CommonButton"
                variant="secondary"
                /*                 onClick={() => navigate('/registration/step1/verification')}
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
                SMS Privacy policy
              </Link>
            </p>
            <Form onSubmit={handleEmailSubmit}>
              <Form.Label className="label">Email Address</Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p
                  style={{
                    marginTop: ' 0.25rem',
                    fontSize: '.875em',
                    color: '#dc3545',
                  }}
                >
                  {emailControl}
                </p>
              )}
              <Button
                type="submit"
                className="CommonButton mb-3"
                variant="secondary"
                /* onClick={() => navigate('/registration/step1/verification')} */
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
