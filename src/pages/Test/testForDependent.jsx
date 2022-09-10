import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loadable/Loading';
import Stepper from '../../components/common/Stepper';
import UserContext from '../../Context/UserContext';
import './../Common.css';
import './../Steps.css';

const testForDependent = () => {
  const [select, setSelect] = useState('New Dependent');
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const [userDependent, setUserDependent] = useState([]);
  const { contextData, setContextData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };

  useEffect(() => {
    let user_token = localStorage.getItem('user_token');
    axios
      .get(`${REACT_APP_API}/patient?patient=${user_token}`)
      .then((res) => {
        if (res.data.statuscode == '200') {
          setUserDependent(res.data.body['0'].dependents);
          setContextData((prevState) => {
            return {
              ...prevState,
              userData: res.data.body['0'],
            };
          });
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
  }, []);
  {
    return isLoading ? (
      <Loading />
    ) : (
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
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Ducimus ipsam corrupti quaerat eaque voluptate eius sit debitis.
                Ipsum quam, eos amet aliquid enim numquam quis deleniti
                molestiae, placeat vero commodi.
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
                  {userDependent.map((element, index) => {
                    console.log(element);
                    return (
                      <Form.Check
                        key={index}
                        label={`${element.first_name +
                          ' ' +
                          element.last_name}`}
                        name={`group1`}
                        type="radio"
                        id={`radio-${index}`}
                        isInvalid
                        onChange={(e) =>
                          setSelect(
                            element.first_name + ' ' + element.last_name
                          )
                        }
                      />
                    );
                  })}

                  <Form.Check
                    defaultChecked
                    label="New Dependent"
                    name="group1"
                    type="radio"
                    id={`radio`}
                    isInvalid
                    onChange={() => setSelect('New Dependent')}
                  />
                </Form.Group>
                <Button
                  className="CommonButton mt-4"
                  variant="secondary"
                  onClick={() => {
                    localStorage.setItem('test_for', select);
                    navigate('/add-dependents');
                  }}
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
  }
};

export default testForDependent;
