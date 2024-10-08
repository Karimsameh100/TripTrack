import React from "react";
import infoImage from "../logo/infooo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./navbar.css";
const Info = () => {

  const handleClick = () => {
    window.location.hash = '#hero';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ marginTop: "5vh" }} className="container-fluid py-5">
      <div className="row justify-content-center text-center">
        <div className="col-12">
          <h2 className="text-primary font-weight-bold">
            The Best Public Transportation in Egypt
          </h2>
        </div>

        <div className="col-12 col-md-4 d-flex align-items-center justify-content-md-end text-md-end text-center mt-4 mt-md-0">
          <div className="p-3 p-md-4">
            <h3>Safe & Reliable</h3>
            <h5>Your road trip is more safe, peaceful, and well-served.</h5>
          </div>
        </div>

        <div className="col-12 col-md-4 text-center mt-4 mt-md-0">
          <img
            src={infoImage}
            alt="About"
            className="img-fluid"
            style={{ maxWidth: "100%" }}
          />
        </div>

        <div className="col-12 col-md-4 d-flex align-items-center justify-content-md-start text-md-start text-center mt-4 mt-md-0">
          <div className="p-3 p-md-4">
            <h3 style={{ textTransform: "capitalize" }}>
              Get Real Comfort
              <br />
              With TRIP TRACK
            </h3>
            <h5 style={{ textTransform: "capitalize" }}>
              Extra legroom, full of entertaining features on board.
            </h5>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="d-inline-block">
            {/* <button
              id="infoBTN"
              type="button"
              className="btn btn-outline-dark me-3"
            >
              Book Now
            </button> */}
            <Link >
              <button onClick={handleClick} id="infoBTN" className="btn  btn-outline-dark me-3">
                Book Now
              </button>
            </Link>
            {/* <button id="infoBTN" type="button" className="btn btn-outline-dark">
              Create Account
            </button> */}

            <Link to={"/TripTrackSignup"}>
              <button id="infoBTN" className="btn  btn-outline-dark">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
