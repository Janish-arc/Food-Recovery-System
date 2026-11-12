// import React, { useEffect } from "react";
// import { Navbar } from "../../Components/Navbar";
// import { Footer } from "../../Components/Footer";
// import { useDispatch, useSelector } from "react-redux";
// import { GetRestaurantOrder } from "../../Redux/OrderSlice";

// export const RestaurantOrders = () => {

//     const dispatch = useDispatch();

//     const {
//         order,
//         loading
//     } = useSelector((state) => state.order);

//     useEffect(() => {
//         dispatch(GetRestaurantOrder());
//     }, [dispatch]);

//     return (
//         <div className="home">
//             <Navbar />
//             <div className="container py-5">
//                 <h2 className="fw-bold mb-4">My Orders</h2>
//                 {
//                     loading ? (
//                         <div className="text-center py-5">
//                             <div className="spinner-border text-success"></div>
//                         </div>
//                     ) : order?.length === 0 ? (
//                         <div className="text-center py-5">
//                             <h4>No Orders Yet</h4>
//                         </div>
//                     ) : (
//                         order?.map((orderitem) => (
//                             <div key={orderitem._id} className="card shadow-sm border-0 mb-4">
//                                 <div className="card-body">
//                                     <div className="d-flex justify-content-between flex-wrap">
//                                         <div>
//                                            <h5 className="fw-bold"> Order #{orderitem._id.slice(-6)} </h5>
//                                             <p className="text-muted mb-1">Customer :{" "}{orderitem.user?.name}</p>
//                                             <p className="text-muted mb-1">Email :{" "}{orderitem.user?.email}</p>
//                                             <p className="text-muted">Phone :{" "}{orderitem.user?.phoneNo}</p>
//                                         </div>
//                                         <div className="text-md-end">
//                                             <span className={`badge fs-6
//                                                 ${
//                                                     orderitem.orderStatus === "Delivered"
//                                                         ? "bg-success"
//                                                         : orderitem.orderStatus === "Preparing"
//                                                         ? "bg-warning text-dark"
//                                                         : orderitem.orderStatus === "Cancelled"
//                                                         ? "bg-danger"
//                                                         : "bg-primary"
//                                                 }`}
//                                             >{orderitem.orderStatus}
//                                             </span>
//                                             <p className="mt-3 mb-0">₹{orderitem.totalAmount}</p>
//                                             <small className="text-muted">{new Date(orderitem.createdAt).toLocaleDateString()}</small>
//                                         </div>
//                                     </div>
//                                     <hr />

//                                     <h6 className="fw-bold mb-3">Ordered Items</h6>
//                                     {orderitem.items?.map((item, index) => (
//                                         <div
//                                             key={item._id || item.menuItem || index}
//                                             className="d-flex justify-content-between align-items-center mb-3"
//                                         >
//                                             <div className="d-flex align-items-center gap-3">
//                                                 <img
//                                                     src={item.image?.url}
//                                                     alt={item.name}
//                                                     className="rounded"
//                                                     style={{
//                                                         width: "70px",
//                                                         height: "70px",
//                                                         objectFit: "cover",
//                                                         objectPosition: "top"
//                                                     }}
//                                                 />

//                                                 <div>
//                                                     <h6 className="mb-1">{item.name}</h6>
//                                                     <small>Qty: {item.quantity}</small>
//                                                 </div>
//                                             </div>

//                                             <h6>₹{item.price}</h6>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))
//                     )
//                 }
//             </div>
//             <Footer />
//         </div>
//     );
// };










import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetRestaurantOrder } from "../../Redux/OrderSlice";
import { useNavigate } from "react-router-dom";

export const RestaurantOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { order, loading } = useSelector((state) => state.order);
    const [activeStatus, setActiveStatus] = useState("All");

    useEffect(() => {
        dispatch(GetRestaurantOrder());
    }, [dispatch]);

    const statuses = ["All", "Pending", "Preparing", "Delivered", "Cancelled"];

    const filteredOrders =
        activeStatus === "All"
            ? order
            : order?.filter((item) => item.orderStatus === activeStatus);

    const getCount = (status) => {
        if (status === "All") return order?.length || 0;
        return order?.filter((item) => item.orderStatus === status).length || 0;
    };

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
        <div className="home bg-light min-vh-100">
            <Navbar />
            <div className="container py-4">
                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
                    <div>
                        <h3 className="fw-bold mb-1">Restaurant Orders</h3>
                        <small className="text-secondary">Manage your customer orders</small>
                    </div>
                    <div className="bg-white border rounded-3 px-3 py-2">
                        <small className="text-secondary me-2">Total Orders</small>
                        <strong>{order?.length || 0}</strong>
                    </div>
                </div>

                {/* Filters */}
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-2">
                        <div className="d-flex gap-2 overflow-auto">
                            {statuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setActiveStatus(status)}
                                    className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                                        activeStatus === status
                                            ? "btn-dark"
                                            : "btn-light border"
                                    }`}
                                >
                                    {status}
                                    <span
                                        className={`badge ms-1 ${
                                            activeStatus === status
                                                ? "bg-white text-dark"
                                                : "bg-secondary-subtle text-secondary"
                                        }`}
                                    >
                                        {getCount(status)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders */}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-dark"></div>
                        <span className="ms-2 text-secondary">Loading orders...</span>
                    </div>
                ) : filteredOrders?.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="bi bi-receipt fs-2 text-secondary"></i>
                            <h6 className="fw-bold mt-2 mb-1">No Orders Found</h6>
                            <small className="text-secondary">
                                No {activeStatus.toLowerCase()} orders available.
                            </small>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {filteredOrders?.map((orderitem) => (
                            <div key={orderitem._id} className="card border-0 shadow-sm">
                                <div className="card-body p-3">
                                    {/* Order Header */}
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                className="bg-dark text-white rounded-2 d-flex align-items-center justify-content-center"
                                                style={{ width: "38px", height: "38px" }}
                                            >
                                                <i className="bi bi-receipt"></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-0">
                                                    #{orderitem._id.slice(-6)}
                                                </h6>
                                                <small className="text-secondary">
                                                    {new Date(orderitem.createdAt).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                    {" • "}
                                                    {new Date(orderitem.createdAt).toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3">
                                            <span
                                                className={`badge rounded-pill px-2 py-2 ${getStatusClass(
                                                    orderitem.orderStatus
                                                )}`}
                                            >
                                                <i
                                                    className={`bi ${getStatusIcon(
                                                        orderitem.orderStatus
                                                    )} me-1`}
                                                ></i>
                                                {orderitem.orderStatus}
                                            </span>
                                            <div className="text-end">
                                                <small className="text-secondary d-block">
                                                    Total
                                                </small>
                                                <strong>₹{orderitem.totalAmount}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="my-2" />

                                    {/* Customer */}
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="bi bi-person-circle fs-5 text-secondary"></i>
                                        <div>
                                            <strong className="small">
                                                {orderitem.user?.name || "Unknown Customer"}
                                            </strong>
                                            <small className="text-secondary ms-2">
                                                {orderitem.user?.phoneNo}
                                            </small>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="d-flex flex-column gap-1">
                                        {orderitem.items?.map((item, index) => (
                                            <div
                                                key={item._id || item.menuItem || index}
                                                className="d-flex justify-content-between align-items-center bg-light rounded-2 p-2"
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src={item.image?.url}
                                                        alt={item.name}
                                                        className="rounded-2"
                                                        style={{
                                                            width: "48px",
                                                            height: "48px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="fw-semibold small">
                                                            {item.name}
                                                        </div>
                                                        <small className="text-secondary">
                                                            Qty: {item.quantity}
                                                        </small>
                                                    </div>
                                                </div>
                                                <strong className="small">
                                                    ₹{item.price}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom */}
                                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top flex-wrap gap-2">
                                        <span className="badge bg-success-subtle text-success">
                                            <i className="bi bi-check-circle me-1"></i>
                                            Paid
                                        </span>

                                        <div className="d-flex gap-2">
                                            {orderitem.orderStatus === "Pending" && (
                                                <button className="btn btn-dark btn-sm">
                                                    Accept
                                                </button>
                                            )}

                                            {orderitem.orderStatus === "Preparing" && (
                                                <button className="btn btn-success btn-sm">
                                                    Mark Ready
                                                </button>
                                            )}

                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/admin/order/${orderitem._id}`)}>
                                                <i className="bi bi-eye me-1"></i>
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};