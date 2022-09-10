import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loadable/Loading';
import Stepper from '../../components/common/Stepper';
import './../Common.css';
import './../Steps.css';

const UpdateSecondaryInsuranceInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [validatedForm, setValidatedForm] = useState(false);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const [formData, setFormData] = useState({
    secodary_insurance_carrier: '',
    secodary_subscriber_member_id: '',
    secodary_group_number: '',
    is_secondary_insurance_for_yourself: 'My Self',
    is_secondary_insurance_government_provided: 'No',
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
            if (
              res.data.body[0].insurance_nformation
                .have_secondary_insurance_want_to_include === 'Yes'
            ) {
              console.log(res.data.body[0].secodary_insurance_nformation);
              setFormData({
                secodary_insurance_carrier:
                  res.data.body[0].secodary_insurance_nformation
                    .secodary_insurance_carrier,
                secodary_subscriber_member_id:
                  res.data.body[0].secodary_insurance_nformation
                    .secodary_subscriber_member_id,
                secodary_group_number:
                  res.data.body[0].secodary_insurance_nformation
                    .secodary_group_number,
                is_secondary_insurance_for_yourself:
                  res.data.body[0].secodary_insurance_nformation
                    .is_secondary_insurance_for_yourself,
                is_secondary_insurance_government_provided:
                  res.data.body[0].secodary_insurance_nformation
                    .is_secondary_insurance_government_provided,
              });
            }

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
          secodary_insurance_nformation: {
            secodary_insurance_carrier: formData.secodary_insurance_carrier,

            secodary_subscriber_member_id:
              formData.secodary_subscriber_member_id,

            secodary_group_number: formData.secodary_group_number,

            is_secondary_insurance_for_yourself:
              formData.is_secondary_insurance_for_yourself,

            is_secondary_insurance_government_provided:
              formData.is_secondary_insurance_government_provided,
          },
        })
        .then((res) => {
          if (res.data.statuscode == '200') {
            //if thier is Health Insurance
            navigate('/profile');
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

  {
    return isLoading ? (
      <Loading />
    ) : (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
            <Row
              className="justify-content-left mb-3"
              sm="8"
              md="8"
              xl="8"
              xxl="8"
            >
              <h4 className="mt-3 patiaentInformation-h4">
                Secondary Insurance Information
              </h4>

              <Form
                onSubmit={handleSubmit}
                noValidate
                validated={validatedForm}
              >
                <Form.Label className=" mt-3 label">
                  Secondary Insurance Carrier
                </Form.Label>
                <Form.Control
                  required
                  autoFocus
                  className="hieght-50px"
                  value={formData.secodary_insurance_carrier}
                  type="text"
                  placeholder=""
                  onChange={(e) =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        secodary_insurance_carrier: e.target.value,
                      };
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Insurance Carrier.
                </Form.Control.Feedback>
                <Form.Label className=" mt-3 label">
                  Subscriber / Member ID
                </Form.Label>
                <Form.Control
                  required
                  className="hieght-50px"
                  value={formData.secodary_subscriber_member_id}
                  type="text"
                  placeholder=""
                  onChange={(e) =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        secodary_subscriber_member_id: e.target.value,
                      };
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Subscriber / Member ID.
                </Form.Control.Feedback>
                <Form.Label className=" mt-3 label">Group Number</Form.Label>

                <Form.Control
                  className="hieght-50px"
                  required
                  type="text"
                  value={formData.secodary_group_number}
                  placeholder=""
                  onChange={(e) =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        secodary_group_number: e.target.value,
                      };
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Group Number.
                </Form.Control.Feedback>
                <p className="mt-3 custom-p">
                  Is this Secondary Insurance for yourself or a legal dependent?
                </p>
                <Form.Check
                  className="mt-3"
                  label="My Self"
                  name="group1"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  defaultChecked={
                    formData.is_secondary_insurance_for_yourself === 'My Self'
                  }
                  onChange={() =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        is_secondary_insurance_for_yourself: 'My Self',
                      };
                    })
                  }
                />
                <Form.Check
                  label="Dependent"
                  name="group1"
                  type="radio"
                  id={`radio-2`}
                  isInvalid
                  defaultChecked={
                    formData.is_secondary_insurance_for_yourself === 'Dependent'
                  }
                  onChange={() =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        is_secondary_insurance_for_yourself: 'Dependent',
                      };
                    })
                  }
                />
                <p className="mt-3 custom-p">
                  Is this Secondary Insurance Government Provided?
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
                      formData.is_secondary_insurance_government_provided ===
                      'Yes'
                    }
                    onChange={() =>
                      setFormData((prevState) => {
                        return {
                          ...prevState,
                          is_secondary_insurance_government_provided: 'Yes',
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
                      formData.is_secondary_insurance_government_provided ===
                      'No'
                    }
                    isInvalid
                    onChange={() =>
                      setFormData((prevState) => {
                        return {
                          ...prevState,
                          is_secondary_insurance_government_provided: 'No',
                        };
                      })
                    }
                  />
                </Form.Group>

                <Button
                  className="CommonButton mt-3 "
                  type="submit"
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

export default UpdateSecondaryInsuranceInformation;
