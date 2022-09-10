import React, { useContext, useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './../../components/common/Footer/index';
import './../Common.css';
import './../Steps.css';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import UserContext from './../../Context/UserContext';
import Loading from '../../components/common/Loadable/Loading';

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneControl, setPhoneControl] = useState('');
  const [validatedForm, setValidatedForm] = useState(false);
  const [passwordsNotEqaul, setPasswordsNotEqaul] = useState(false);
  const { contextData, setContextData } = useContext(UserContext);
  const [validpassword, setValidpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    let user_token = localStorage.getItem('user_token');
    if (user_token === null) {
      navigate('/');
    } else {
      axios
        .get(`${REACT_APP_API}/patient?patient=${user_token}`)
        .then((res) => {
          if (res.data.statuscode == '200') {
            console.log(res.data.body[0]);
            setFormData({
              firstName: res.data.body[0].first_name,
              lastName: res.data.body[0].last_name,
              dob: new Date(res.data.body[0].date_of_birth),
              Email: res.data.body[0].email,
              password: '',
              repeatedPassword: '',
              addressType: res.data.body[0].address_type,
              address: res.data.body[0].address,
              secondAddress: res.data.body[0].second_address,
              apt: res.data.body[0].apt,
              zip: res.data.body[0].zip,
            });
            setPhoneNumber(res.data.body[0].phone);
            setIsLoading(false);

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
        let user_token = localStorage.getItem('user_token');
        axios
          .put(`${REACT_APP_API}/patient?patient=${user_token}`, {
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
          })
          .then((res) => {
            console.log(res);
            if (res.data.statuscode == '200') {
              console.log(res);
              setContextData((prevState) => {
                return {
                  ...prevState,
                  registrationInfo: {
                    ...prevState.registrationInfo,
                  },
                };
              });
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
    }
  };

  function subtractYears(numOfYears, date = new Date()) {
    date.setFullYear(date.getFullYear() - numOfYears);
    return date;
  }

  {
    return isLoading ? (
      <Loading />
    ) : (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
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
                Please Provide the Below Information and click on the Next
                Button.
              </p>
              <p className="bold">
                Click Next to Move to Insurance Information.
              </p>

              <Form
                onSubmit={handleSubmit}
                noValidate
                validated={validatedForm}
              >
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
                  <p
                    style={{
                      marginTop: ' 0.25rem',
                      fontSize: '.875em',
                      color: '#dc3545',
                    }}
                  >
                    Password must be 12 characters long (the longer, the
                    better). Have a combination of upper and lowercase letters,
                    numbers, punctuation, and special symbols.
                  </p>
                )}
                <Form.Label className=" mt-3 label">
                  Confirm Password
                </Form.Label>
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
                  <p
                    style={{
                      marginTop: ' 0.25rem',
                      fontSize: '.875em',
                      color: '#dc3545',
                    }}
                  >
                    Passwords do not match
                  </p>
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
  }
};
export default EditProfile;
