import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './Steps.css';

import 'react-phone-number-input/style.css';

const PatiaentInformationStep1 = () => {
  const [startDate, setStartDate] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: 'test',
    dob: new Date(),
    Phone: 'test',
    Email: 'test',
    password: 'test',
    repeatedPassword: 'test',
    addressType: 'US Address',
    address: 'test',
    secondAddress: 'test',
    apt: 'test',
    zip: 'test',
  });
  const handleSubmit = () => {
    console.log('d');
  };

  const [phoneNumber, setPhoneNumber] = useState();
  const navigate = useNavigate();
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
            <Stepper step={0.5} width="70%" />
          </Row>
          <Row
            className="justify-content-center mb-3 "
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <h4 className="patiaentInformation-h4 justify-content-center ">
              Patiaent Information
            </h4>
            <p>
              Please Provide the Below Information and click on the Next Button.
            </p>
            <p className="bold">
              Click Next to Move to the Patient Information Step.
            </p>

            <Form onSubmit={handleSubmit}>
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
              <Form.Label className="mt-3 label">Last Name</Form.Label>
              <Form.Control
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
              <Form.Label className="label mt-3">Birth Month</Form.Label>
              <Row className="mt-3 d-flex flex-column  ">
                <DatePicker
                  required
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
                className="PhoneInput"
                placeholder="(201) 555-0123"
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="US"
              />
              <Form.Label className=" mt-3 label">Email</Form.Label>
              <Form.Control
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
              <Form.Label className=" mt-3 label">Enter Password</Form.Label>
              <Form.Control
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
              <Form.Label className=" mt-3 label">Confirm Password</Form.Label>
              <Form.Control
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

              <Form.Check
                className="mt-3 "
                label="US Address"
                name="addressType"
                type="radio"
                id={`radio-1`}
                isInvalid
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
                className="hieght-50px"
                type="text"
                placeholder="1100 Blackwolf Run Rd"
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
                placeholder="33896-7"
                onChange={(e) =>
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      zip: e.target.value,
                    };
                  })
                }
              />
              <Button
                className="CommonButton mt-3"
                variant="secondary"
                /* onClick={() => navigate('/health-insurance')} */
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

export default PatiaentInformationStep1;
