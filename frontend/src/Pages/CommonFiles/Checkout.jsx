import React, { useEffect, useState } from "react";
import {
  BsGeoAltFill,
  BsTelephoneFill,
  BsCreditCard2FrontFill,
  BsWallet2,
  BsCashCoin,
  BsTagFill,
} from "react-icons/bs";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GetCart } from "../../Redux/CartSlice";

export const Checkout = () => {
  const {user} = useSelector((state) => state.user)
  const {cart} = useSelector((state) => state.cart)
  const [payment, setPayment] = useState("cod");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(GetCart())
  }, [dispatch])

  let discount = 0;
  if (cart?.subtotal >= 1000) {
    discount = cart?.subtotal * 0.15; // 15%
  } else if (cart?.subtotal >= 500) {
    discount = cart?.subtotal * 0.10; // 10%
  } else if (cart?.subtotal >= 250) {
    discount = cart?.subtotal * 0.05; // 5%
  }

  return (
    <>
      <Navbar/>
      <div className="container py-5">
        <div className="mb-4">
          <h2 className="fw-bold">Checkout</h2>
          <p className="text-secondary">Confirm your order details before placing your order.</p>
        </div>

        <div className="row g-4">
          {/* LEFT */}
          <div className="col-lg-8">

            {/* Address */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-3">
                <h5 className="fw-bold"><BsGeoAltFill className="me-2 text-danger" /> Delivery Address</h5>
                <div className="d-flex justify-content-between ">
                  <h6 className="fw-bold p-2">{user?.address}</h6>
                  <Link style={{textDecoration: "none"}}>Change</Link>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-3">
                <h5 className="fw-bold"><BsTelephoneFill className="me-2 text-success" /> Contact Number</h5>
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold p-2">{user.phoneNo}</h6>
                  <Link style={{textDecoration: "none"}}>Change</Link>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"><BsTagFill className="me-2 text-warning" />Coupon</h5>
                <div className="d-flex gap-2">
                  <input type="text" className="form-control" placeholder="Enter Coupon"/>
                  <button className="btn btn-dark px-4">Apply</button>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"> <BsCreditCard2FrontFill className="me-2 text-primary" />Payment Method</h5>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")}/>
                  <label className="form-check-label"> <BsCashCoin className="me-2" /> Cash On Delivery</label>
                </div>

                <div className="form-check mb-3">
                  <input className="form-check-input" type="radio" checked={payment === "upi"} onChange={() => setPayment("upi")}/>
                  <label className="form-check-label"> <BsWallet2 className="me-2" /> UPI Payment</label>
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="radio" checked={payment === "card"} onChange={() => setPayment("card")}/>
                  <label className="form-check-label"> <BsCreditCard2FrontFill className="me-2" /> Credit / Debit Card</label>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">
            <div className="card border-0 shadow rounded-4 sticky-top " style={{ top: "90px", zIndex:"1" }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4"> Order Summary </h4>
                {cart?.items?.map((item) => (
                  <div key={item._id} className="d-flex align-items-center mb-3">
                    <img src={item?.menuItem?.image?.url} alt="" className="rounded-3" style={{width: 65, height: 65, objectFit: "cover"}}/>
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{item?.menuItem?.name}</h6>
                      <small className="text-secondary">Qty : {item?.quantity}</small>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <strong>₹{cart.subtotal}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>GST and Other Charges</span>
                  <strong>₹{cart?.tax + cart.deliveryFee}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <strong>-₹{cart?.discount}</strong>
                </div>
                <hr />

                <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
                  <span>Total</span>
                  <span>₹{cart?.total}</span>
                </div>

                <button className="btn btn-success w-100 py-3 rounded-3 fw-semibold" onClick={() => navigate("/order")}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};