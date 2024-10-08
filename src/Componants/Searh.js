import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import search from "./search.css";
import {
  Container,
  Form,
  FormGroup,
  FormControl,
  Button,
} from "react-bootstrap";

const Search = () => {
  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]); // Add a state for cities
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/cities/`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = `http://127.0.0.1:8000/find/trip/`;
    const params = {
      departuerStation: departureStation,
      destinationStation: arrivalStation,
      date: tripDate,
    };
    axios
      .get(url, { params })
      .then((response) => {
        const filteredTrips = response.data;
        navigate("/search-results", { state: { filteredTrips } });
        console.log(filteredTrips);
      })
      .catch((error) => console.error(error));
  };

  const isSearchDisabled = !departureStation || !arrivalStation || !tripDate;

  return (
    <Container className="search-container d-flex justify-content-center align-items-center">
      <form
        className="search-form d-flex flex-wrap justify-content-center w-100"
        onSubmit={handleSubmit}
      >
        <Form.Group className="form-groub" controlId="departureStation">
          <Form.Label>Departure Station:</Form.Label>
          <Form.Control
            as="select"
            value={departureStation}
            onChange={(event) => setDepartureStation(event.target.value)}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.city}>
                {city.city}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="form-groub mr-3" controlId="arrivalStation">
          <Form.Label>Arrival Station:</Form.Label>
          <Form.Control
            as="select"
            value={arrivalStation}
            onChange={(event) => setArrivalStation(event.target.value)}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.city}>
                {city.city}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="form-groub mr-3" controlId="tripDate">
          <Form.Label>Trip Date:</Form.Label>
          <Form.Control
            type="date"
            value={tripDate}
            onChange={(event) => setTripDate(event.target.value)}
          />
        </Form.Group>

        <Button
          variant="primary"
          className="d-inline-block buttn1 flex-wrap"
          type="submit"
        >
          Search
        </Button>
      </form>
    </Container>
  );
};

export default Search;