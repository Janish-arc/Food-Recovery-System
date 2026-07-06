import React, { useEffect, useState } from "react";
import { BsGeoAltFill, BsTelephoneFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetCart } from "../../Redux/CartSlice";
import { CreateOrder } from "../../Redux/OrderSlice";

export const Order = () => {

    const {user} = useSelector((state) => state.user)
    const {cart} = useSelector((state) => state.cart)
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [instructions, setInstructions] = useState("");
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(GetCart())
    }, [dispatch])

    const createOrder = () => {
        dispatch(CreateOrder({
            paymentMethod,
            deliveryAddress: user?.address
        }))
        alert("Order Placed Successfully!")
    }

    return (
        <>
            <Navbar />
            <div className="home">
            <div className="container py-5">
                <h2 className="fw-bold text-center mb-5">Order Summary</h2>
                <div className="row g-4">

                    {/* LEFT SECTION */}
                    <div className="col-lg-8">

                        {/* ADDRESS */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold mb-0">Delivery Address</h4>
                                    <button className="btn btn-outline-success rounded-pill"><FaEdit className="me-2" /> Change </button>
                                </div>
                                <h5 className="fw-bold">{user?.name}</h5>
                                <p className="text-muted mb-2">
                                    <BsTelephoneFill className="me-2 text-success" /> {user?.phoneNo}
                                </p>

                                <p className="text-muted mb-0">
                                    <BsGeoAltFill className="me-2 text-danger" /> {user?.address},{" "}{user?.state}{" - "}{user?.pincode}
                                </p>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Ordered Items</h4>
                                {cart?.items?.map((item) => (
                                    <div key={item._id} className="row align-items-center mb-4 pb-4 border-bottom">
                                        <div className="col-4 col-md-3">
                                            <img src={item?.menuItem?.image?.url} alt={item?.menuItem?.name} className="img-fluid rounded-4" style={{width: "120px", height: "120px", objectFit: "cover"}}/>
                                        </div>

                                        <div className="col-8 col-md-6 mt-3 mt-md-0">
                                            <h5 className="fw-bold">{item?.menuItem?.name}</h5>
                                            <p className="text-muted mb-2">
                                                <IoFastFoodOutline className="me-2" />
                                                Quantity :{" "}{item?.quantity}
                                            </p>
                                            <span className="badge bg-success fs-6">₹ {item?.price}</span>
                                        </div>

                                        <div className="col-12 col-md-3 text-md-end mt-3 mt-md-0">
                                            <h5 className="fw-bold text-success">₹ {item?.price * item?.quantity}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION STARTS HERE */}
                    <div className="col-lg-4">
                        {/* ORDER SUMMARY */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4" >
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Payment Summary</h4>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="fw-semibold">₹ {cart?.subtotal}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Discount</span>
                                    <span className="text-success fw-semibold">- ₹ {cart?.discount}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">GST and Other Charges</span>
                                    <span className="fw-semibold">₹ {(cart?.deliveryFee || 0) + (cart?.tax || 0)}</span>
                                </div>
                                <hr />

                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-bold">Grand Total</h5>
                                    <h4 className="fw-bold text-success">₹ {cart?.total}</h4>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT METHOD */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Payment Method</h4>
                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="radio" name="payment" id="cod" checked={paymentMethod === "Cash on Delivery"} onChange={() => setPaymentMethod("Cash on Delivery")}/>
                                    <label htmlFor="cod" className="form-check-label">Cash on Delivery</label>
                                </div>

                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="radio" name="payment" id="upi" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")}/>
                                    <label htmlFor="upi" className="form-check-label">UPI</label>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input" type="radio" name="payment" id="card" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")}/>
                                    <label htmlFor="card" className="form-check-label">Credit / Debit Card</label>
                                </div>
                            </div>
                        </div>

                        {/* INSTRUCTIONS */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-3">Special Instructions</h4>
                                <textarea rows="4" className="form-control rounded-3" placeholder="Add any notes for the restaurant..." value={instructions} onChange={(e) => setInstructions(e.target.value)}/>
                            </div>
                        </div>

                        {/* PLACE ORDER BUTTON */}
                        <button className="btn btn-success w-100 py-3 rounded-4 fw-bold fs-5 shadow" onClick={() => {createOrder()}}>
                            Place Order • ₹ {cart?.total}
                        </button>
                    </div>
                </div>
            </div>
            </div>
            <Footer />
        </>
    );
};