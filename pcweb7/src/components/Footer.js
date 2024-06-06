import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; // Import CSS for styling

const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col>
          <hr className="footer-line" />
          <div className="footer-links">
            <a href="/about" className="footer-link">About</a>
            <a href="/legal" className="footer-link">Legal</a>
            <a href="/contact" className="footer-link">Contact Us</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
