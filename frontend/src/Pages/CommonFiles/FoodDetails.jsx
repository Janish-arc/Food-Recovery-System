import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  BsStarFill,
  BsClock,
  BsGeoAlt,
  BsDash,
  BsPlus,
  BsHeart,
  BsHeartFill,
  BsTruck,
  BsShieldCheck,
} from "react-icons/bs";

import { GetSingleFood } from "../../Redux/FoodSlice";
import { CreateCart } from "../../Redux/CartSlice";

export const FoodDetails = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { SingleFood, loading } = useSelector((state) => state.food);
  const { success, error } = useSelector((state) => state.cart)
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    dispatch(GetSingleFood(id));
  }, [dispatch, id]);

  const increase = () => {setQuantity((prev) => prev + 1);};
  const decrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCartHandler = (id) => {
    dispatch(CreateCart({
      menuItem: id,
      quantity
    }))
    if(success){
      toast.success("Food added to Cart successfully")
    }
  };

  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="spinner-border text-danger"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home">
      <div className="container py-4" style={{ minHeight: "80vh" }}>
        <div className="row g-4">

          {/* Food Image */}
          <div className="col-lg-5">
            <div className="card border-0 shadow rounded-4 overflow-hidden">
              <img src={SingleFood?.image?.url} alt={SingleFood?.name} className="img-fluid" style={{height: "500px", width: "100%", objectFit: "cover"}}/>
            </div>
          </div>

          {/* Food Details */}
          <div className="col-lg-7">
            <div className="card border-0 shadow rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className={`badge ${SingleFood?.category?.name === "Veg" ? "bg-success" : "bg-danger"}`}>
                        {SingleFood?.category?.name}
                      </span>

                      <span className="badge bg-warning text-dark"><BsStarFill className="me-1" />
                        {SingleFood?.rating || 4.5}
                      </span>
                    </div>

                    <h2 className="fw-bold">{SingleFood?.name}</h2>
                    <h3 className="text-danger fw-bold mt-3">₹ {SingleFood?.price}</h3>
                  </div>
                  <button className="btn btn-light rounded-circle shadow" onClick={() => setLiked(!liked)} style={{width: "50px", height: "50px"}}>
                    {liked ? (
                      <BsHeartFill className="text-danger" size={22}/>
                      ) : (
                      <BsHeart size={22}/>
                      )}
                  </button>
                </div>
                <hr />

                {/* Restaurant */}
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <BsGeoAlt className="text-danger me-2"/>
                    <span className="fw-semibold">{SingleFood?.restaurant?.name}, {SingleFood?.restaurant?.address}, {SingleFood?.restaurant?.city}</span>
                  </div>
                </div>

                {/* Delivery */}
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="border rounded-4 p-3 h-100">
                      <BsClock className="text-danger mb-2" size={24}/>
                      <h6 className="fw-bold">Delivery Time</h6>
                      <p className="mb-0 text-secondary">{SingleFood?.restaurant?.deliveryTime}</p>
                    </div>
                  </div>

                  <div className="col-6 mb-3">
                    <div className="border rounded-4 p-3 h-100">
                      <BsTruck className="text-danger mb-2" size={24}/>
                      <h6 className="fw-bold">Delivery Fee</h6>
                      <p className="mb-0 text-secondary">₹ {SingleFood?.restaurant?.deliveryFee}</p>
                    </div>
                  </div>
                </div>

                {/* Food Safety */}
                <div className="alert alert-success rounded-4 mt-2">
                  <BsShieldCheck className="me-2"/>
                  Prepared with hygiene and quality ingredients.
                </div>
                <hr />

                {/* Description */}
                <div className="mb-4">
                  <h4 className="fw-bold mb-3">Description</h4>
                  <p className="text-secondary" style={{lineHeight: "30px"}}>{SingleFood?.description}</p>
                </div>

                {/* Availability */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className={`badge fs-6 px-3 py-2 ${SingleFood?.isAvailable ? "bg-success" : "bg-danger"}`}>{SingleFood?.isAvailable ? "Available" : "Out of Stock"}</span>
                  <span className="badge bg-warning text-dark fs-6 px-3 py-2">Bestseller</span>
                  <span className="badge bg-primary fs-6 px-3 py-2">Freshly Prepared</span>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Quantity</h5>
                  <div className="d-inline-flex align-items-center border rounded-pill overflow-hidden">
                    <button className="btn" onClick={decrease}><BsDash size={22} /></button>
                    <span className="px-4 fw-bold fs-5">{quantity}</span>
                    <button className="btn" onClick={increase}><BsPlus size={22} /></button>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-4">
                  <div className="bg-light rounded-4 p-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Total</h5>
                    <h3 className="fw-bold text-danger mb-0">₹ {SingleFood?.price * quantity}</h3>
                  </div>
                </div>

                {/* Buttons */}
                <div className="row">
                  <div className="col-6 mb-3">
                    <button className="btn btn-outline-danger w-100 py-3 rounded-pill fw-bold" onClick={() => addToCartHandler(SingleFood._id)}>🛒 Add To Cart</button>
                  </div>

                  <div className="col-6 mb-3">
                    <button className="btn btn-danger w-100 py-3 rounded-pill fw-bold">Buy Now</button>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mt-3">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <div className="border rounded-4 text-center p-3 h-100">
                        <h4 className="fw-bold text-danger">25+</h4>
                        <small className="text-secondary">Orders Today</small>
                      </div>
                    </div>

                    <div className="col-6  mb-3">
                      <div className="border rounded-4 text-center p-3 h-100">
                        <h4 className="fw-bold text-danger">{SingleFood.rating} ⭐</h4>
                        <small className="text-secondary">Customer Rating</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="card border-0 shadow rounded-4 mt-5 mb-4">
          <div className="card-body p-4">
              <h3 className="fw-bold mb-4">🏪 Restaurant Information</h3>
              <div className="row align-items-center g-4" style={{ cursor: "pointer" }} onClick={() => navigate(`/restaurantdetails/${SingleFood?.restaurant?._id}`)}>
                  {/* Restaurant Image */}
                  <div className="col-12 col-md-3 text-center">
                      <img src={SingleFood?.restaurant?.banner?.url} alt={SingleFood?.restaurant?.name} className="rounded-circle shadow img-fluid" style={{width: "150px",height: "150px",objectFit: "cover"}}/>
                  </div>

                  {/* Restaurant Details */}
                  <div className="col-12 col-md-9 text-center text-md-start">
                      <h3 className="fw-bold mb-2">
                          {SingleFood?.restaurant?.name}
                      </h3>
                      <p className="text-muted mb-3">
                          📍 {SingleFood?.restaurant?.address},{" "}
                          {SingleFood?.restaurant?.city}
                      </p>

                      <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                        <span className="badge bg-success fs-6 px-3 py-2">
                            ⭐ {SingleFood?.restaurant?.rating}
                        </span>
                        <span className="badge bg-primary fs-6 px-3 py-2">
                            🚴 {SingleFood?.restaurant?.deliveryTime}
                        </span>
                        <span
                            className={`badge fs-6 px-3 py-2 ${
                                SingleFood?.restaurant?.isOpen
                                    ? "bg-success"
                                    : "bg-danger"
                            }`}
                        >
                            {SingleFood?.restaurant?.isOpen ? "🟢 Open" : "🔴 Closed"}
                        </span>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        {/* Similar Foods */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">You may also like</h3>
          </div>
          <div className="row g-4">
            {SingleFood?.restaurant?.foods ?.filter(food => food._id !== SingleFood._id) ?.slice(0, 4) ?.map(food => (
                <div className="col-6 col-lg-3 food" key={food._id} onClick={() => navigate(`/fooddetails/${food._id}`)}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <img src={food.image?.url} className="card-img-top rounded-top-4" style={{height: "180px", objectFit: "cover"}} alt={food.name}/>
                    <div className="card-body">
                      <h5 className="fw-bold text-truncate">{food.name}</h5>
                      <p className="text-secondary mb-2">₹ {food.price}</p>
                      <button className="btn btn-outline-danger w-100 rounded-pill" onClick={() => navigate(`/fooddetails/${food._id}`)}>View Food</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="card border-0 shadow rounded-4">

          <div className="card-body p-4">

            <h3 className="fw-bold mb-4">
              Customer Reviews
            </h3>

            <div className="mb-4 border-bottom pb-3">

              <div className="d-flex justify-content-between">

                <h5 className="fw-bold mb-1">
                  Rahul
                </h5>

                <span className="text-warning">
                  ⭐⭐⭐⭐⭐
                </span>

              </div>

              <p className="text-secondary mb-0">
                Delicious food! The taste was amazing and
                the delivery was very quick.
              </p>

            </div>

            <div className="mb-4 border-bottom pb-3">

              <div className="d-flex justify-content-between">

                <h5 className="fw-bold mb-1">
                  Priya
                </h5>

                <span className="text-warning">
                  ⭐⭐⭐⭐☆
                </span>

              </div>

              <p className="text-secondary mb-0">
                Good quality food with generous quantity.
                Would definitely order again.
              </p>

            </div>

            <div>

              <div className="d-flex justify-content-between">

                <h5 className="fw-bold mb-1">
                  Arjun
                </h5>

                <span className="text-warning">
                  ⭐⭐⭐⭐⭐
                </span>

              </div>

              <p className="text-secondary mb-0">
                One of the best dishes from this restaurant.
                Highly recommended.
              </p>

            </div>

          </div>

        </div>
      </div>
      </div>
      <Footer />

    </>

  );

};