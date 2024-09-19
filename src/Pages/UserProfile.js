import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Pagination,
  Nav,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from 'jwt-decode';



const UserProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookedTrips, setBookedTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSection, setCurrentSection] = useState("profile");
  const tripsPerPage = 1;
  const navigate = useNavigate();

  // Fetch user data and booked trips from Django API
  useEffect(() => {
    const access_token = localStorage.getItem("authToken");
    console.log("Access Token:", access_token);
  
    if (!access_token) {
      // Redirect to login if there's no access token
      navigate("/login1");
      return;
    }
  
    try {
      // Try decoding the token
      const decodedToken = jwtDecode(access_token);
      const userId = decodedToken.user_id;  // Extract the user ID from the token
      
      // Fetch the user profile data from the API
      axios
        .get(`http://127.0.0.1:8000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((response) => {
          const { name, email, phone_number, image, bookedTrips } = response.data;
          setName(name);
          setEmail(email);
          setPhoneNumber(phone_number); // Set phone number
          setProfilePic(image); // Assume profilePic is returned as `image`
          setBookedTrips(bookedTrips || []);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    } catch (error) {
      console.error("Invalid token:", error);
      // Optionally handle the invalid token case, like redirecting to login
      navigate("/login");
    }
  }, [navigate]);

  // Filter trips based on the selected section (Pending, Rejected, Accepted)
  useEffect(() => {
    if (currentSection === "pending-trips") {
      setFilteredTrips(
        bookedTrips.filter((trip) => trip.status === "Pending" || !trip.status)
      );
    } else if (currentSection === "rejected-trips") {
      setFilteredTrips(
        bookedTrips.filter((trip) => trip.status === "Rejected")
      );
    } else if (currentSection === "accepted-trips") {
      setFilteredTrips(
        bookedTrips.filter((trip) => trip.status === "Accepted")
      );
    } else {
      setFilteredTrips(bookedTrips);
    }
  }, [currentSection, bookedTrips]);

  // Handle pagination for trips
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips =
    filteredTrips && filteredTrips.length > 0
      ? filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip)
      : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfilePic(imageUrl);

        axios
          .put(
            "http://localhost:8000/register/user/",
            { profilePic: imageUrl },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          )
          .then(() => {
            alert("Profile picture updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating profile picture:", error);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle account edit navigation
  const handleEditAccount = () => {
    navigate("/client", {
      state: { name, email, profilePic, isEditMode: true },
    });
  };

  // Handle navigation between profile and trip sections
  const handleNavClick = (section) => {
    setCurrentSection(section);
  };

  return (
    <Container
      className="my-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "80vh" }}
    >
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Nav className="flex-column">
                <Nav.Link
                  onClick={() => setCurrentSection("profile")}
                  style={{
                    color: currentSection === "profile" ? "#007bff" : "#333",
                  }}
                >
                  My Profile
                </Nav.Link>
                <Nav.Link
                  onClick={() => setCurrentSection("pending-trips")}
                  style={{
                    color:
                      currentSection === "pending-trips" ? "#007bff" : "#333",
                  }}
                >
                  Pending Trips
                </Nav.Link>
                <Nav.Link
                  onClick={() => setCurrentSection("rejected-trips")}
                  style={{
                    color:
                      currentSection === "rejected-trips" ? "#007bff" : "#333",
                  }}
                >
                  Rejected Trips
                </Nav.Link>
                <Nav.Link
                  onClick={() => setCurrentSection("accepted-trips")}
                  style={{
                    color:
                      currentSection === "accepted-trips" ? "#007bff" : "#333",
                  }}
                >
                  Accepted Trips
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              {currentSection === "profile" ? (
                <div>
                  <Row className="align-items-center">
                    <Col md={4} className="d-flex justify-content-center">
                      <Card.Img
                        variant="top"
                        src={profilePic || "https://via.placeholder.com/150"}
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                          marginRight: "20px",
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <Card.Title>Welcome: {name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Your Email: {email}
                      </Card.Subtitle>
                      <Form>
                        <Form.Group controlId="formFile">
                          <Form.Control
                            type="file"
                            style={{ marginTop: "5vh" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const imageUrl = reader.result;
                                  setProfilePic(imageUrl);
                                  axios
                                    .put(
                                      "http://localhost:8000/register/user/",
                                      { profilePic: imageUrl },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${localStorage.getItem(
                                            "access"
                                          )}`,
                                        },
                                      }
                                    )
                                    .then(() => {
                                      alert(
                                        "Profile picture updated successfully!"
                                      );
                                    })
                                    .catch((error) => {
                                      console.error(
                                        "Error updating profile picture:",
                                        error
                                      );
                                    });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          onClick={() =>
                            navigate("/client", {
                              state: { name, email },
                            })
                          }
                          style={{ marginTop: "3vh" }}
                        >
                          Edit My Profile
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </div>
              ) : (
                // Here you can add different sections (pending-trips, rejected-trips, accepted-trips)
                // based on the value of currentSection
                <div>
                  {/* Add the corresponding JSX for pending-trips, rejected-trips, accepted-trips */}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
