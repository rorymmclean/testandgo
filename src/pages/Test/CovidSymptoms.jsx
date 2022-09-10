import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Stepper from '../../components/common/Stepper';
import Footer from '../../components/common/Footer';
import './../Common.css';
import './../Steps.css';
import UserContext from '../../Context/UserContext';
import axios from 'axios';

const CovidSyptoms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const [symptoms, setSymptoms] = useState({
    Fever_or_chills: false,
    Cough: false,
    Shortness_of_breath_or_difficulty_breathing: false,
    Fatigue: false,
    Muscle_or_body_aches: false,
    Headache: false,
    New_loss_of_taste_or_smell: false,
    Sore_throat: false,
    Congestion_or_runny_nose: false,
    Nausea_or_vomiting: false,
    Diarrhea: false,
  });
  const [noSymptoms, setNoSymptoms] = useState(false);
  const [accepet, setAccept] = useState(false);
  const [acceptError, setAcceptError] = useState(false);
  const [checkError, setCheckError] = useState(false);
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCheckError(false);
    localStorage.setItem('checkError', 0);
    setAcceptError(false);
    localStorage.setItem('acceptError', 0);

    if (
      symptoms.Fever_or_chills === false &&
      symptoms.Cough === false &&
      symptoms.Shortness_of_breath_or_difficulty_breathing === false &&
      symptoms.Fatigue === false &&
      symptoms.Muscle_or_body_aches === false &&
      symptoms.Headache === false &&
      symptoms.New_loss_of_taste_or_smell === false &&
      symptoms.Sore_throat === false &&
      symptoms.Congestion_or_runny_nose === false &&
      symptoms.Nausea_or_vomiting === false &&
      symptoms.Diarrhea === false &&
      noSymptoms === false
    ) {
      setCheckError(true);
      localStorage.setItem('checkError', 1);
    }
    if (accepet === false) {
      setAcceptError(true);
      localStorage.setItem('acceptError', 1);
    }
    let checkError = localStorage.getItem('checkError');
    let acceptError = localStorage.getItem('acceptError');
    if (checkError == 0 && acceptError == 0) {
      let case_id = localStorage.getItem('case_id');
      localStorage.removeItem('checkError');
      localStorage.removeItem('acceptError');
      let requestBody = {
        Fever_or_chills: false,
        Cough: false,
        Shortness_of_breath_or_difficulty_breathing: false,
        Fatigue: false,
        Muscle_or_body_aches: false,
        Headache: false,
        New_loss_of_taste_or_smell: false,
        Sore_throat: false,
        Congestion_or_runny_nose: false,
        Nausea_or_vomiting: false,
        Diarrhea: false,
      };
      axios
        .put(`${REACT_APP_API}/case?case=${case_id}`, {
          symptoms: requestBody,
        })
        .then((res) => {
          if (res.data.statuscode == '200') {
            localStorage.setItem('kiosk_code', res.data.body.kiosk_code);
            localStorage.setItem('test_step', 4);
            navigate('/covid-test-request');
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

            <Form onSubmit={handleSubmit}>
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
                  checked={symptoms.Fever_or_chills}
                  onChange={() => {
                    /*                     if (symptoms.Fever_or_chills === false) {
                      if (noSymptoms === true) setNoSymptoms(false);
                    } */
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Fever_or_chills: !symptoms.Fever_or_chills,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Cough"
                  name="group2"
                  type="checkbox"
                  id={`radio-2`}
                  isInvalid
                  checked={symptoms.Cough}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Cough: !symptoms.Cough,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Shortness of breath or difficulty breathing"
                  name="group3"
                  type="checkbox"
                  id={`radio-3`}
                  isInvalid
                  checked={symptoms.Shortness_of_breath_or_difficulty_breathing}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Shortness_of_breath_or_difficulty_breathing: !symptoms.Shortness_of_breath_or_difficulty_breathing,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Fatigue"
                  name="group4"
                  type="checkbox"
                  id={`radio-4`}
                  isInvalid
                  checked={symptoms.Fatigue}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Fatigue: !symptoms.Fatigue,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Muscle or body aches"
                  name="group5"
                  type="checkbox"
                  id={`radio-5`}
                  isInvalid
                  checked={symptoms.Muscle_or_body_aches}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Muscle_or_body_aches: !symptoms.Muscle_or_body_aches,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Headache"
                  name="group6"
                  type="checkbox"
                  id={`radio-6`}
                  isInvalid
                  checked={symptoms.Headache}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Headache: !symptoms.Headache,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="New loss of taste or smell"
                  name="group7"
                  type="checkbox"
                  id={`radio-7`}
                  isInvalid
                  checked={symptoms.New_loss_of_taste_or_smell}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        New_loss_of_taste_or_smell: !symptoms.New_loss_of_taste_or_smell,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Sore throat"
                  name="group8"
                  type="checkbox"
                  id={`radio-8`}
                  isInvalid
                  checked={symptoms.Sore_throat}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Sore_throat: !symptoms.Sore_throat,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Congestion or runny nose"
                  name="group9"
                  type="checkbox"
                  id={`radio-9`}
                  isInvalid
                  checked={symptoms.Congestion_or_runny_nose}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Congestion_or_runny_nose: !symptoms.Congestion_or_runny_nose,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Nausea or vomiting"
                  name="group10"
                  type="checkbox"
                  id={`radio-10`}
                  isInvalid
                  checked={symptoms.Nausea_or_vomiting}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Nausea_or_vomiting: !symptoms.Nausea_or_vomiting,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="Diarrhea"
                  name="group11"
                  type="checkbox"
                  id={`radio-11`}
                  isInvalid
                  checked={symptoms.Diarrhea}
                  onChange={() => {
                    if (noSymptoms === true) setNoSymptoms(false);
                    setSymptoms((prev) => {
                      return {
                        ...prev,
                        Diarrhea: !symptoms.Diarrhea,
                      };
                    });
                  }}
                />
                <Form.Check
                  label="None of the above"
                  name="group12"
                  type="checkbox"
                  id={`radio-12`}
                  isInvalid
                  checked={noSymptoms}
                  onChange={() => {
                    setSymptoms({
                      Fever_or_chills: false,
                      Cough: false,
                      Shortness_of_breath_or_difficulty_breathing: false,
                      Fatigue: false,
                      Muscle_or_body_aches: false,
                      Headache: false,
                      New_loss_of_taste_or_smell: false,
                      Sore_throat: false,
                      Congestion_or_runny_nose: false,
                      Nausea_or_vomiting: false,
                      Diarrhea: false,
                    });
                    setNoSymptoms(!noSymptoms);
                  }}
                />
                {checkError && (
                  <p
                    style={{
                      marginTop: ' 0.25rem',
                      fontSize: '.875em',
                      color: '#dc3545',
                    }}
                  >
                    This Field is Required
                  </p>
                )}
              </Form.Group>
              <p className="mt-4 bold">
                This list does not include all possible symptoms.{' '}
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
                    Oleder adults{' '}
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
                label="Acknowledge / Accept"
                name="group13"
                type="checkbox"
                id={`radio-13`}
                isInvalid
                checked={accepet}
                onChange={() => setAccept(!accepet)}
              />
              {acceptError && (
                <p className="errorNotify">This Field is Required</p>
              )}
              <Button
                className="CommonButton mt-4"
                variant="secondary"
                type="submit"
                /* onClick={() => navigate('/covid-test-request')} */
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

export default CovidSyptoms;
