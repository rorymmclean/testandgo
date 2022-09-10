import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loadable/Loading';
import UserContext from '../../Context/UserContext';
import './../Common.css';
import './../Steps.css';

const UpdateHealthInsurance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [healthInsurance, setHealthInsurance] = useState('Yes');
  const { contextData, setContextData } = useContext(UserContext);
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
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
            setHealthInsurance(res.data.body[0].health_insurance);
            console.log(res.data.body[0].health_insurance);
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
    let user_token = localStorage.getItem('user_token');

    axios
      .put(`${REACT_APP_API}/patient?patient=${user_token}`, {
        health_insurance: healthInsurance,
      })
      .then((res) => {
        console.log(res);
        if (res.data.statuscode == '200') {
          console.log(healthInsurance);
          if (healthInsurance === 'Yes') {
            //if thier is Health Insurance
            setContextData((prevState) => {
              return {
                ...prevState,
                registrationInfo: {
                  ...prevState.registrationInfo,
                },
              };
            });
            navigate('/update-insurance-information');
            navigate(0);
          } else {
            navigate('/Profile');
          }
        } else if (
          res.data.statuscode == '400' ||
          res.data.statuscode == '401'
        ) {
          navigate('/Profile');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  {
    return isLoading ? (
      <Loading />
    ) : (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
            <Row
              className=" justify-content-center mb-3"
              sm="8"
              md="8"
              xl="8"
              xxl="8"
            >
              <h4 className="mt-3 HealthInsurance-h4">
                Do you have Insurance?
              </h4>
              <p className="mt-3 custom-p">Do you have Health Insurance?</p>

              <Form onSubmit={handleSubmit}>
                <Form.Check
                  className="mt-3"
                  label="Yes"
                  name="group1"
                  type="radio"
                  id={`radio-1`}
                  isInvalid
                  checked={healthInsurance == 'Yes'}
                  onChange={() => setHealthInsurance('Yes')}
                />
                <Form.Check
                  label="No"
                  name="group1"
                  type="radio"
                  id={`radio-2`}
                  isInvalid
                  checked={healthInsurance == 'No'}
                  onChange={() => setHealthInsurance('No')}
                />

                <Button
                  className="CommonButton mt-5 "
                  variant="secondary"
                  style={{
                    marginBottom: '150px',
                  }}
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
export default UpdateHealthInsurance;
