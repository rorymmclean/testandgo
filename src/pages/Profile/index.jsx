import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Loading from '../../components/common/Loadable/Loading';
import UserContext from '../../Context/UserContext';
import './../Common.css';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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
          console.log(res);
          if (res.data.statuscode == '200') {
            setUserData(res.data.body['0']);
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
    }
  }, []);
  {
    return isLoading ? (
      <Loading />
    ) : (
      <Container>
        <Row className="justify-content-around mt-5">
          <Col xs="10" sm="8" md="5" lg="4" xl="4" xxl="4" className="mb-3 ">
            <Button className="CommonButton" onClick={() => navigate('')}>
              Home
            </Button>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              onClick={() => navigate('/history')}
            >
              History
            </Button>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              /* onClick={() => navigate('/edit-profile')} */
            >
              Edit Profile
            </Button>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              onClick={() => navigate('/dependents')}
            >
              Add / Edit Dependent
            </Button>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              onClick={() => navigate('')}
            >
              Update / Add Insurance
            </Button>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              /*               onClick={() => navigate('/test-dependent')}
               */
            >
              New Request
            </Button>
          </Col>
          <Col xs="10" sm="8" md="7" lg="5" xl="5" xxl="5">
            <Card
              data={{
                Name: userData.first_name + ' ' + userData.last_name,
                Birthday: userData.date_of_birth.slice(0, 10),
                Phone: userData.phone,
                Email: userData.email,
                InsuranceInfo: userData.insurance_nformation,
                health_insurance: userData.health_insurance,
              }}
            />
            {/*             <h4>Dependent</h4>
             */}
            {/*             <Card
              data={{
                Name: '-',
                Birthday: '-',
                Phone: '-',
                Email: '-',
                InsuranceInfo: '-',
              }}
            /> */}
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Profile;
