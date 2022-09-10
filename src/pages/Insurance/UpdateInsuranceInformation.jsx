import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loadable/Loading';
import Stepper from '../../components/common/Stepper';
import UserContext from '../../Context/UserContext';
import './../Common.css';
import './../Steps.css';

const UpdateInsuranceInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
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
    if (localStorage.getItem('user_token') === null) {
      navigate('/');
    } else {
      let user_token = localStorage.getItem('user_token');
      axios
        .get(`${REACT_APP_API}/patient?patient=${user_token}`)
        .then((res) => {
          if (res.data.statuscode == '200') {
            console.log(res.data.body[0]);
            /*             if (res.data.body[0].health_insurance === 'Yes') {
              setFormData({
                primary_insurance_carrier:
                  res.data.body[0].insurance_nformation
                    .primary_insurance_carrier || '',
                subscriber_member_id:
                  res.data.body[0].insurance_nformation.subscriber_member_id,
                group_number:
                  res.data.body[0].insurance_nformation.group_number,
                is_primary_insurance_holder:
                  res.data.body[0].insurance_nformation
                    .is_primary_insurance_holder,
                have_secondary_insurance_want_to_include:
                  res.data.body[0].insurance_nformation
                    .have_secondary_insurance_want_to_include,
              });
            } */
            setIsLoading(false);
          } else if (
            res.data.statuscode == '400' ||
            res.data.statuscode == '401'
          ) {
            navigate('/');
          }
        })
        .catch((error) => {
          console.log(error);
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
      let user_token = localStorage.getItem('user_token');
      axios
        .put(`${REACT_APP_API}/patient?patient=${user_token}`, {
          insurance_nformation: {
            primary_insurance_carrier: formData.primary_insurance_carrier,
            subscriber_member_id: formData.subscriber_member_id,
            is_primary_insurance_holder: formData.is_primary_insurance_holder,
            group_number: formData.group_number,
            have_secondary_insurance_want_to_include:
              formData.have_secondary_insurance_want_to_include,
          },
        })
        .then((res) => {
          if (res.data.statuscode == '200') {
            console.log(res);
            if (formData.have_secondary_insurance_want_to_include === 'Yes') {
              navigate('/update-secondary-insurance-information');
            } else {
              //if thier is no Health Insurance
              navigate('/profile');
            }
          } else if (
            res.data.statuscode == '400' ||
            res.data.statuscode == '401'
          ) {
            navigate('/profile');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  {
    return isLoading ? (
      <Loading />
    ) : (
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
              <h4 className="mt-3 HealthInsurance-h4">Insurance Information</h4>
              <Form
                onSubmit={handleSubmit}
                noValidate
                validated={validatedForm}
              >
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
                <Form.Label className=" mt-3 label">Group Number</Form.Label>

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
                    defaultChecked={
                      formData.is_primary_insurance_holder === 'Yes'
                    }
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
                    id={`radio-2`}
                    isInvalid
                    defaultChecked={
                      formData.is_primary_insurance_holder === 'No'
                    }
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
                    id={`radio-3`}
                    isInvalid
                    defaultChecked={
                      formData.have_secondary_insurance_want_to_include ===
                      'Yes'
                    }
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
                    id={`radio-4`}
                    defaultChecked={
                      formData.have_secondary_insurance_want_to_include === 'No'
                    }
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
            <Row className="mt-5">
              <Footer />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default UpdateInsuranceInformation;
