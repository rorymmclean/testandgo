import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import './../Common.css';

const Profile = () => {
  const navigate = useNavigate();
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
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </Button>
          <Button
            className="CommonButton mt-4"
            variant="secondary"
            onClick={() => navigate('/edit-insurance')}
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
            onClick={() => navigate('')}
          >
            New Request
          </Button>
        </Col>
        <Col xs="10" sm="8" md="7" lg="5" xl="5" xxl="4">
          <Card
            data={{
              Name: 'Name',
              Birthday: '1/8/1988',
              Phone: '123456789',
              Email: 'example@example.com',
              InsuranceInfo: 'nagitive',
            }}
          />
          <Card
            data={{
              Name: 'Name',
              Birthday: '1/8/1988',
              Phone: '123456789',
              Email: 'example@example.com',
              InsuranceInfo: 'nagitive',
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
