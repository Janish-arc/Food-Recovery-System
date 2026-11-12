import React, { useEffect } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Store,
  IndianRupee,
  Utensils,
  User,
  CalendarDays,
  Navigation,
  CircleCheck,
  CircleX,
  MoreVertical,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleRestaurant } from "../../Redux/RestaurantSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";

export const AdminRestaurantDetails = () => {
  
  const {restaurant} = useSelector((state) => state.restaurant)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { id } = useParams();

  useEffect(() => {
    dispatch(GetSingleRestaurant(id))
  }, [dispatch])

  // Replace this with your Redux restaurant data
//   const restaurant = {
//     _id: id,
//     name: "Burger Hub",
//     description:
//       "Fresh and delicious burgers, fries and fast food prepared with quality ingredients.",
//     logo: {
//       url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
//     },
//     banner: {
//       url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200",
//     },
//     owner: {
//       _id: "owner123",
//       name: "Janish",
//       email: "janish@gmail.com",
//       phoneNo: "9876543210",
//     },
//     email: "burgerhub@gmail.com",
//     phone: "9876543210",
//     address: "123 Main Road",
//     city: "Kumbakonam",
//     state: "Tamil Nadu",
//     pincode: "612001",
//     location: "Kumbakonam",
//     openingTime: "10:00 AM",
//     closingTime: "11:00 PM",
//     deliveryFee: 30,
//     minimumOrder: 100,
//     deliveryTime: "25-35 min",
//     rating: 4.5,
//     totalReviews: 128,
//     isOpen: true,
//     createdAt: "2026-08-10T10:00:00.000Z",
//     foods: [],
//   };

  const foods = restaurant.foods || [];

  return (
    <>
    <Navbar/>
    <div className="container-fluid bg-light min-vh-100 px-3 px-md-4 py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-white border rounded-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h3 className="fw-bold mb-1">Restaurant Details</h3>
            <p className="text-secondary mb-0">
              View and manage restaurant information
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary rounded-3 px-3 d-flex align-items-center gap-2">
            <Pencil size={17} />
            <span>Edit</span>
          </button>

          <button className="btn btn-outline-danger rounded-3 px-3 d-flex align-items-center gap-2">
            <Trash2 size={17} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm overflow-hidden mb-4">
        <div
          style={{
            height: "clamp(180px, 25vw, 300px)",
            backgroundImage: `url(${restaurant.banner?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row align-items-md-end gap-3">
            <img
              src={restaurant.logo?.url}
              alt={restaurant.name}
              className="rounded-4 border border-4 border-white shadow"
              style={{
                width: 110,
                height: 110,
                objectFit: "cover",
                marginTop: -70,
              }}
            />

            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <h2 className="fw-bold mb-0">{restaurant.name}</h2>

                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    restaurant.isOpen
                      ? "text-success bg-success-subtle"
                      : "text-danger bg-danger-subtle"
                  }`}
                >
                  {restaurant.isOpen ? (
                    <>
                      <CircleCheck size={14} className="me-1" />
                      Open
                    </>
                  ) : (
                    <>
                      <CircleX size={14} className="me-1" />
                      Closed
                    </>
                  )}
                </span>
              </div>

              <p className="text-secondary mb-2 mt-1">
                {restaurant.description}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3 small">
                <span className="d-flex align-items-center gap-1">
                  <Star
                    size={16}
                    fill="#f59e0b"
                    color="#f59e0b"
                  />
                  <strong>{restaurant.rating?.toFixed(1)}</strong>
                  <span className="text-secondary">
                    ({restaurant.totalReviews} reviews)
                  </span>
                </span>

                <span className="text-secondary">•</span>

                <span className="d-flex align-items-center gap-1 text-secondary">
                  <MapPin size={15} />
                  {restaurant.city}, {restaurant.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">Restaurant Information</h5>
                <p className="text-secondary small mb-0">
                  Basic information about this restaurant
                </p>
              </div>

              <Store size={22} className="text-secondary" />
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100">
                  <small className="text-secondary d-block mb-1">
                    Restaurant Name
                  </small>
                  <span className="fw-semibold">
                    {restaurant.name}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100">
                  <small className="text-secondary d-block mb-1">
                    Restaurant Email
                  </small>
                  <span className="fw-semibold text-break">
                    {restaurant.email}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100">
                  <small className="text-secondary d-block mb-1">
                    Phone Number
                  </small>
                  <span className="fw-semibold">
                    {restaurant.phone}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100">
                  <small className="text-secondary d-block mb-1">
                    Location
                  </small>
                  <span className="fw-semibold">
                    {restaurant.location}
                  </span>
                </div>
              </div>

              <div className="col-12">
                <div className="bg-light rounded-3 p-3">
                  <small className="text-secondary d-block mb-1">
                    Description
                  </small>
                  <span className="fw-medium">
                    {restaurant.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">Address</h5>
                <p className="text-secondary small mb-0">
                  Restaurant location details
                </p>
              </div>

              <MapPin size={22} className="text-secondary" />
            </div>

            <div className="d-flex align-items-start gap-3">
              <div className="rounded-3 bg-primary-subtle text-primary p-2">
                <Navigation size={20} />
              </div>

              <div>
                <div className="fw-semibold mb-1">
                  {restaurant.address}
                </div>
                <div className="text-secondary">
                  {restaurant.city}, {restaurant.state} -{" "}
                  {restaurant.pincode}
                </div>
              </div>
            </div>

            <button className="btn btn-outline-primary rounded-3 mt-4 d-flex align-items-center gap-2">
              <Navigation size={16} />
              View Location
            </button>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
              <div>
                <h5 className="fw-bold mb-1">Restaurant Menu</h5>
                <p className="text-secondary small mb-0">
                  Menu items available in this restaurant
                </p>
              </div>

              <span className="badge bg-dark rounded-pill px-3 py-2">
                {foods.length} Items
              </span>
            </div>

            {foods.length > 0 ? (
              <div className="row g-3">
                {foods.map((food) => (
                  <div className="col-12 col-md-6" key={food._id}>
                    <div className="border rounded-4 p-3">
                      <div className="d-flex gap-3">
                        <img
                          src={food.image?.url}
                          alt={food.name}
                          className="rounded-3"
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "cover",
                          }}
                        />

                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1">
                            {food.name}
                          </h6>

                          <div className="small text-secondary mb-1">
                            ₹{food.price}
                          </div>

                          <span
                            className={`badge rounded-pill ${
                              food.isAvailable
                                ? "text-success bg-success-subtle"
                                : "text-danger bg-danger-subtle"
                            }`}
                          >
                            {food.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>

                        <button className="btn btn-light btn-sm rounded-3 align-self-start">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 border rounded-4">
                <Utensils
                  size={40}
                  className="text-secondary mb-3"
                />
                <h6 className="fw-semibold">No menu items</h6>
                <p className="text-secondary small mb-0">
                  This restaurant has no menu items yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <h5 className="fw-bold mb-4">Owner</h5>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style={{
                  width: 55,
                  height: 55,
                }}
              >
                <User size={25} />
              </div>

              <div>
                <h6 className="fw-bold mb-1">
                  {restaurant.owner?.name || "N/A"}
                </h6>
                <span className="text-secondary small">
                  Restaurant Owner
                </span>
              </div>
            </div>

            <div className="border-top pt-3">
              <div className="d-flex gap-2 mb-3">
                <Mail size={17} className="text-secondary" />
                <div className="small text-break">
                  {restaurant.owner?.email || "N/A"}
                </div>
              </div>

              <div className="d-flex gap-2">
                <Phone size={17} className="text-secondary" />
                <div className="small">
                  {restaurant.owner?.phoneNo || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <h5 className="fw-bold mb-4">Opening Hours</h5>

            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <Clock size={18} className="text-secondary" />
                <span className="fw-medium">Opening Time</span>
              </div>

              <span className="fw-semibold">
                {restaurant.openingTime}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <Clock size={18} className="text-secondary" />
                <span className="fw-medium">Closing Time</span>
              </div>

              <span className="fw-semibold">
                {restaurant.closingTime}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <h5 className="fw-bold mb-4">Delivery Details</h5>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-secondary">
                Delivery Time
              </span>
              <span className="fw-semibold">
                {restaurant.deliveryTime}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-secondary">
                Delivery Fee
              </span>
              <span className="fw-semibold d-flex align-items-center">
                <IndianRupee size={14} />
                {restaurant.deliveryFee}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">
                Minimum Order
              </span>
              <span className="fw-semibold d-flex align-items-center">
                <IndianRupee size={14} />
                {restaurant.minimumOrder}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
            <h5 className="fw-bold mb-4">Rating Overview</h5>

            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold mb-1">
                {restaurant.rating?.toFixed(1)}
              </h1>

              <div className="d-flex justify-content-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <= Math.round(restaurant.rating)
                        ? "#f59e0b"
                        : "none"
                    }
                    color="#f59e0b"
                  />
                ))}
              </div>

              <span className="text-secondary small">
                Based on {restaurant.totalReviews} reviews
              </span>
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between small mb-2">
                <span>5 Star</span>
                <span>Excellent</span>
              </div>

              <div className="progress mb-3" style={{ height: 7 }}>
                <div
                  className="progress-bar bg-warning"
                  style={{ width: "75%" }}
                />
              </div>

              <div className="d-flex justify-content-between small mb-2">
                <span>4 Star</span>
                <span>Good</span>
              </div>

              <div className="progress mb-3" style={{ height: 7 }}>
                <div
                  className="progress-bar bg-warning"
                  style={{ width: "55%" }}
                />
              </div>

              <div className="d-flex justify-content-between small mb-2">
                <span>3 Star</span>
                <span>Average</span>
              </div>

              <div className="progress" style={{ height: 7 }}>
                <div
                  className="progress-bar bg-warning"
                  style={{ width: "25%" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
            <h5 className="fw-bold mb-4">Restaurant Status</h5>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                {restaurant.isOpen ? (
                  <CircleCheck
                    size={20}
                    className="text-success"
                  />
                ) : (
                  <CircleX size={20} className="text-danger" />
                )}

                <span className="fw-medium">
                  Currently {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={restaurant?.isOpen ?? false}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mt-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <CalendarDays
                size={18}
                className="text-secondary"
              />
              <span className="text-secondary small">
                Restaurant Added
              </span>
            </div>

            <div className="fw-semibold">
              {restaurant.createdAt
                ? new Date(
                    restaurant.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};