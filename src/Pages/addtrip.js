import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddTripForm (){
  const [tripNumber, setTripNumber] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [availablePlaces, setAvailablePlaces] = useState("");
  const [departureStation, setDepartureStation] = useState("");
  const [stopStations, setStopStations] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureTimePeriod, setDepartureTimePeriod] = useState("AM");
  const [arrivedTime, setArrivedTime] = useState("");
  const [arrivedTimePeriod, setArrivedTimePeriod] = useState("PM");
  const [price, setPrice] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // Fetch company data from localStorage
        const storedCompany = JSON.parse(localStorage.getItem('loggedInCompany'));
        if (storedCompany) {
          setSelectedCompany(storedCompany);
        } else {
          setError('No company data found.');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        setError(error.message);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:4001/posts'); // Fetch cities from API
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError('Failed to fetch cities.');
      }
    };

    fetchCompany();
    fetchCities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tripNumber") {
      setTripNumber(value);
    } else if (name === "tripDate") {
      setTripDate(value);
    } else if (name === "availablePlaces") {
      setAvailablePlaces(value);
    } else if (name === "departureStation") {
      setDepartureStation(value);
    } else if (name === "stopStations") {
      setStopStations(value);
    } else if (name === "departureTime") {
      setDepartureTime(value);
    } else if (name === "departureTimePeriod") {
      setDepartureTimePeriod(value);
    } else if (name === "arrivedTime") {
      setArrivedTime(value);
    } else if (name === "arrivedTimePeriod") {
      setArrivedTimePeriod(value);
    } else if (name === "price") {
      setPrice(value);
    } else if (name === "selectedCity") {
      setSelectedCity(value);
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];
    if (!tripNumber || isNaN(tripNumber) || tripNumber <= 0) errors.tripNumber = "Trip number must be a positive number.";
    if (!tripDate) {
      errors.tripDate = "Trip date is required.";
  } else if (tripDate < today) {
      errors.tripDate = "Trip date cannot be in the past.";
  }
    if (!availablePlaces || isNaN(availablePlaces) || availablePlaces <= 0) errors.availablePlaces = "Available places must be a positive number.";
    if (!departureStation || typeof departureStation !== 'string' || departureStation.trim() === '' || /\d/.test(departureStation) || departureStation.split(' ').some(word => word.length < 3)) {
      errors.departureStation = "Departure station must be a non-empty string with each word having more than 3 characters and no numbers.";
    }
    if (!stopStations || typeof stopStations !== 'string' || stopStations.trim() === '' || /\d/.test(stopStations) || stopStations.split(' ').some(word => word.length < 3)) {
      errors.stopStations = "Stop stations must be a non-empty string with each word having more than 3 characters and no numbers.";
    }
    if (!departureTime) errors.departureTime = "Departure time is required.";
    if (!arrivedTime) errors.arrivedTime = "Arrival time is required.";
    if (arrivedTime && departureTime && arrivedTime <= departureTime) errors.arrivedTime = "Arrival time must be after departure time.";
    if (!price || isNaN(price) || price <= 0) errors.price = "Price must be a positive number.";
    if (!selectedCity) errors.selectedCity = "City is required.";
    if (!selectedCompany) errors.selectedCompany = "Company is required.";
    setValidationErrors(errors);
    return errors;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time, period) => {
    return `${time} ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length !== 0) return; 
  
    const formattedPrice = `${price} EGP`;
    const formattedDepartureTime = formatTime(departureTime, departureTimePeriod);
    const formattedArrivedTime = formatTime(arrivedTime, arrivedTimePeriod);
  
    const newTrip = {
      tripNumber,
      tripDate: formatDate(tripDate), 
      availablePlaces,
      departureStation,
      stopStations,
      departureTime: formattedDepartureTime, 
      arrivedTime: formattedArrivedTime, 
      price: formattedPrice, 
      city: selectedCity,
      companyId: selectedCompany.id,
      companyName: selectedCompany.name
    };
  
    try {
      const response = await axios.get(`http://localhost:4001/posts?city=${selectedCity}&companyId=${selectedCompany.id}`);
      
      //  
      if (response.data && response.data.length > 0) {
        const companyData = response.data[0]; //frist item
        let updatedTrips = companyData.trips || [];
        updatedTrips = [...updatedTrips, newTrip];
  
        const updatedData = { ...companyData, trips: updatedTrips };
  
        if (companyData.id) {
          await axios.put(`http://localhost:4001/posts/${companyData.id}`, updatedData);
          setSuccessMessage("Trip added successfully!");
  
        
          setTripNumber("");
          setTripDate("");
          setAvailablePlaces("");
          setDepartureStation("");
          setStopStations("");
          setDepartureTime("");
          setDepartureTimePeriod("AM");
          setArrivedTime("");
          setArrivedTimePeriod("PM");
          setPrice("");
          setSelectedCity("");
        } else {
          setError("Failed to identify company data.");
        }
      } else {
        setError("No data found for the selected city and company.");
      }
    } catch (error) {
      console.error('Error adding trip:', error);
      setError("Failed to add trip. Please try again.");
    }
  };
  
  return (
    <div className="container">
       <div className="row my-5">
        <div className="col-md-6">
        <h2 className="text-center mb-4">Add New Trip</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tripNumber">Trip Number</label>
          <input
            type="number"
            className="form-control"
            id="tripNumber"
            name="tripNumber"
            value={tripNumber}
            onChange={handleInputChange}
          />
          {validationErrors.tripNumber && <p className="text-danger">{validationErrors.tripNumber}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="tripDate">Trip Date</label>
          <input
            type="date"
            className="form-control"
            id="tripDate"
            name="tripDate"
            value={tripDate}
            onChange={handleInputChange}
          />
          {validationErrors.tripDate && <p className="text-danger">{validationErrors.tripDate}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="availablePlaces">Available Places</label>
          <input
            type="number"
            className="form-control"
            id="availablePlaces"
            name="availablePlaces"
            value={availablePlaces}
            onChange={handleInputChange}
          />
          {validationErrors.availablePlaces && <p className="text-danger">{validationErrors.availablePlaces}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="departureStation">Departure Station</label>
          <input
            type="text"
            className="form-control"
            id="departureStation"
            name="departureStation"
            value={departureStation}
            onChange={handleInputChange}
          />
          {validationErrors.departureStation && <p className="text-danger">{validationErrors.departureStation}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="stopStations">Stop Stations</label>
          <input
            type="text"
            className="form-control"
            id="stopStations"
            name="stopStations"
            value={stopStations}
            onChange={handleInputChange}
          />
          {validationErrors.stopStations && <p className="text-danger">{validationErrors.stopStations}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="departureTime">Departure Time</label>
          <input
            type="time"
            className="form-control"
            id="departureTime"
            name="departureTime"
            value={departureTime}
            onChange={handleInputChange}
          />
          <select
            className="form-control mt-2"
            id="departureTimePeriod"
            name="departureTimePeriod"
            value={departureTimePeriod}
            onChange={handleInputChange}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          {validationErrors.departureTime && <p className="text-danger">{validationErrors.departureTime}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="arrivedTime">Arrival Time</label>
          <input
            type="time"
            className="form-control"
            id="arrivedTime"
            name="arrivedTime"
            value={arrivedTime}
            onChange={handleInputChange}
          />
          <select
            className="form-control mt-2"
            id="arrivedTimePeriod"
            name="arrivedTimePeriod"
            value={arrivedTimePeriod}
            onChange={handleInputChange}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          {validationErrors.arrivedTime && <p className="text-danger">{validationErrors.arrivedTime}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={price}
            onChange={handleInputChange}
          />
          {validationErrors.price && <p className="text-danger">{validationErrors.price}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="selectedCity">City</label>
          <select
            className="form-control"
            id="selectedCity"
            name="selectedCity"
            value={selectedCity}
            onChange={handleInputChange}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.city}
              </option>
            ))}
          </select>
          {validationErrors.selectedCity && <p className="text-danger">{validationErrors.selectedCity}</p>}
        </div>
        <button type="submit" className="btn btn-primary">Add Trip</button>
      </form>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
    </div>
    </div>
    </div>
  );
};

export default AddTripForm;