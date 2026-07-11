import React, { useEffect } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetRestaurantOrder } from "../../Redux/OrderSlice";

export const RestaurantOrders = () => {

    const dispatch = useDispatch();

    const {
        order,
        loading
    } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(GetRestaurantOrder());
    }, [dispatch]);

    return (
        <div className="home">
            <Navbar />
            <div className="container py-5">
                <h2 className="fw-bold mb-4">My Orders</h2>
                {
                    loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success"></div>
                        </div>
                    ) : order?.length === 0 ? (
                        <div className="text-center py-5">
                            <h4>No Orders Yet</h4>
                        </div>
                    ) : (
                        order?.map((orderitem) => (
                            <div key={orderitem._id} className="card shadow-sm border-0 mb-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between flex-wrap">
                                        <div>
                                           <h5 className="fw-bold"> Order #{orderitem._id.slice(-6)} </h5>
                                            <p className="text-muted mb-1">Customer :{" "}{orderitem.user?.name}</p>
                                            <p className="text-muted mb-1">Email :{" "}{orderitem.user?.email}</p>
                                            <p className="text-muted">Phone :{" "}{orderitem.user?.phoneNo}</p>
                                        </div>
                                        <div className="text-md-end">
                                            <span className={`badge fs-6
                                                ${
                                                    orderitem.orderStatus === "Delivered"
                                                        ? "bg-success"
                                                        : orderitem.orderStatus === "Preparing"
                                                        ? "bg-warning text-dark"
                                                        : orderitem.orderStatus === "Cancelled"
                                                        ? "bg-danger"
                                                        : "bg-primary"
                                                }`}
                                            >{orderitem.orderStatus}
                                            </span>
                                            <p className="mt-3 mb-0">₹{orderitem.totalAmount}</p>
                                            <small className="text-muted">{new Date(orderitem.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                    <hr />

                                    <h6 className="fw-bold mb-3">Ordered Items</h6>
                                    {orderitem.items?.map((item, index) => (
                                        <div
                                            key={item._id || item.menuItem || index}
                                            className="d-flex justify-content-between align-items-center mb-3"
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={item.image?.url}
                                                    alt={item.name}
                                                    className="rounded"
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                        objectPosition: "top"
                                                    }}
                                                />

                                                <div>
                                                    <h6 className="mb-1">{item.name}</h6>
                                                    <small>Qty: {item.quantity}</small>
                                                </div>
                                            </div>

                                            <h6>₹{item.price}</h6>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
            <Footer />
        </div>
    );
};