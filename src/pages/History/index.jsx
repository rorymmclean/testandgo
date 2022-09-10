import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loadable/Loading';
import UserContext from '../../Context/UserContext';
import './../Common.css';
const History = () => {
  const navigate = useNavigate();
  const { REACT_APP_API, REACT_APP_API_KEY } = process.env;
  const { contextData, setContextData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userCases, setUserCases] = useState({});
  axios.defaults.headers = {
    'x-api-key': REACT_APP_API_KEY,
  };

  useEffect(() => {
    if (localStorage.getItem('user_token') === null) {
      navigate('/');
    } else {
      let user_token = localStorage.getItem('user_token');
      axios
        .get(`${REACT_APP_API}/case/all?patient=${user_token}`)
        .then((res) => {
          console.log(res);
          if (res.data.statuscode == '200') {
            console.log(res.data);
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
            <Button
              className="CommonButton"
              variant="secondary"
              style={{
                color: '#fff',
                backgroundColor: '#343a40',
                borderColor: '#343a40',
                height: '50px',
                padding: '0.5rem 1rem',
                fontSize: '1.25rem',
                lineHeight: '1.5',
                borderRadius: ' 0.3rem',
                width: '100%',
              }}
              onClick={() => navigate('/profile')}
            >
              Home
            </Button>

            <Button
              className="CommonButton mt-4"
              variant="secondary"
              onClick={() => navigate('/profile')}
            >
              Profile
            </Button>

            <Button
              className="CommonButton mt-4"
              variant="secondary"
              onClick={() => navigate('')}
            >
              New Request
            </Button>
          </Col>
          <Col xs="10" sm="8" md="7" lg="5" xl="5" xxl="4">
            <Table responsive>
              <thead>
                <tr>
                  <th>Date.</th>
                  <th>Test Type.</th>
                  <th>QR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>8/24/22</td>
                  <td>PCP </td>
                  <td className="QR">
                    <div style={{ backgroundColor: 'red', color: 'red' }}>
                      {'.'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>8/24/22</td>
                  <td>PCP </td>
                  <td className="QR">
                    <div style={{ backgroundColor: 'red', color: 'red' }}>
                      {'.'}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>8/24/22</td>
                  <td>PCP </td>
                  <td className="QR">
                    <div style={{ backgroundColor: 'green', color: 'green' }}>
                      {'.'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default History;
