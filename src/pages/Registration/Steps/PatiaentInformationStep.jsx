import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import './Steps.css';

import 'react-phone-number-input/style.css';

const PatiaentInformationStep1 = () => {
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
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

            <Form>
              <Form.Label className="label">First Name</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                placeholder="Enter First Name"
              />
              <Form.Label className="mt-3 label">Last Name</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                placeholder="Enter Last Name"
              />
              <Row className="mt-3">
                <Col>
                  <Form.Label className="label">Birth Month</Form.Label>
                  <select className="dropDwon" name="month" id="Month">
                    {months.map((month, index) => {
                      return (
                        <option value={month} id={index + 1} key={index}>
                          {month}
                        </option>
                      );
                    })}
                  </select>
                </Col>
                <Col>
                  <Form.Label className="label">Birth Day</Form.Label>
                  <select className="dropDwon" name="day" id="day">
                    <option value="1">1</option>
                  </select>
                </Col>
                <Col>
                  <Form.Label className="label">Birth Year</Form.Label>
                  <select className="dropDwon" name="year" id="year">
                    <option value="volvo">2022</option>
                    <option value="saab">2012</option>
                  </select>
                </Col>
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
              />
              <Form.Label className=" mt-3 label">Enter Password</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="Password"
                placeholder="*********"
              />
              <Form.Label className=" mt-3 label">Confirm Password</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="Password"
                placeholder="*********"
              />

              <Form.Check
                className="mt-3 "
                label="US Address"
                name="group1"
                type="radio"
                id={`radio-1`}
                isInvalid
                selected
              />
              <Form.Check
                label="Non US Address"
                name="group1"
                type="radio"
                id={`radio-2`}
                isInvalid
              />
              <Form.Label className="mb-3 mt-3 label">Address</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                placeholder="1100 Blackwolf Run Rd"
              />
              <Form.Label className="mt-3 optionalLabel">
                Address line 2<span className="optionalSpan">(optional)</span>
              </Form.Label>
              <Form.Control className="hieght-50px" type="text" />
              <Form.Label className="mt-3 optionalLabel">
                Apt / Ste #<span className="optionalSpan">(optional)</span>
              </Form.Label>
              <Form.Control className="hieght-50px" type="text" />
              <Form.Label className="mt-3 label">Zip Code</Form.Label>
              <Form.Control
                className="hieght-50px"
                type="text"
                placeholder="33896-7"
              />
              <Button
                className="CommonButton mt-3"
                variant="secondary"
                onClick={() => navigate('/health-insurance')}
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