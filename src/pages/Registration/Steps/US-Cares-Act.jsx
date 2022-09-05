import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import UserContext from '../../../Context/UserContext';
import './../../Common.css';
import './Steps.css';
import stepsObject from './stepsObject';

const UsCareAct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };
  const [formData, setFormData] = useState({
    patient_race: '',
    patient_ethnicity: '',
    patient_sex: '',
  });
  const [formDataError, setFormDataError] = useState({
    patient_race: false,
    patient_ethnicity: false,
    patient_sex: false,
  });

  useEffect(() => {
    //check were is the real step that user should be in!
    if (localStorage.getItem('r_step') === null) {
      navigate('/');
    } else if (localStorage.getItem('r_step') != 12) {
      navigate(stepsObject[localStorage.getItem('r_step')]);
    }

    //udapte or register mode
    if (
      location.pathname !== '/UsCareAct' ||
      localStorage.getItem('Registered_user') === null
    ) {
      navigate('/');
    } else {
      setContextData((prevState) => {
        return {
          ...prevState,
          registrationInfo: {
            setp: 12,
            patient: localStorage.getItem('Registered_user'),
            patientCode: localStorage.getItem('Registered_user_code'),
          },
        };
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // form validation
    setFormDataError({
      patient_race: false,
      patient_ethnicity: false,
      patient_sex: false,
    });
    if (
      formData.patient_race === '' ||
      formData.patient_ethnicity === '' ||
      formData.patient_sex === ''
    ) {
      if (formData.patient_race === '') {
        setFormDataError((prev) => {
          return {
            ...prev,
            patient_race: true,
          };
        });
      }
      if (formData.patient_ethnicity === '') {
        setFormDataError((prev) => {
          return {
            ...prev,
            patient_ethnicity: true,
          };
        });
      }
      if (formData.patient_sex === '') {
        setFormDataError((prev) => {
          return {
            ...prev,
            patient_sex: true,
          };
        });
      }
    } else {
      // ready to send to api

      axios
        .put(
          `${REACT_APP_API}/patient?patient=${contextData.registrationInfo.patient}`,
          {
            us_cares_Act: {
              patient_race: formData.patient_race,
              patient_ethnicity: formData.patient_ethnicity,
              patient_sex: formData.patient_sex,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.statuscode == '200') {
            //if thier is Health Insurance
            localStorage.setItem('r_step', 13);
            setContextData((prevState) => {
              return {
                ...prevState,
                registrationInfo: {
                  ...prevState.registrationInfo,
                  setp: 13,
                },
              };
            });
            navigate('/test-dependent');
          } else if (
            res.data.statuscode == '400' ||
            res.data.statuscode == '401'
          ) {
            localStorage.setItem('r_step', 1);
            navigate('/registration/step1');
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

            <Form onSubmit={handleSubmit}>
              <Form.Label className="label">Patient Race</Form.Label>
              <select
                className="dropDwon"
                name="patient_race"
                id="patient_race"
                value={formData.patient_race}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      patient_race: e.target.value,
                    };
                  })
                }
              >
                <option value="" disabled>
                  Select your option
                </option>

                <option value="American Indian or Alaska Native">
                  American Indian or Alaska Native
                </option>
                <option value="Asian">Asian</option>
                <option value="Black or African Anerican">
                  Black or African Anerican
                </option>
                <option value="hispanix">hispanix</option>
                <option value="Native Hawaiian or Other Pacific Islander">
                  Native Hawaiian or Other Pacific Islander
                </option>
                <option value="White">White</option>
                <option value="Other Race">Other Race</option>
              </select>
              {formDataError.patient_race && (
                <p
                  style={{
                    marginTop: ' 0.25rem',
                    fontSize: '.875em',
                    color: '#dc3545',
                  }}
                >
                  Please select an option
                </p>
              )}

              <Form.Label className="label">Patient Eithnicity</Form.Label>
              <select
                className="dropDwon"
                name="patient_eithnicity"
                id="patient_eithnicity"
                value={formData.patient_ethnicity}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      patient_ethnicity: e.target.value,
                    };
                  })
                }
              >
                <option value="" disabled>
                  Select your option
                </option>
                <option value="Hispanic or Latino">Hispanic or Latino</option>
                <option value="Not Hispanic or Latino">
                  Not Hispanic or Latino
                </option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {formDataError.patient_ethnicity && (
                <p
                  style={{
                    marginTop: ' 0.25rem',
                    fontSize: '.875em',
                    color: '#dc3545',
                  }}
                >
                  Please select an option
                </p>
              )}

              <Form.Label className="label">Patient Sex</Form.Label>
              <select
                className="dropDwon"
                name="patient_sex"
                id="patient_sex"
                value={formData.patient_sex}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      patient_sex: e.target.value,
                    };
                  })
                }
              >
                <option value="" disabled>
                  Select your option
                </option>
                <option value="Hispanic or Latino">Hispanic or Latino</option>
                <option value="Not Hispanic or Latino">
                  Not Hispanic or Latino
                </option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {formDataError.patient_sex && (
                <p
                  style={{
                    marginTop: ' 0.25rem',
                    fontSize: '.875em',
                    color: '#dc3545',
                  }}
                >
                  Please select an option
                </p>
              )}
              <Button
                className="CommonButton mt-4"
                variant="secondary"
                type="submit"
                /* onClick={() => navigate('/test-dependent')} */
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
