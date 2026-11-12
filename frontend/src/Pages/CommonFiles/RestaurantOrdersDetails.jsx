import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleOrder } from "../../Redux/OrderSlice";

export const RestaurantOrderDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {id} = useParams()

    const {singleOrder} = useSelector((state) => state.order)

    useEffect(() => {
        dispatch(GetSingleOrder(id))
    }, [dispatch, id])

    if (!singleOrder) {
        return (
            <div className="min-vh-100 bg-light">
                <Navbar />

                <div className="container py-5 text-center">
                    <i className="bi bi-receipt fs-1 text-secondary"></i>
                    <h5 className="fw-bold mt-3">Order Not Found</h5>
                    <button
                        className="btn btn-dark mt-2"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>

                <Footer />
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-success-subtle text-success";
            case "Preparing":
                return "bg-warning-subtle text-warning-emphasis";
            case "Cancelled":
                return "bg-danger-subtle text-danger";
            case "Pending":
                return "bg-primary-subtle text-primary";
            default:
                return "bg-secondary-subtle text-secondary";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return "bi-check-circle-fill";
            case "Preparing":
                return "bi-fire";
            case "Cancelled":
                return "bi-x-circle-fill";
            case "Pending":
                return "bi-clock-fill";
            default:
                return "bi-receipt";
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <Navbar />

            <div className="container py-4">

                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="btn btn-light border"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>

                        <div>
                            <h4 className="fw-bold mb-0">
                                Order #{singleOrder._id.slice(-6)}
                            </h4>

                            <small className="text-secondary">
                                {new Date(singleOrder.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                                {" • "}
                                {new Date(singleOrder.createdAt).toLocaleTimeString(
                                    "en-IN",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </small>
                        </div>
                    </div>

                    <span
                        className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                            singleOrder.orderStatus
                        )}`}
                    >
                        <i
                            className={`bi ${getStatusIcon(
                                singleOrder.orderStatus
                            )} me-1`}
                        ></i>
                        {singleOrder.orderStatus}
                    </span>
                </div>

                <div className="row g-3">

                    {/* Left Section */}
                    <div className="col-12 col-lg-8">

                        {/* Order Items */}
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-3">

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">
                                        <i className="bi bi-bag me-2"></i>
                                        Order Items
                                    </h6>

                                    <small className="text-secondary">
                                        {singleOrder.items?.length || 0} items
                                    </small>
                                </div>

                                {singleOrder.items?.map((item, index) => (
                                    <div
                                        key={
                                            item._id ||
                                            item.menuItem ||
                                            index
                                        }
                                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                                    >
                                        <div className="d-flex align-items-center gap-3">

                                            <img
                                                src={item.image?.url}
                                                alt={item.name}
                                                className="rounded-3"
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                }}
                                            />

                                            <div>
                                                <h6 className="fw-semibold mb-1">
                                                    {item.name}
                                                </h6>

                                                <small className="text-secondary">
                                                    ₹{item.price} ×{" "}
                                                    {item.quantity}
                                                </small>
                                            </div>
                                        </div>

                                        <strong>
                                            ₹
                                            {item.price *
                                                item.quantity}
                                        </strong>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Customer */}
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-3">

                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-person me-2"></i>
                                    Customer Information
                                </h6>

                                <div className="row g-3">

                                    <div className="col-12 col-md-6">
                                        <small className="text-secondary d-block">
                                            Customer Name
                                        </small>

                                        <span className="fw-semibold">
                                            {singleOrder.user?.name ||
                                                "Unknown Customer"}
                                        </span>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <small className="text-secondary d-block">
                                            Phone Number
                                        </small>

                                        <span className="fw-semibold">
                                            {singleOrder.user?.phoneNo ||
                                                "Not available"}
                                        </span>
                                    </div>

                                    <div className="col-12">
                                        <small className="text-secondary d-block">
                                            Email
                                        </small>

                                        <span className="fw-semibold">
                                            {singleOrder.user?.email ||
                                                "Not available"}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-3">

                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    Delivery Information
                                </h6>

                                <div className="bg-light rounded-3 p-3">
                                    <div className="fw-semibold mb-1">
                                        Delivery Address
                                    </div>

                                    <small className="text-secondary">
                                        {singleOrder.deliveryAddress ||
                                            singleOrder.address ||
                                            "Address information not available"}
                                    </small>
                                </div>

                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">

                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-clock-history me-2"></i>
                                    Order Timeline
                                </h6>

                                <div className="d-flex flex-column gap-3">

                                    <div className="d-flex gap-3">
                                        <i className="bi bi-check-circle-fill text-success"></i>
                                        <div>
                                            <strong>Order Placed</strong>
                                            <small className="text-secondary d-block">
                                                Customer placed the order
                                            </small>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <i
                                            className={`bi ${
                                                singleOrder.orderStatus ===
                                                    "Pending"
                                                    ? "bi-circle text-secondary"
                                                    : "bi-check-circle-fill text-success"
                                            }`}
                                        ></i>

                                        <div>
                                            <strong>Order Confirmed</strong>
                                            <small className="text-secondary d-block">
                                                Restaurant accepted the order
                                            </small>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <i
                                            className={`bi ${
                                                ["Preparing", "Ready", "Delivered"].includes(
                                                    singleOrder.orderStatus
                                                )
                                                    ? "bi-check-circle-fill text-success"
                                                    : "bi-circle text-secondary"
                                            }`}
                                        ></i>

                                        <div>
                                            <strong>Preparing</strong>
                                            <small className="text-secondary d-block">
                                                Restaurant is preparing the food
                                            </small>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <i
                                            className={`bi ${
                                                ["Ready", "Delivered"].includes(
                                                    singleOrder.orderStatus
                                                )
                                                    ? "bi-check-circle-fill text-success"
                                                    : "bi-circle text-secondary"
                                            }`}
                                        ></i>

                                        <div>
                                            <strong>Ready</strong>
                                            <small className="text-secondary d-block">
                                                Order is ready for delivery
                                            </small>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <i
                                            className={`bi ${
                                                singleOrder.orderStatus ===
                                                    "Delivered"
                                                    ? "bi-check-circle-fill text-success"
                                                    : "bi-circle text-secondary"
                                            }`}
                                        ></i>

                                        <div>
                                            <strong>Delivered</strong>
                                            <small className="text-secondary d-block">
                                                Order completed
                                            </small>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Section */}
                    <div className="col-12 col-lg-4">

                        {/* Payment */}
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-3">

                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-credit-card me-2"></i>
                                    Payment
                                </h6>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary">
                                        Payment Status
                                    </span>

                                    <span className="badge bg-success-subtle text-success">
                                        <i className="bi bi-check-circle me-1"></i>
                                        Paid
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary">
                                        Payment Method
                                    </span>

                                    <strong>
                                        Online
                                    </strong>
                                </div>

                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-3">

                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-receipt me-2"></i>
                                    Bill Summary
                                </h6>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary">
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹{singleOrder.totalAmount}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary">
                                        Delivery Fee
                                    </span>

                                    <span>
                                        ₹0
                                    </span>
                                </div>

                                <hr className="my-2" />

                                <div className="d-flex justify-content-between">
                                    <strong>Total</strong>

                                    <strong className="fs-5">
                                        ₹{singleOrder.totalAmount}
                                    </strong>
                                </div>

                            </div>
                        </div>

                        {/* Order Actions */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">

                                <h6 className="fw-bold mb-3">
                                    Order Actions
                                </h6>

                                {singleOrder.orderStatus === "Pending" && (
                                    <button className="btn btn-dark w-100 mb-2">
                                        <i className="bi bi-check2 me-2"></i>
                                        Accept Order
                                    </button>
                                )}

                                {singleOrder.orderStatus === "Preparing" && (
                                    <button className="btn btn-success w-100 mb-2">
                                        <i className="bi bi-check2-all me-2"></i>
                                        Mark as Ready
                                    </button>
                                )}

                                {singleOrder.orderStatus === "Ready" && (
                                    <button className="btn btn-success w-100 mb-2">
                                        <i className="bi bi-bicycle me-2"></i>
                                        Mark as Delivered
                                    </button>
                                )}

                                {!["Delivered", "Cancelled"].includes(
                                    singleOrder.orderStatus
                                ) && (
                                    <button className="btn btn-outline-danger w-100">
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancel Order
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};