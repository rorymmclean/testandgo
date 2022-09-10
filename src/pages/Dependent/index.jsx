import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';
import { Button, Col, Container, Image, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loadable/Loading';
import UserContext from '../../Context/UserContext';
import { FaPen } from 'react-icons/fa';

import './../Common.css';
const Dependent = () => {
  const [userDependent, setUserDependent] = useState([]);
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
    }
  }, []);

  const handleAddNew = () => {
    console.log('hi');
    navigate('/New-dependent');
  };
  const handleEdit = (name) => {
    localStorage.setItem('edit_name', name);
    navigate('/update-dependent');
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <Row className="justify-content-around mt-5">
        <Col xs="10" sm="8" md="5" lg="4" xl="4" xxl="4" className="mb-3 ">
          <Button className="CommonButton" onClick={() => navigate('/profile')}>
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
            onClick={() => navigate('/EditProfile')}
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
            onClick={() => navigate('/test-dependent')}
          >
            Register for Test
          </Button>
          <Button
            className="CommonButton mt-4"
            variant="secondary"
            onClick={() => {
              localStorage.removeItem('user_token');
              navigate('/');
            }}
          >
            Sign out
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
                onClick={handleAddNew}
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
                  {userDependent.map((element, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={() =>
                          handleEdit(
                            element.first_name + ' ' + element.last_name
                          )
                        }
                      >
                        <td className="  d-flex justify-content-center align-items-center ">
                          <FaPen style={{ height: '30px' }} />
                        </td>
                        <td className="pt-3">{element.first_name}</td>
                        <td className="pt-3">{element.last_name}</td>
                        <td className="pt-3">{element.dob.slice(0, 10)}</td>
                        <td className="pt-3">{element.phone_number}</td>
                        <td className="pt-3">{element.address}</td>
                      </tr>
                    );
                  })}
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
