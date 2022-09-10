import React from 'react';
import { Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import cardImage from './../../assets/images/cardImage.png';
import './Card.css';
const Card = ({ ...props }) => {
  const { Name, Birthday, Phone, Email } = props.data;
  const { health_insurance } = props.data || '';
  const {
    group_number,
    have_secondary_insurance_want_to_include,
    is_primary_insurance_holder,
    primary_insurance_carrier,
    subscriber_member_id,
  } = props.data.InsuranceInfo || '';

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
          <ListGroup variant="flush">
            <ListGroup.Item className="cardListItem">
              <b>Name:</b>
              <b>{Name}</b>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <b>Birthday:</b>
              <span>{Birthday}</span>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <b>Phone:</b>
              <span>{Phone}</span>
            </ListGroup.Item>
            <ListGroup.Item className="cardListItem">
              <b>Email:</b>
              <span>{Email}</span>
            </ListGroup.Item>
            {props.data.InsuranceInfo != undefined ? (
              <>
                <ListGroup.Item className="cardListItem">
                  <b>Health Insurance:</b>
                  <span>{health_insurance}</span>
                </ListGroup.Item>
              </>
            ) : null}
            {props.data.InsuranceInfo != undefined ? (
              <>
                <ListGroup.Item className="cardListItem">
                  <b>Group Number:</b>
                  <span>{group_number}</span>
                </ListGroup.Item>
                <ListGroup.Item className="cardListItem">
                  <b>secondary insurance:</b>{' '}
                  <span>{have_secondary_insurance_want_to_include}</span>
                </ListGroup.Item>
                <ListGroup.Item className="cardListItem">
                  <b>Primary Insurance Holder:</b>
                  <span>{is_primary_insurance_holder}</span>
                </ListGroup.Item>
                <ListGroup.Item className="cardListItem">
                  <b>Primary Insurance Carrier:</b>
                  <span>{primary_insurance_carrier}</span>
                </ListGroup.Item>

                <ListGroup.Item className="cardListItem">
                  <b>Subscriber Member Id:</b>
                  <span>{subscriber_member_id}</span>
                </ListGroup.Item>
              </>
            ) : null}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Card;
