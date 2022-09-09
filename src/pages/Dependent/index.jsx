import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { Button, Col, Container, Image, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Loading from '../../components/common/Loadable/Loading';
import UserContext from '../../Context/UserContext';
import cardImage from './../../assets/images/cardImage.png';
import './../Common.css';
const Dependent = () => {
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
    }
    /*  else {
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
    } */
  }, []);
  return (
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
            /* onClick={() => navigate('/test-dependent')} */
          >
            New Request
          </Button>
        </Col>
        <Col xs="10" sm="10" md="7" lg="8" xl="8" xxl="8">
          <Row>
            <Col>
              <h5>
                <b>Add / Edit Dependent</b>
              </h5>
            </Col>
            <Col>
              <Button
                className="CommonButton "
                variant="secondary"
                /* onClick={() => navigate('/add-dependents')} */
              >
                Add New
              </Button>
            </Col>
          </Row>
          <Col>
            <Row className="mt-3">
              <h5>My Dependents</h5>
            </Row>
            <Row>
              <Table bordered responsive>
                <thead className="text-light bg-dark text-center">
                  <tr>
                    <th>Edit</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="d-flex justify-content-center align-items-center">
                      <Image style={{ width: '50px' }} src={cardImage} />
                    </td>
                    <td className="pt-3">Mark</td>
                    <td className="pt-3">Otto</td>
                    <td className="pt-3">@mdo</td>
                    <td className="pt-3">Otto</td>
                    <td className="pt-3">@mdo</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default Dependent;
