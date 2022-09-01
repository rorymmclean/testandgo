import React from 'react';
import { Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import cardImage from './../../assets/images/cardImage.png';
import './Card.css';
const Card = ({ ...props }) => {
  const { Name, Birthday, Phone, Email, InsuranceInfo } = props.data;
  console.log(Name);
  return (
    <Container className="cardContainer ">
      <Row>
        <Col className="cardLeft" xs="12" sm="12" md="5" lg="5" xl="4" xxl="5">
          <Image src={cardImage} />
        </Col>
        <Col
          className="cardRight justify-content-center"
          xs="12"
          sm="12"
          md="5"
          lg="5"
          xl="6"
          xxl="6"
        >
          <ListGroup variant="flush" className="mt-3 mb-3">
            <ListGroup.Item className="cardListItem">
              <b>{Name}</b>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <span>{Birthday}</span>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <span>{Phone}</span>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <span>{Email}</span>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <span>{InsuranceInfo}</span>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Card;
