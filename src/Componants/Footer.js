import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../logo/neew llogo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#003366" }} className=" text-white py-4">
      <Container>
        <Row>
          <Col md={4}>
            <img src={logo} width="200" />
            {/* <h2 style={{ marginTop: "20px" }}>TRIP TRACK</h2> */}
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  Home
                </a>

                {/* <Link to={"./HeroSection.js"} className="text-white">
                  Home
                </Link> */}
              </li>
              <li>
                <a href="#" className="text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#3" className="text-white">
                  Contact
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              123 Street Name
              <br />
              City, Country 12345
              <br />
              Email: info@example.com
              <br />
              Phone: +123 456 7890
            </p>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Your Company. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
