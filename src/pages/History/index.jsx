import React from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './../Common.css';
const History = () => {
  const navigate = useNavigate();

  return (
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
            onClick={() => navigate('')}
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
};

export default History;
