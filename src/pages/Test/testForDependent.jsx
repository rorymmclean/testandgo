import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Stepper from '../../components/common/Stepper';
import UserContext from '../../Context/UserContext';
import './../Common.css';
import './../Steps.css';

const testForDependent = () => {
  const [select, setSelect] = useState('New Dependent');
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
            <Stepper step={6} width="70%" />
          </Row>
          <h4 className="mt-3 patiaentInformation-h4">
            Is this test for a New or Existing dependent?
          </h4>
          <Row
            className="justify-content-center mb-3"
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <p className="mt-3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus
              ipsam corrupti quaerat eaque voluptate eius sit debitis. Ipsum
              quam, eos amet aliquid enim numquam quis deleniti molestiae,
              placeat vero commodi.
            </p>
            <p className="bold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              deleniti atque, veniam rem enim consequuntur itaque.
            </p>

            <Form /* onSubmit={handleSubmit} */>
              <Form.Label className="label">
                Please Select the best Option:
              </Form.Label>
              <Form.Group>
                {/*                 <Form.Check
                  className="mt-3 custom-checkbox"
                  label="jaci kubik"
                  name="group1"
                  type="radio"
                  id={'jaci kubik'}
                  isInvalid
                  onChange={(e) => console.log(e.target)}
                /> */}
                <Form.Check
                  defaultChecked
                  label="New Dependent"
                  name="group1"
                  type="radio"
                  id={`radio-2`}
                  isInvalid
                  onChange={() => select('New Dependent')}
                />
              </Form.Group>
              <Button
                className="CommonButton mt-4"
                variant="secondary"
                onClick={() => navigate('/add-dependents')}
              >
                Submit
              </Button>
            </Form>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default testForDependent;
