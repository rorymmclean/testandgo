import React, { useContext, useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './../Common.css';
import './../Steps.css';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import Stepper from '../../components/common/Stepper';
import Footer from '../../components/common/Footer';

const AddDependent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(' ');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneControl, setPhoneControl] = useState('');
  const [validatedForm, setValidatedForm] = useState(false);
  const { contextData, setContextData } = useContext(UserContext);
  const [userDependents, setuserDependents] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: subtractYears(18),
    Email: '',
    /* addressType: 'US Address', */
    address: '',
    second_address: '',
    apt: '',
    zip: '',
  });
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };
  useEffect(() => {
    let user_token = localStorage.getItem('user_token');
    axios
      .get(`${REACT_APP_API}/patient?patient=${user_token}`)
      .then((res) => {
        if (res.data.statuscode == '200') {
          setuserDependents(res.data.body['0'].dependents);
          setContextData((prevState) => {
            return {
              ...prevState,
              userData: res.data.body['0'],
            };
          });
          //if update mode
          let dependentName = localStorage.getItem('test_for');
          if (dependentName !== null && dependentName !== 'New Dependent') {
            let dependent = res.data.body['0'].dependents.filter(
              (element) =>
                element.first_name + ' ' + element.last_name === dependentName
            );
            let dependents = res.data.body['0'].dependents.filter(
              (element) =>
                element.first_name + ' ' + element.last_name !== dependentName
            );
            setuserDependents(dependents);
            setFormData({
              first_name: dependent[0].first_name,
              last_name: dependent[0].last_name,
              dob: new Date(dependent[0].dob),
              Email: dependent[0].Email,
              address: dependent[0].address,
              second_address: dependent[0].second_address,
              apt: dependent[0].apt,
              zip: dependent[0].zip,
            });
            setPhoneNumber(dependent[0].phone_number);
          }

          //////////////////
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
  }, []);

  function subtractYears(numOfYears, date = new Date()) {
    date.setFullYear(date.getFullYear() - numOfYears);
    return date;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    setValidatedForm(false);
    localStorage.setItem('setValidatedForm', '0');
    setPhoneError(false);
    localStorage.setItem('setPhoneError', '0');

    //phone validation
    if (
      phoneNumber === undefined ||
      isValidPhoneNumber(phoneNumber) === false ||
      phoneNumber == ''
    ) {
      setPhoneError(true);
      localStorage.setItem('setPhoneError', '1');

      setPhoneControl('You must enter a valid Phone');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setValidatedForm(true);
      localStorage.setItem('setValidatedForm', '1');
    } else {
      if (
        localStorage.getItem('setValidatedForm') == 0 &&
        localStorage.getItem('setPhoneError') == 0
      ) {
        //sending data
        localStorage.removeItem('setValidatedForm');
        localStorage.removeItem('setPhoneError');
        let patient = localStorage.getItem('user_token');
        axios
          .put(`${REACT_APP_API}/patient?patient=${patient}`, {
            dependents: [
              ...userDependents,
              { ...formData, phone_number: phoneNumber },
            ],
          })
          .then((res) => {
            console.log(res);
            if (res.data.statuscode == '200') {
              localStorage.setItem(
                'test_for',
                formData.first_name + ' ' + formData.last_name
              );

              navigate('/covid-exposure');
            } else if (
              res.data.statuscode == '400' ||
              res.data.statuscode == '401'
            ) {
              localStorage.setItem('r_step', 1);
              navigate('/dependent-covid-test');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
          </Row>
          <h4
            style={{ width: '106%' }}
            className="patiaentInformation-h4 justify-content-left "
          >
            Patient Information: Dependent
          </h4>
          <Row
            className="justify-content-center mb-3 "
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <p>
              Please Provide the Below Information and click on the Next Button.
            </p>
            <p className="bold">Click Next to Move to Insurance Information.</p>

            <Form onSubmit={handleSubmit} noValidate validated={validatedForm}>
              <Form.Label className="label">First Name</Form.Label>
              <Form.Control
                required
                autoFocus
                className="hieght-50px"
                type="text"
                placeholder="Enter First Name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      first_name: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid First Name.
              </Form.Control.Feedback>
              <Form.Label className="mt-3 label">Last Name</Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                type="text"
                placeholder="Enter Last Name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      last_name: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Last Name.
              </Form.Control.Feedback>
              <Form.Label className="label mt-3">
                Date of Birth (only older than 18)
              </Form.Label>
              <Row className="mt-3 d-flex flex-column  ">
                <DatePicker
                  required
                  maxDate={subtractYears(18)}
                  selected={formData.dob}
                  onChange={(Date) =>
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        dob: Date,
                      };
                    })
                  }
                />
              </Row>
              <Form.Label className=" mt-3 label">Phone</Form.Label>
              <PhoneInput
                className={`PhoneInput ${
                  phoneError
                    ? `PhoneInputInValid`
                    : phoneNumber.length != 0
                    ? `PhoneInputValid`
                    : ``
                }`}
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
              <Form.Label className=" mt-3 label">Email</Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                type="email"
                placeholder="name@example.com"
                value={formData.Email}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      Email: e.target.value,
                    };
                  })
                }
              />

              <Form.Control.Feedback type="invalid">
                Please provide a valid Email.
              </Form.Control.Feedback>

              {/*  <Form.Check
                className="mt-3 "
                label="US Address"
                name="addressType"
                type="radio"
                id={`radio-1`}
                isInvalid={true}
                defaultChecked
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      addressType: 'US Address',
                    };
                  })
                }
              />
              <Form.Check
                label="Non US Address"
                name="addressType"
                type="radio"
                id={`radio-2`}
                isInvalid
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      addressType: 'Non US Address',
                    };
                  })
                }
              /> */}
              <Form.Label className="mb-3 mt-3 label">Address</Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                type="text"
                placeholder="Enter Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      address: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Address.
              </Form.Control.Feedback>
              <Form.Label className="mt-3 optionalLabel">
                Address line 2<span className="optionalSpan">(optional)</span>
              </Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                value={formData.second_address}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      second_address: e.target.value,
                    };
                  })
                }
              />
              <Form.Label className="mt-3 optionalLabel">
                Apt / Ste #<span className="optionalSpan">(optional)</span>
              </Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                value={formData.apt}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      apt: e.target.value,
                    };
                  })
                }
              />
              <Form.Label className="mt-3 label">Zip Code</Form.Label>
              <Form.Control
                required
                value={formData.zip}
                className="hieght-50px"
                type="text"
                placeholder="Enter Zip Code"
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      zip: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Zip Code.
              </Form.Control.Feedback>
              <Button
                className="CommonButton mt-3"
                variant="secondary"
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

export default AddDependent;
