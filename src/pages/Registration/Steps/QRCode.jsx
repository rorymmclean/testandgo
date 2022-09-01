import React from 'react';
import { Button, Col, Container, Form, Row, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/common/Footer';
import Stepper from '../../../components/common/Stepper';
import './../../Common.css';
import img from './../../../assets/images/QR.png';
import './Steps.css';

const QRCode = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs="10" sm="8" md="6" lg="5" xl="4" xxl="4">
          <Row
            className="justify-content-center mb-3"
            sm="8"
            md="8"
            xl="8"
            xxl="8"
          >
            <Stepper step={3.5} width="70%" />

            <Form.Label className="text-center label">
              Display this QR code to the vending machine's scanner when
              prompted.
            </Form.Label>
            <Image className="w-80" src={img} />
            <h3 className="text-center">
              ID:<span className="bold">58AHEE</span>
            </h3>
            <ol className="qr-notice">
              <li className="mt-3">
                <span>
                  Once the test has vended remove your testing kit from the
                  vending machine.
                </span>
              </li>
              <li className="mt-3">
                <span>Follow the instructions inside the testing kit.</span>
              </li>
              <li className="mt-3">
                <span>
                  Place the collected sample back in the bag and drop in the
                  collection bin.
                </span>
              </li>
            </ol>
            <Row className="justify-content-between p-0">
              <Button
                className="CommonButton"
                variant="secondary"
                style={{
                  width: '48%',
                  fontSize: '0.8rem',
                }}
                onClick={() => navigate('')}
              >
                Email QR Code
              </Button>
              <Button
                className="CommonButton"
                variant="secondary"
                style={{
                  fontSize: '0.8rem',
                  width: '48%',
                }}
                onClick={() => navigate('')}
              >
                Text Message QR Code
              </Button>
            </Row>
            <Button
              className="CommonButton mt-4"
              variant="secondary"
              style={{
                fontSize: '0.8rem',
                width: '100%',
              }}
              onClick={() => navigate('/profile')}
            >
              Go to Profile
            </Button>
          </Row>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default QRCode;
