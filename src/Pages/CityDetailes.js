import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SearchComponent from "../Componants/Searh";
import { Reviews } from "../Componants/Reviews/Review";
import gobus from "../logo/unnamed.png";
import axios from "axios";
import {
    Modal,
    ModalTitle,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "react-bootstrap";
import ReviewForm from "./CreateReview";

export function CityDetailes() {
    const params = useParams();
    const [city, setCity] = useState();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 4;
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [companiess, setCompanies] = useState([]);
    const [trips, setTrips] = useState([]);
    const currentUserId = 1;
    const [allTrips, setAllTrips] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [formData, setFormData] = useState({}); // Initialize formData state
    const [editTrip, setEditTrip] = useState(null); // Initialize editTrip state
    const [company, setCompany] = useState(null); // Initialize company state
    const [showModal, setShowModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false); // State to control the ReviewForm modal
    const [editReviewId, setEditReviewId] = useState(null); // State to control edit mode
    const [favorites, setFavorites] = useState([]);

    //--------------------------------Add new Trip-------------------------
    const [newTrip, setNewTrip] = useState({
        tripNumber: '',
        date: '',
        avilabalPlaces: '',
        departuerStation: '',
        destinationStation: '',
        departuerTime: '',
        destinationTime: '',
        status: '',
        price: '',
        user: '',
        bus: '',
        book: '',
    });

    const handleAddTrip = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/all/trips/', newTrip)
            .then((res) => {
                console.log(res.data);
                setAllTrips([...allTrips, res.data]);
                setShowAddModal(true)
                setNewTrip({
                    tripNumber: '',
                    date: '',
                    avilabalPlaces: '',
                    departuerStation: '',
                    destinationStation: '',
                    departuerTime: '',
                    destinationTime: '',
                    status: '',
                    price: '',
                    user: '',
                    bus: '',
                    book: '',
                });
            })
            .catch((err) => console.error(err));
    };

    // Handle the change of the new trip data
    const handleNewTripChange = (event) => {
        setNewTrip({
            ...newTrip,
            [event.target.name]: event.target.value,
        });
    };

    //---------------------------------------------------------------------

    // ------------------Favourites-----------START---------------------//
    useEffect(() => {
        axios
            .get(`http://localhost:8000/all/trips/`)
            //   (`http://localhost:4001/posts/${params.id}`)
            .then((res) => {
                setAllTrips(res.data)
            })
            .catch((err) => console.error("Error fetching trips:", err));
    }
        , [params.id, setEditTrip, setAllTrips]);


    useEffect(() => {
        axios
            .get(`http://localhost:8000/cities/${params.id}/`)
            //   (`http://localhost:4001/posts/${params.id}`)
            .then((res) => {
                console.log("resssssss:", res.data)
                setCity(res.data)
            })
            .catch((err) => console.error("Error fetching city:", err));
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
            setIsLoggedIn(true);
        }

        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, [params.id, setAllTrips, setEditTrip]);

    const handleAddToFavorites = (trip, company) => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const newFavorite = { ...trip, companyName: company.name };
        storedFavorites.push(newFavorite);
        localStorage.setItem("favorites", JSON.stringify(storedFavorites));

        // Dispatch a storage event to notify other components
        window.dispatchEvent(new Event("storage"));

        setFavorites(storedFavorites.length);
    };

    // ------------------Favourites-----------END---------------------//
    const handleEditTrip = (trip, company) => {
        setEditTrip(trip);
        setCompany(company);
        setFormData({
            tripNumber: trip.tripNumber,
            date: trip.date,
            avilabalPlaces: trip.avilabalPlaces,
            departuerStation: trip.departuerStation,
            destinationStation: trip.destinationStation,
            departuerTime: trip.departuerTime,
            destinationTime: trip.destinationTime,
            status: trip.status,
            price: trip.price,
            user: trip.user,
            bus: trip.bus,
            book: trip.book,
        });
        setShowEditModal(true);
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Make the request
        axios.put(`http://localhost:8000/selected/trip/${editTrip.id}`, {
            ...formData,
        })

            .then((res) => {
                const updatedTrips = allTrips.map((trip) =>
                    trip.tripNumber === editTrip.id ? res.data : trip
                );
                setAllTrips(updatedTrips);
                setShowEditModal(false); // Hide the modal after update
            })
            .catch((err) => console.error("Error updating trip:", err));
    };

    const handleDeleteTrip = (trip, company) => {
        setEditTrip(trip);
        setCompany(company);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Delete the trip from the JSON data

        axios.delete(`http://localhost:8000/selected/trip/${editTrip.id}`, {
            username: 'admin',
            password: 'admin',
        })
            .then((res) => {
                const updatedTrips = allTrips.filter(
                    (trip) => trip.id !== editTrip.id
                );
                setAllTrips(updatedTrips);
                setShowDeleteModal(false); // Hide the modal after deletion
            })
            .catch((err) => console.error("Error deleting trip:", err));
    };

    const cancelDelete = () => {
        setShowDeleteModal(false); // Hide the modal on cancel
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8000/cities/${params.id}/`)
            .then((res) => {
                console.log("tststtsts: ", res.data.companies)
                setCity(res.data);
                setHasMoreReviews(res.data.Reviews.length > reviewsPerPage);
                setCompanies(res.data.companies || []); // add default value
                setTrips((res.data.companies && res.data.companies.trips) || []); // add default value
            })
            .catch((err) => console.error("Error fetching products:", err));
    }, [params.id, reviewsPerPage, showEditModal, showDeleteModal]);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = city
        ? city.Reviews.slice(indexOfFirstReview, indexOfLastReview)
        : [];

    useEffect(() => {
        if (city) {
            setHasMoreReviews(city.Reviews.length > indexOfLastReview);
        }
    }, [currentPage, city, indexOfLastReview]);

    const handleLoadMore = () => {
        // Load more reviews if available
        if (hasMoreReviews) {
            setCurrentPage(currentPage + 1);
        }
    };

    //     userName	Karim Sameh
    // userEmail	karimsameh807@gmail.com
    // isLoggedIn	true

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // useEffect(() => {
    //     const isLoggedIn = localStorage.getItem("isLoggedIn");
    //     if (isLoggedIn === "true") {
    //         setIsLoggedIn(true);
    //     }
    // }, []);

    const handleLogin = () => {
        // login logic here
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        // logout logic here
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
    };

    const handleBookTrip = (trip, company) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else {
            navigate(`/booking/${trip.tripNumber}`, { state: { trip, company } });
        }
    };
    const handleGoBack = () => {
        // Go back to previous page if possible
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!city) {
        return <div>Loading...</div>;
    }

    const confirmDeleteReview = (reviewId) => {
        setReviewToDelete(reviewId);
        setShowModal(true);
    };

    const handleDeleteReview = () => {
        if (!reviewToDelete) return;

        // Optimistically update the UI
        const updatedReviews = city.Reviews.filter(
            (r) => r.ReviewId !== reviewToDelete
        );
        setCity((prevCity) => ({
            ...prevCity,
            Reviews: updatedReviews,
        }));

        // Make the API call to update the server
        axios.put(`http://localhost:8000/cities/${params.id}/`, {
            ...city,
            Reviews: updatedReviews,
        })
            .then(() => {
                // Reset modal and state after successful deletion
                setShowModal(false);
                setReviewToDelete(null);
            })
            .catch((err) => {
                console.error("Error deleting review:", err);
                // If the API call fails, revert the optimistic update
                setCity((prevCity) => ({
                    ...prevCity,
                    Reviews: [...prevCity.Reviews, reviewToDelete], // Add back the deleted review
                }));
                // Show an error message or handle the error appropriately
            });
    };


    const handleEditReview = (reviewId) => {
        setEditReviewId(reviewId);
        setShowReviewForm(true); // Open the modal in edit mode
    };

    const handleOpenReviewForm = () => {
        setEditReviewId(null); // Reset the edit mode
        setShowReviewForm(true); // Open the modal for a new review
    };

    const handleReviewSubmit = (updatedReviews) => {
        setCity((prevCity) => ({ ...prevCity, Reviews: updatedReviews }));
    };

    return (
        <>
            <div style={{ position: "relative" }}>
                <img
                    src={city.image}
                    style={{
                        width: "100%",
                        height: "100vh",
                        objectFit: "cover",
                        opacity: 0.9,
                    }}
                />

                <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                        position: "absolute",
                        top: "0%",
                        left: "0%",
                        right: "0%",
                        padding: "10px",
                        paddingBottom: "30px",
                        width: "100%",
                        height: "100%",
                        maxHeight: "100%", // add this to prevent height overflow
                        maxWidth: "100%",
                        backgroundColor: "rgba(128, 128, 128, 0.4)",
                        display: "block",
                        justifyContent: "around",
                        alignItems: "center",
                        borderRadius: "10px",
                        boxSizing: "border-box",
                    }}
                >
                    <h1 className="text-light text-center">Book your Ticket</h1>
                    <SearchComponent />
                    <h2 className="text-light text-center">{city.city} City</h2>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", margin: "20px" }}>
                <img
                    src={city?.image}
                    alt={city.name}
                    style={{
                        width: "50%",
                        height: "50%",
                        objectFit: "cover",
                        marginRight: "20px",
                    }}
                />
                <h4 style={{ textAlign: "left" }}>{city.info}</h4>
            </div>
            <div className="badge-container">
                <span className="badge badge-primary">{favorites.length}</span>{" "}
                {/* Display the updated favorites count */}
            </div>
            <div class="container-fluid">
                {city &&
                    city.companies.map((company) => (
                        <div
                            key={company.id}
                            class="row d-flex justify-content-center mb-5"
                        >

                            <h2 className="text-center m-5">Travel with {company.name}</h2>
                            <div class="col-sm-6 col-md-4">
                                <img
                                    src={company.image}
                                    className="img-fluid mt-5 "
                                    alt="Image"
                                />
                            </div>
                            <div className="table-responsive col-sm-6 col-md-8">
                                <table className="table table-striped table-bordered-bold">
                                    <thead>
                                        <tr>
                                            <th>Trip Number</th>
                                            <th>Trip Date</th>
                                            <th>Available Places</th>
                                            <th>Departure Station</th>
                                            <th>Stop Stations</th>
                                            <th>Go In</th>
                                            <th>Arrive At</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTrips.map((trip) => (
                                            <tr key={trip.tripNumber}>
                                                <td>{trip.tripNumber}</td>
                                                <td>{trip.date}</td>
                                                <td>{trip.avilabalPlaces}</td>
                                                <td>{trip.departuerStation}</td>
                                                <td>{trip.destinationStation}</td>
                                                <td>{trip.departuerTime}</td>
                                                <td>{trip.destinationTime}</td>
                                                <td>{trip.price}</td>
                                                <td>
                                                    <button
                                                        class="btn btn-success btn-sm mx-1"
                                                        style={{ width: "100%" }}
                                                        onClick={() =>
                                                            isLoggedIn
                                                                ? handleBookTrip(trip, company)
                                                                : setShowLoginModal(true)
                                                        }
                                                    >
                                                        Book
                                                    </button>
                                                    {/* <button
                                                        className="btn btn-primary btn-sm"
                                                        style={{ width: "45%" }}
                                                        onClick={() => {
                                                            handleEditTrip(trip, company);
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm mx-1 "
                                                        style={{ width: "47%" }}
                                                        onClick={() => {
                                                            handleDeleteTrip(trip, company);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        Delete
                                                    </button> */}
                                                    <button
                                                        className="btn btn-outline-warning btn-sm mx-1 my-1"
                                                        style={{ width: "100%" }}
                                                        onClick={() =>
                                                            isLoggedIn
                                                                ? handleAddToFavorites(trip, company)
                                                                : setShowLoginModal(true)
                                                        }
                                                    >
                                                        Favorites
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className="btn btn-md btn-success  w-100 fs-3 my-2" onClick={() => { setShowAddModal(true) }}> <b>+</b> </button>
                            </div>
                        </div>
                    ))}
            </div>
            <section className="bg-light py-3 py-md-5">
                <div className="container">
                    <div className="row gy-5 gy-lg-0 align-items-center">
                        <div className="col-12 col-lg-4">
                            <h2 className="display-5 mb-3 mb-xl-4">Our Clients</h2>
                            <p className="lead mb-4 mb-xl-5">
                                We believe in client satisfaction. Here are some Reviews by our
                                worthy clients.
                            </p>
                            <div className="d-flex">
                                {currentPage > 1 && (
                                    <button
                                        onClick={handleGoBack}
                                        className="btn btn-secondary rounded-pill me-2"
                                    >
                                        Go Back
                                    </button>
                                )}
                                {hasMoreReviews && (
                                    <button
                                        onClick={handleLoadMore}
                                        className="btn btn-success rounded-pill"
                                    >
                                        More Reviews
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-lg-8">
                            <div className="row">
                                {currentReviews.map((review) => (
                                    <div key={review.ReviewId} className="col-12 col-md-6 mb-4">
                                        <Reviews
                                            customerImg={review.ReviewCustomerDetails.image}
                                            customerReview={review.Review}
                                            customerName={review.ReviewCustomerDetails.name}
                                            customerRate={review.ReviewCustomerRate}
                                            onEdit={() => handleEditReview(review.ReviewId)}
                                            onDelete={() => confirmDeleteReview(review.ReviewId)}
                                            isAuthor={review.UserId === currentUserId}
                                        />
                                    </div>
                                ))}
                                <Button
                                    className="btn btn-success rounded-pill"
                                    onClick={handleOpenReviewForm}
                                >
                                    Share Your Review
                                </Button>
                            </div>

                            {/* Review Form Modal */}
                            <Modal
                                show={showReviewForm}
                                onHide={() => setShowReviewForm(false)}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {editReviewId ? "Edit Your Review" : "Share Your Review"}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <ReviewForm
                                        id={params.id}
                                        reviewId={editReviewId}
                                        onClose={() => setShowReviewForm(false)}
                                        onSubmit={handleReviewSubmit}
                                    />
                                </Modal.Body>
                            </Modal>

                            {/* Confirmation Modal */}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Deletion</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Are you sure you want to delete this review?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={handleDeleteReview}>
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </section>
            {showAddModal && (
                <Modal
                    id="add-trip-modal"
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>Add Trip</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <form id="add-trip-form" onSubmit={handleAddTrip}>
                            <div className="form-group">
                                <label>Trip Number:</label>
                                <input type="text" name="tripNumber" value={newTrip.tripNumber} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Trip Date:</label>
                                <input type="date" name="date" value={newTrip.date} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Available Places:</label>
                                <input type="number" name="avilabalPlaces" value={newTrip.avilabalPlaces} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Departure Station:</label>
                                <input type="text" name="departuerStation" value={newTrip.departuerStation} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Arrived Station:</label>
                                <input type="text" name="destinationStation" value={newTrip.destinationStation} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Departure Time:</label>
                                <input type="time" name="departuerTime" value={newTrip.departuerTime} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Arrived Time:</label>
                                <input type="time" name="destinationTime" value={newTrip.destinationTime} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input type="number" name="price" value={newTrip.price} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <input type="text" name="status" value={newTrip.status} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>User</label>
                                <input type="number" name="user" value={newTrip.user} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Bus</label>
                                <input type="number" name="bus" value={newTrip.bus} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Book</label>
                                <input type="number" name="book" value={newTrip.book} onChange={handleNewTripChange} className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-success">
                                Add Trip
                            </button>
                        </form>
                    </ModalBody>
                </Modal>
            )},

            {showEditModal && (
                <Modal
                    id="edit-trip-modal"
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>Edit Trip</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <form id="edit-trip-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Trip Number:</label>
                                <input type="text" name="tripNumber" value={formData.tripNumber} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Trip Date:</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Available Places:</label>
                                <input type="number" name="avilabalPlaces" value={formData.avilabalPlaces} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Departure Station:</label>
                                <input type="text" name="departuerStation" value={formData.departuerStation} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Arrived Station:</label>
                                <input type="text" name="destinationStation" value={formData.destinationStation} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Departure Time:</label>
                                <input type="time" name="departuerTime" value={formData.departuerTime} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Arrived Time:</label>
                                <input type="time" name="destinationTime" value={formData.destinationTime} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <input type="text" name="status" value={formData.status} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>User</label>
                                <input type="number" name="user" value={formData.user} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Bus</label>
                                <input type="number" name="bus" value={formData.bus} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Book</label>
                                <input type="number" name="book" value={formData.book} onChange={handleChange} className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </form>
                    </ModalBody>
                </Modal>
            )}
            ,
            {showDeleteModal && (
                <Modal
                    id="delete-trip-modal"
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                >
                    <ModalHeader closeButton>
                        <ModalTitle>Delete Trip</ModalTitle>
                    </ModalHeader>
                    <ModalBody>Are you sure you want to delete this trip?</ModalBody>
                    <ModalFooter>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelDelete}
                        >
                            Cancel
                        </button>
                    </ModalFooter>
                </Modal>
            )}
            {showLoginModal && (
                <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                    <ModalHeader closeButton>
                        <ModalTitle>Login To Add to Favorites or Book The Trip</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        You need to Login to complete Booking and add your favourite trips
                        !!
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={() => {
                                navigate("/Login1");
                                setShowLoginModal(false);
                            }}
                        >
                            Go to Login
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowLoginModal(false)}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    );
}
