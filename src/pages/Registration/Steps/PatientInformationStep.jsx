import React, { useContext, useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './../../Steps.css';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import UserContext from '../../../Context/UserContext';
import stepsObject from './stepsObject';

const PatiaentInformationStep1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneControl, setPhoneControl] = useState('');
  const [validatedForm, setValidatedForm] = useState(false);
  const [passwordsNotEqaul, setPasswordsNotEqaul] = useState(false);
  const { contextData, setContextData } = useContext(UserContext);
  const [validpassword, setValidpassword] = useState(false);

  const [identityType, setIdentityType] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: subtractYears(18),
    Email: '',
    password: '',
    repeatedPassword: '',
    addressType: 'US Address',
    address: '',
    secondAddress: '',
    apt: '',
    zip: '',
  });
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;

  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };
  useEffect(() => {
    let user_token = localStorage.getItem('Registered_user');
    axios
      .get(`${REACT_APP_API}/patient?patient=${user_token}`)
      .then((res) => {
        if (res.data.statuscode == '200') {
          console.log(res.data.body[0]);
          setIdentityType(res.data.body[0].identityType);
          if (res.data.body[0].identityType === 'Phone') {
            let phoneNum =
              res.data.body[0].phone[0] == '+'
                ? res.data.body[0].phone
                : '+' + res.data.body[0].phone;
            setPhoneNumber(phoneNum);
          } else {
            setFormData((prevState) => {
              return {
                ...prevState,
                Email: res.data.body[0].email,
              };
            });
          }
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

  useEffect(() => {
    //check were is the real step that user should be in!
    if (localStorage.getItem('r_step') === null) {
      navigate('/');
    } else if (localStorage.getItem('r_step') != 3) {
      navigate(stepsObject[localStorage.getItem('r_step')]);
    }

    //udapte or register mode
    if (
      location.pathname !== '/PatientInformationStep' ||
      localStorage.getItem('Registered_user') === null
    ) {
      navigate('/');
    } else {
      setContextData((prevState) => {
        return {
          ...prevState,
          registrationInfo: {
            setp: 3,
            patient: localStorage.getItem('Registered_user'),
            patientCode: localStorage.getItem('Registered_user_code'),
          },
        };
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidatedForm(false);
    localStorage.setItem('setValidatedForm', '0');
    setPasswordsNotEqaul(false);
    localStorage.setItem('setPasswordsNotEqaul', '0');
    setPhoneError(false);
    localStorage.setItem('setPhoneError', '0');
    setValidpassword(false);
    localStorage.setItem('setValidpassword', '0');

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
    //password and repeated password validation
    if (
      formData.repeatedPassword.length !== 0 &&
      formData.password !== formData.repeatedPassword
    ) {
      setPasswordsNotEqaul(true);
      localStorage.setItem('setPasswordsNotEqaul', '1');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    //passowrd conditions
    let decimal = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./-]).{12,}$/;
    if (formData.password.match(decimal)) {
    } else {
      setValidpassword(true);
      localStorage.setItem('setValidpassword', '1');
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
        localStorage.getItem('setPasswordsNotEqaul') == 0 &&
        localStorage.getItem('setPhoneError') == 0 &&
        localStorage.getItem('setValidpassword') == 0
      ) {
        //sending data
        localStorage.removeItem('setValidatedForm');
        localStorage.removeItem('setPasswordsNotEqaul');
        localStorage.removeItem('setPhoneError');
        localStorage.removeItem('setValidpassword');
        axios
          .put(
            `${REACT_APP_API}/patient?patient=${contextData.registrationInfo.patient}`,
            {
              first_name: formData.firstName,
              last_name: formData.lastName,
              date_of_birth: formData.dob,
              phone: phoneNumber,
              email: formData.Email,
              password: formData.password,
              address_type: formData.addressType,
              address: formData.address,
              second_address: formData.secondAddress,
              apt: formData.apt,
              zip: formData.zip,
              dependents: [],
            }
          )
          .then((res) => {
            console.log(res);
            if (res.data.statuscode == '200') {
              localStorage.setItem('r_step', 4);
              setContextData((prevState) => {
                return {
                  ...prevState,
                  registrationInfo: {
                    ...prevState.registrationInfo,
                    setp: 4,
                  },
                };
              });
              navigate('/health-insurance');
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
    }
  };

  function subtractYears(numOfYears, date = new Date()) {
    date.setFullYear(date.getFullYear() - numOfYears);
    return date;
  }

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
          <h4 className="patiaentInformation-h4 justify-content-left ">
            Patient Information
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
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      firstName: e.target.value,
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
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      lastName: e.target.value,
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
                disabled={identityType == 'Phone'}
                className={`PhoneInput ${
                  phoneError
                    ? `PhoneInputInValid`
                    : phoneNumber.length != 0
                    ? `PhoneInputValid`
                    : null
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
              {phoneError && <p className="errorNotify">{phoneControl}</p>}
              <Form.Label className=" mt-3 label">Email</Form.Label>
              <Form.Control
                disabled={identityType == 'Email'}
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
              <Form.Label className=" mt-3 label">Enter Password</Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                type="Password"
                placeholder="*********"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      password: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Password.
              </Form.Control.Feedback>
              {validpassword && (
                <p className="errorNotify">
                  Password must be 12 characters long (the longer, the better).
                  Have a combination of upper and lowercase letters, numbers,
                  punctuation, and special symbols.
                </p>
              )}
              <Form.Label className=" mt-3 label">Confirm Password</Form.Label>
              <Form.Control
                required
                className="hieght-50px"
                type="Password"
                placeholder="*********"
                value={formData.repeatedPassword}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      repeatedPassword: e.target.value,
                    };
                  })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please Confirm Password.
              </Form.Control.Feedback>
              {passwordsNotEqaul && (
                <p className="errorNotify">Passwords do not match</p>
              )}

              <Form.Check
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
              />
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
                value={formData.secondAddress}
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      secondAddress: e.target.value,
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
          <Row className="mt-5">
            <Footer />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PatiaentInformationStep1;
