import React, { useEffect, useState } from "react";
import {
    ArrowLeft, Package, ChevronDown, ChevronUp, MapPin, Receipt, Truck,
    CheckCircle, XCircle, Clock, Trash2, ChefHat, Home, CreditCard,
    Star
} from "lucide-react";
import EmptyOrders from "../../assets/cart.webp";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetMyOrder, CancelOrder } from "../../Redux/OrderSlice";
import { useNavigate } from "react-router-dom";
import { CreateRestaurantReview } from "../../Redux/ReviewSlice";
import toast from "react-hot-toast";


const STATUS_STEPS = [
    { key: "Placed", label: "Placed", icon: Receipt },
    { key: "Accepted", label: "Accepted", icon: CheckCircle },
    { key: "Preparing", label: "Preparing", icon: ChefHat },
    { key: "Out for Delivery", label: "On the way", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: Home },
];

const STATUS_META = {
    Placed:            { badge: "bg-primary-subtle text-primary",   accent: "#0d6efd" },
    Accepted:          { badge: "bg-info-subtle text-info",         accent: "#0dcaf0" },
    Preparing:         { badge: "bg-warning-subtle text-warning",   accent: "#ffc107" },
    "Out for Delivery":{ badge: "bg-purple-subtle text-purple",     accent: "#6f42c1" },
    Delivered:         { badge: "bg-success-subtle text-success",   accent: "#198754" },
    Cancelled:         { badge: "bg-danger-subtle text-danger",     accent: "#dc3545" },
};

const CANCELLABLE_STATUSES = ["Placed", "Accepted"];

const statusMeta = (status) => STATUS_META[status] || { badge: "bg-secondary-subtle text-secondary", accent: "#6c757d" };

const OrderSkeleton = () => (
    <div className="card border-0 shadow-sm rounded-4 mb-4 orders-skeleton">
        <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
                <div className="w-50">
                    <div className="skel-line mb-2" style={{ width: "60%", height: "18px" }} />
                    <div className="skel-line" style={{ width: "40%", height: "12px" }} />
                </div>
                <div className="skel-line" style={{ width: "80px", height: "26px", borderRadius: "20px" }} />
            </div>
            <div className="d-flex gap-2 mb-3">
                <div className="skel-line" style={{ width: "70px", height: "70px", borderRadius: "12px" }} />
                <div className="skel-line" style={{ width: "70px", height: "70px", borderRadius: "12px" }} />
            </div>
            <div className="skel-line" style={{ width: "100%", height: "6px" }} />
        </div>
    </div>
);

export const MyOrders = () => {

    const { order, loading } = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [expandedId, setExpandedId] = useState(null);
    const [reviewId, setReviewId] = useState(null)
    const [filter, setFilter] = useState("All");
    const [cancellingId, setCancellingId] = useState(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        dispatch(GetMyOrder());
    }, [dispatch]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };
    const toggleReview = (id) => {
        setReviewId(reviewId === id ? null : id)
    }
    const filteredOrders = order?.filter((o) => {
        if (filter === "All") return true;
        if (filter === "Active") return !["Delivered", "Cancelled"].includes(o?.orderStatus);
        return o?.orderStatus === filter;
    });

    const counts = {
        All: order?.length || 0,
        Active: order?.filter((o) => !["Delivered", "Cancelled"].includes(o?.orderStatus)).length || 0,
        Delivered: order?.filter((o) => o?.orderStatus === "Delivered").length || 0,
        Cancelled: order?.filter((o) => o?.orderStatus === "Cancelled").length || 0,
    };

    const cancelorder = async (id) => {
        setCancellingId(id);
        await dispatch(CancelOrder(id));
        await dispatch(GetMyOrder());
        setCancellingId(null);
    };

    const submitReview = async (o) => {
        const result = await dispatch(
            CreateRestaurantReview({
                restaurant: o.restaurant._id,
                order: o._id,
                rating,
                comment,
            })
        );
        if (CreateRestaurantReview.fulfilled.match(result)) {
            toast.success(result.payload.message);
            setReviewId(null)
        } else {
            toast.error(result.payload?.message || "Something went wrong");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="home">
            <div className="container py-4">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm border-0"
                            style={{ width: "42px", height: "42px" }}
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h3 className="fw-bold mb-0">My Orders</h3>
                            <small className="text-secondary">{order?.length || 0} order{order?.length === 1 ? "" : "s"} placed</small>
                        </div>
                    </div>
                    <div className="orders-icon-badge d-flex align-items-center justify-content-center rounded-circle">
                        <Package size={22} className="text-warning" />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="d-flex gap-2 mb-4 overflow-auto pb-1 orders-filter-row">
                    {["All", "Active", "Delivered", "Cancelled"].map((f) => (
                        <button
                            key={f}
                            className={`btn rounded-pill btn-sm px-3 d-flex align-items-center gap-1 flex-shrink-0 ${filter === f ? "btn-dark" : "btn-outline-secondary"}`}
                            onClick={() => setFilter(f)}>
                            {f}
                            <span className={`badge rounded-pill ${filter === f ? "bg-white text-dark" : "bg-secondary-subtle text-secondary"}`}>{counts[f]}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <>
                        <OrderSkeleton />
                        <OrderSkeleton />
                    </>
                ) : filteredOrders?.length === 0 ? (
                    <div className="text-center py-5">
                        <img
                            src={EmptyOrders}
                            alt=""
                            className="rounded-4 shadow-sm"
                            style={{ width: window.innerWidth >= 768 ? "420px" : "260px" }}
                        />
                        <h4 className="fw-bold mt-4 mb-1">
                            {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
                        </h4>
                        <p className="text-secondary mb-3">
                            {filter === "All"
                                ? "Once you place an order, you'll be able to track it here."
                                : "Try a different filter to see more orders."}
                        </p>
                        <button className="btn btn-warning rounded-pill px-4 fw-semibold" onClick={() => navigate("/")}>
                            Browse restaurants
                        </button>
                    </div>
                ) : (
                    filteredOrders?.map((o) => {
                        const meta = statusMeta(o?.orderStatus);
                        const currentIndex = STATUS_STEPS.findIndex((s) => s.key === o?.orderStatus);
                        const isFinal = ["Delivered", "Cancelled"].includes(o?.orderStatus);
                        const canCancel = CANCELLABLE_STATUSES.includes(o?.orderStatus);
                        const visibleItems = o?.items?.slice(0, 4) || [];
                        const extraCount = (o?.items?.length || 0) - visibleItems.length;

                        return (
                            <div
                                key={o._id}
                                className="card border-0 shadow-sm rounded-4 mb-4 order-card"
                                style={{ borderLeft: `5px solid ${meta.accent}` }}
                            >
                                <div className="card-body">

                                    {/* Order Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="fw-bold mb-1">{o?.restaurant?.name}</h5>
                                            <small className="text-secondary d-flex align-items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(o?.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                                })}
                                            </small>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <button className="btn btn-primary rounded btn-sm" onClick={() => navigate(`/orderdetails/${o._id}`)}><small>View Order</small></button>
                                            <span className={`badge rounded-pill px-2 py-1 ${meta.badge}`}>
                                                {o?.orderStatus}
                                            </span>
                                            {canCancel && (
                                                <button
                                                    className="btn border-danger btn-sm rounded-circle d-flex align-items-center justify-content-center text-danger"
                                                    style={{ width: "34px", height: "34px" }}
                                                    title="Cancel order"
                                                    disabled={cancellingId === o._id}
                                                    onClick={() => cancelorder(o._id)}
                                                >
                                                    {cancellingId === o._id
                                                        ? <span className="spinner-border spinner-border-sm" />
                                                        : <Trash2 size={15} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items Preview */}
                                    <div className="d-md-flex gap-2 overflow-auto pb-2 mb-3">
                                        {visibleItems.map((item) => (
                                            <div key={item?._id} className="d-flex align-items-center gap-2 flex-shrink-0 my-2">
                                                <img
                                                    src={item?.image?.url}
                                                    alt={item?.name}
                                                    className="rounded-3"
                                                    style={{ width: "64px", height: "64px", objectFit: "cover" }}
                                                />
                                                <div>
                                                    <h6 className="fw-semibold mb-0 small">{item?.name}</h6>
                                                    <small className="text-secondary">x{item?.quantity}</small>
                                                </div>
                                            </div>
                                        ))}
                                        {extraCount > 0 && (
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-3 bg-light text-secondary fw-semibold flex-shrink-0"
                                                style={{ width: "64px", height: "64px" }}
                                            >
                                                +{extraCount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Tracker */}
                                    {!isFinal && (
                                        <div className="order-stepper d-flex align-items-start mb-3">
                                            {STATUS_STEPS.map((step, i) => {
                                                const done = i <= currentIndex;
                                                const StepIcon = step.icon;
                                                return (
                                                    <div
                                                        key={step.key}
                                                        className={`d-flex flex-column align-items-center ${i !== STATUS_STEPS.length - 1 ? "flex-grow-1" : ""}`}
                                                    >
                                                        <div className="d-flex align-items-center w-100">
                                                            <div
                                                                className={`step-dot d-flex align-items-center justify-content-center rounded-circle ${done ? "step-dot-done" : "step-dot-pending"}`}
                                                                style={done ? { backgroundColor: meta.accent } : {}}
                                                            >
                                                                <StepIcon size={13} color={done ? "#fff" : "#adb5bd"} />
                                                            </div>
                                                            {i !== STATUS_STEPS.length - 1 && (
                                                                <div
                                                                    className="step-line flex-grow-1"
                                                                    style={{ backgroundColor: i < currentIndex ? meta.accent : "#e9ecef" }}
                                                                />
                                                            )}
                                                        </div>
                                                        <small className={`mt-2 text-center step-label ${done ? "fw-semibold text-dark" : "text-secondary"}`}>
                                                            {step.label}
                                                        </small>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {o?.orderStatus === "Cancelled" && (
                                        <div className="d-flex align-items-center gap-2 text-danger mb-3">
                                            <XCircle size={18} /> <small className="fw-bold">This order was cancelled</small>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <small className="text-secondary d-block">Total</small>
                                            <h5 className="fw-bold mb-0">₹ {o?.totalAmount}</h5>
                                        </div>
                                        <div className="d-flex gap-2">
                                            {o?.orderStatus === "Delivered" && (
                                            <button className="btn btn-light btn-outline-dark btn-sm rounded-pill px-3"
                                                onClick={() => toggleReview(o?._id)}
                                            >Review Restaurant</button>)}
                                            <button className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                                                onClick={() => toggleExpand(o?._id)}
                                            >
                                                {expandedId === o?._id ? "Hide details" : "View details"}
                                                {expandedId === o?._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedId === o?._id && (
                                        <div className="order-receipt mt-3 pt-3">
                                            {o?.items?.map((item) => (
                                                <div key={item?._id} className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary">
                                                        {item?.name} <span className="text-muted">x{item?.quantity}</span>
                                                    </span>
                                                    <span className="fw-semibold">₹ {item?.price * item?.quantity}</span>
                                                </div>
                                            ))}

                                            <div className="order-receipt-divider my-3" />

                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-secondary">Subtotal</span>
                                                <span>₹ {o?.subtotal}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-secondary">Delivery fee</span>
                                                <span>₹ {o?.deliveryFee}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-secondary">Tax</span>
                                                <span>₹ {o?.tax}</span>
                                            </div>
                                            {o?.discount > 0 && (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-secondary">Discount</span>
                                                    <span className="text-success">- ₹ {o?.discount}</span>
                                                </div>
                                            )}

                                            <div className="order-receipt-divider my-3" />

                                            <div className="d-flex justify-content-between mb-3">
                                                <h6 className="fw-bold">Grand total</h6>
                                                <h6 className="fw-bold text-success">₹ {o?.totalAmount}</h6>
                                            </div>

                                            <div className="d-flex align-items-start gap-2 text-secondary mb-2">
                                                <MapPin size={16} className="flex-shrink-0 mt-1" />
                                                <small>{o?.deliveryAddress}</small>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-2 text-secondary">
                                                    <CreditCard size={16} /> <small>{o?.paymentMethod}</small>
                                                </div>
                                                <small className={`fw-bold ${o?.paymentStatus === "Paid" ? "text-success" : "text-warning"}`}>
                                                    {o?.paymentStatus}
                                                </small>
                                            </div>

                                            {o?.deliveryPartner?.name && (
                                                <div className="d-flex align-items-center gap-2 text-secondary">
                                                    <Truck size={16} /> <small>Delivery partner: {o?.deliveryPartner?.name}</small>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {reviewId === o?._id && (
                                        <div>
                                            <hr/>
                                            <div className="my-3">
                                                <label className="form-label"><small>Rating</small></label>
                                                <div className="d-flex align-items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star}
                                                    size={20} fill={(hover || rating) >= star ? "#ffc107" : "none"} color={(hover || rating) >= star ? "#ffc107" : "#ced4da"}
                                                    style={{ cursor: "pointer" }} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}/>
                                                ))}
                                                <small className="ms-2 text-muted"> {rating > 0 ? `${rating}/5` : "Select Rating"} </small>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Comment</label>

                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your experience..."
                                                />
                                            </div>
                                            <button className="btn btn-warning btn-sm float-end" onClick={() => submitReview(o)}>Submit Review</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            </div>
            <Footer />
        </div>
    );
};