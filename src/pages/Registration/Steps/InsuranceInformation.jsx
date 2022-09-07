import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import UserContext from '../../../Context/UserContext';
import './../../Common.css';
import './../../Steps.css';
import stepsObject from './stepsObject';

const InsuranceInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [validatedForm, setValidatedForm] = useState(false);
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const [formData, setFormData] = useState({
    primary_insurance_carrier: '',
    subscriber_member_id: '',
    group_number: '',
    is_primary_insurance_holder: 'No',
    have_secondary_insurance_want_to_include: 'No',
  });
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };

  useEffect(() => {
    //check were is the real step that user should be in!
    if (localStorage.getItem('r_step') === null) {
      navigate('/');
    } else if (localStorage.getItem('r_step') != 5) {
      navigate(stepsObject[localStorage.getItem('r_step')]);
    }

    //udapte or register mode
    if (
      location.pathname !== '/insurance-information' ||
      localStorage.getItem('Registered_user') === null
    ) {
      navigate('/');
    } else {
      setContextData((prevState) => {
        return {
          ...prevState,
          registrationInfo: {
            setp: 5,
            patient: localStorage.getItem('Registered_user'),
            patientCode: localStorage.getItem('Registered_user_code'),
          },
        };
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setValidatedForm(true);
    } else {
      //ready to send data to api

      axios
        .put(
          `${REACT_APP_API}/patient?patient=${contextData.registrationInfo.patient}`,
          {
            insurance_nformation: {
              primary_insurance_carrier: formData.primary_insurance_carrier,
              subscriber_member_id: formData.subscriber_member_id,
              is_primary_insurance_holder: formData.is_primary_insurance_holder,
              group_number: formData.group_number,
              have_secondary_insurance_want_to_include:
                formData.have_secondary_insurance_want_to_include,
            },
          }
        )
        .then((res) => {
          if (res.data.statuscode == '200') {
            if (formData.have_secondary_insurance_want_to_include === 'Yes') {
              //if thier is Health Insurance
              localStorage.setItem('r_step', 6);
              setContextData((prevState) => {
                return {
                  ...prevState,
                  registrationInfo: {
                    ...prevState.registrationInfo,
                    setp: 6,
                  },
                };
              });
              navigate('/secondary-insurance-information');
              //navigate(0);
            } else {
              //if thier is no Health Insurance
              localStorage.setItem('r_step', 7);
              setContextData((prevState) => {
                return {
                  ...prevState,
                  registrationInfo: {
                    ...prevState.registrationInfo,
                    setp: 7,
                  },
                };
              });
              navigate('/UsCareAct');
              //navigate(0);
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
            <Stepper step={1} width="70%" />
          </Row>
          <Row
            className="justify-content-center mb-3"
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <h4 className="mt-3 HealthInsurance-h4">Insurance Information</h4>
            <Form onSubmit={handleSubmit} noValidate validated={validatedForm}>
              <Form.Label className=" mt-3 label">
                Primary Insurance Carrier
              </Form.Label>
              <Form.Control
                autoFocus
                required
                className="hieght-50px"
                value={formData.primary_insurance_carrier}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      primary_insurance_carrier: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide Primary Insurance Carrier
              </Form.Control.Feedback>
              <Form.Label className=" mt-3 label">
                Subscriber / Member ID
              </Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                value={formData.subscriber_member_id}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      subscriber_member_id: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Subscriber / Member ID.
              </Form.Control.Feedback>
              <Form.Label className=" mt-3 label">Group number</Form.Label>

              <Form.Control
                required
                className="hieght-50px"
                value={formData.group_number}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      group_number: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Group Number.
              </Form.Control.Feedback>
              <p className="mt-3 custom-p">
                Are you the Primary Insurance Holder in your household?
              </p>
              <Form.Group>
                <Form.Check
                  className="mt-3"
                  label="Yes"
                  name="group1"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  onChange={() =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        is_primary_insurance_holder: 'Yes',
                      };
                    })
                  }
                />
                <Form.Check
                  label="No"
                  name="group1"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  defaultChecked
                  onChange={() => {
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        is_primary_insurance_holder: 'No',
                      };
                    });
                  }}
                />
              </Form.Group>
              <p className="mt-3 custom-p">
                Do you hav a Secondary Insurance you want to include as well?
              </p>
              <Form.Group>
                <Form.Check
                  className="mt-3"
                  label="Yes"
                  name="group2"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  onChange={(e) =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        have_secondary_insurance_want_to_include: 'Yes',
                      };
                    })
                  }
                />
                <Form.Check
                  label="No"
                  name="group2"
                  type="radio"
                  id={`radio-2`}
                  defaultChecked
                  isInvalid
                  onChange={() =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        have_secondary_insurance_want_to_include: 'No',
                      };
                    })
                  }
                />
              </Form.Group>

              <Button
                type="submit"
                className="CommonButton mt-3 "
                variant="secondary"
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

export default InsuranceInformation;
