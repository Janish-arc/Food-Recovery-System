import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  ChevronDown,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Utensils,
  MapPin,
  CreditCard,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";
import { Footer } from "../../Components/Footer";
import { Navbar } from "../../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetOrdersByAdmin } from "../../Redux/OrderSlice";

export const AdminOrders = () => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest");

  const { adminOrder: orders = [] } = useSelector(
    (state) => state.order
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetOrdersByAdmin());
  }, [dispatch]);

  const statusTabs = [
    "All",
    "Placed",
    "Accepted",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    let result = Array.isArray(orders) ? [...orders] : [];

    if (activeStatus !== "All") {
      result = result.filter(
        (order) => order.orderStatus === activeStatus
      );
    }

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((order) => {
        const orderId = order._id?.toLowerCase() || "";
        const customerName = order.user?.name?.toLowerCase() || "";
        const customerEmail = order.user?.email?.toLowerCase() || "";
        const restaurantName =
          order.restaurant?.name?.toLowerCase() || "";
        const address =
          order.deliveryAddress?.toLowerCase() || "";

        return (
          orderId.includes(searchValue) ||
          customerName.includes(searchValue) ||
          customerEmail.includes(searchValue) ||
          restaurantName.includes(searchValue) ||
          address.includes(searchValue)
        );
      });
    }

    if (sort === "Latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    if (sort === "Oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    }

    if (sort === "Highest Amount") {
      result.sort(
        (a, b) => (b.totalAmount || 0) - (a.totalAmount || 0)
      );
    }

    if (sort === "Lowest Amount") {
      result.sort(
        (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0)
      );
    }

    return result;
  }, [orders, activeStatus, search, sort]);

  const getCount = (status) => {
    if (status === "All") return orders.length;

    return orders.filter(
      (order) => order.orderStatus === status
    ).length;
  };

  const getStatus = (status) => {
    switch (status) {
      case "Placed":
        return {
          icon: <Clock3 size={13} />,
          background: "rgba(245, 158, 11, 0.14)",
          color: "#fbbf24",
          border: "rgba(245, 158, 11, 0.3)",
        };

      case "Accepted":
        return {
          icon: <CheckCircle2 size={13} />,
          background: "rgba(59, 130, 246, 0.14)",
          color: "#60a5fa",
          border: "rgba(59, 130, 246, 0.3)",
        };

      case "Preparing":
        return {
          icon: <Utensils size={13} />,
          background: "rgba(14, 165, 233, 0.14)",
          color: "#38bdf8",
          border: "rgba(14, 165, 233, 0.3)",
        };

      case "Out for Delivery":
        return {
          icon: <Truck size={13} />,
          background: "rgba(168, 85, 247, 0.14)",
          color: "#c084fc",
          border: "rgba(168, 85, 247, 0.3)",
        };

      case "Delivered":
        return {
          icon: <CheckCircle2 size={13} />,
          background: "rgba(34, 197, 94, 0.14)",
          color: "#4ade80",
          border: "rgba(34, 197, 94, 0.3)",
        };

      case "Cancelled":
        return {
          icon: <XCircle size={13} />,
          background: "rgba(239, 68, 68, 0.14)",
          color: "#f87171",
          border: "rgba(239, 68, 68, 0.3)",
        };

      default:
        return {
          icon: null,
          background: "rgba(148, 163, 184, 0.12)",
          color: "#cbd5e1",
          border: "rgba(148, 163, 184, 0.25)",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShortOrderId = (id) => {
    if (!id) return "N/A";
    return id.slice(-8).toUpperCase();
  };

  const getPaymentStatusColor = (paymentStatus) => {
    if (paymentStatus === "Paid") return "#4ade80";
    if (paymentStatus === "Failed") return "#f87171";
    return "#fbbf24";
  };

  return (
    <>
      <Navbar />

      <div
        className="min-vh-100"
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(255, 113, 48, 0.13), transparent 32%), radial-gradient(circle at 95% 15%, rgba(120, 65, 35, 0.12), transparent 28%), #0d0d0d",
          color: "#f8fafc",
        }}
      >
        <main className="container-fluid container-xl px-3 px-md-4 py-4 py-lg-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div>
              <div
                className="small fw-semibold mb-2"
                style={{ color: "#ff7130", letterSpacing: "1px" }}
              >
                ADMINISTRATION / ORDERS
              </div>

              <h3 className="fw-bold mb-2">Orders Management</h3>

              <p
                className="mb-0"
                style={{ color: "#94a3b8", fontSize: "14px" }}
              >
                Monitor and manage all platform orders from one place.
              </p>
            </div>

            <div
              className="input-group rounded-3 overflow-hidden"
              style={{
                maxWidth: "390px",
                background: "#171717",
                border: "1px solid #303030",
              }}
            >
              <span
                className="input-group-text border-0"
                style={{
                  background: "transparent",
                  color: "#94a3b8",
                }}
              >
                <Search size={17} />
              </span>

              <input
                type="text"
                className="form-control border-0 shadow-none search-input"
                placeholder="Search order, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  color: "#f8fafc",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          <div
            className="rounded-4 mb-4 overflow-hidden"
            style={{
              background: "rgba(23, 23, 23, 0.9)",
              border: "1px solid #303030",
            }}
          >
            <div className="d-flex overflow-auto">
              {statusTabs.map((status) => {
                const active = activeStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className="btn rounded-0 border-0 px-3 py-3 text-nowrap"
                    style={{
                      color: active ? "#ff7130" : "#94a3b8",
                      background: active
                        ? "rgba(255, 113, 48, 0.09)"
                        : "transparent",
                      borderBottom: active
                        ? "2px solid #ff7130"
                        : "2px solid transparent",
                      fontSize: "12px",
                      fontWeight: active ? "700" : "500",
                    }}
                  >
                    {status}
                    <span
                      className="ms-2 px-2 py-1 rounded-pill"
                      style={{
                        background: active
                          ? "rgba(255, 113, 48, 0.16)"
                          : "#242424",
                        color: active ? "#ff9a68" : "#94a3b8",
                        fontSize: "10px",
                      }}
                    >
                      {getCount(status)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
            <div>
              <span className="fw-semibold small">
                {activeStatus === "All" ? "All Orders" : activeStatus}
              </span>

              <span
                className="ms-2 small"
                style={{ color: "#94a3b8" }}
              >
                {filteredOrders.length} orders
              </span>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-sm rounded-3 d-flex align-items-center"
                data-bs-toggle="dropdown"
                type="button"
                style={{
                  background: "#171717",
                  border: "1px solid #303030",
                  color: "#cbd5e1",
                  fontSize: "12px",
                }}
              >
                {sort}
                <ChevronDown size={14} className="ms-2" />
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow border-0"
                style={{
                  background: "#1b1b1b",
                  border: "1px solid #303030",
                }}
              >
                {[
                  "Latest",
                  "Oldest",
                  "Highest Amount",
                  "Lowest Amount",
                ].map((option) => (
                  <li key={option}>
                    <button
                      className="dropdown-item"
                      onClick={() => setSort(option)}
                      style={{
                        color: sort === option ? "#ff7130" : "#cbd5e1",
                        background:
                          sort === option
                            ? "rgba(255, 113, 48, 0.1)"
                            : "transparent",
                        fontSize: "12px",
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="row g-3">
              {filteredOrders.map((order) => {
                const status = getStatus(order.orderStatus);

                return (
                  <div
                    className="col-12 col-lg-6 col-xl-4"
                    key={order._id}
                  >
                    <div
                      className="h-100 overflow-hidden rounded-4"
                      style={{
                        background:
                          "linear-gradient(145deg, #191919, #111111)",
                        border: "1px solid #303030",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <div
                        className="p-3 border-bottom"
                        style={{ borderColor: "#303030" }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <div
                              className="fw-bold"
                              style={{
                                color: "#ff8b55",
                                fontSize: "13px",
                              }}
                            >
                              #{getShortOrderId(order._id)}
                            </div>

                            <div
                              className="small mt-1"
                              style={{
                                color: "#64748b",
                                fontSize: "11px",
                              }}
                            >
                              {formatDate(order.createdAt)}
                            </div>
                          </div>

                          <span
                            className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-2"
                            style={{
                              background: status.background,
                              color: status.color,
                              border: `1px solid ${status.border}`,
                              fontSize: "10px",
                              fontWeight: "600",
                            }}
                          >
                            {status.icon}
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div
                            className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              background: "rgba(255, 113, 48, 0.13)",
                              color: "#ff7130",
                            }}
                          >
                            <ShoppingBag size={18} />
                          </div>

                          <div className="min-width-0">
                            <div className="fw-semibold small">
                              {order.user?.name || "Unknown Customer"}
                            </div>

                            <div
                              className="text-truncate"
                              style={{
                                color: "#94a3b8",
                                fontSize: "11px",
                                maxWidth: "220px",
                              }}
                            >
                              {order.user?.email || "No email"}
                            </div>
                          </div>
                        </div>

                        <div
                          className="rounded-3 p-2 mb-3"
                          style={{
                            background: "#202020",
                            border: "1px solid #303030",
                          }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <Utensils
                              size={16}
                              style={{ color: "#ff7130" }}
                            />

                            <div>
                              <small
                                className="d-block"
                                style={{
                                  color: "#64748b",
                                  fontSize: "10px",
                                }}
                              >
                                Restaurant
                              </small>

                              <span
                                className="fw-semibold small"
                                style={{ color: "#e2e8f0" }}
                              >
                                {order.restaurant?.name ||
                                  "Unknown Restaurant"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small
                              className="fw-semibold"
                              style={{ color: "#e2e8f0" }}
                            >
                              Items
                            </small>

                            <small
                              style={{
                                color: "#64748b",
                                fontSize: "11px",
                              }}
                            >
                              {order.items?.length || 0} items
                            </small>
                          </div>

                          <div
                            className="rounded-3 overflow-hidden"
                            style={{
                              border: "1px solid #303030",
                              background: "#161616",
                            }}
                          >
                            {order.items?.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center justify-content-between gap-2 p-2"
                                style={{
                                  borderBottom:
                                    index !==
                                    Math.min(order.items.length, 3) - 1
                                      ? "1px solid #303030"
                                      : "none",
                                }}
                              >
                                <div className="d-flex align-items-center gap-2 min-width-0">
                                  <img
                                    src={item.image?.url}
                                    alt={item.name || "Food item"}
                                    className="rounded-2 flex-shrink-0"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      objectFit: "cover",
                                      background: "#292929",
                                    }}
                                  />

                                  <div className="min-width-0">
                                    <div
                                      className="fw-semibold text-truncate"
                                      style={{
                                        color: "#e2e8f0",
                                        fontSize: "11px",
                                        maxWidth: "145px",
                                      }}
                                    >
                                      {item.name}
                                    </div>

                                    <small
                                      style={{
                                        color: "#64748b",
                                        fontSize: "10px",
                                      }}
                                    >
                                      ₹{item.price} × {item.quantity}
                                    </small>
                                  </div>
                                </div>

                                <span
                                  className="fw-semibold small text-nowrap"
                                  style={{ color: "#f8fafc" }}
                                >
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}

                            {order.items?.length > 3 && (
                              <div
                                className="text-center py-2"
                                style={{
                                  color: "#64748b",
                                  fontSize: "11px",
                                }}
                              >
                                +{order.items.length - 3} more items
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex align-items-start gap-2 mb-3">
                          <MapPin
                            size={16}
                            className="mt-1 flex-shrink-0"
                            style={{ color: "#ff7130" }}
                          />

                          <div className="min-width-0">
                            <small
                              className="d-block mb-1"
                              style={{
                                color: "#64748b",
                                fontSize: "10px",
                              }}
                            >
                              Delivery Address
                            </small>

                            <span
                              className="small"
                              style={{
                                color: "#cbd5e1",
                                lineHeight: "1.4",
                                fontSize: "12px",
                              }}
                            >
                              {order.deliveryAddress || "No address"}
                            </span>
                          </div>
                        </div>

                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <div
                              className="rounded-3 p-2 h-100"
                              style={{
                                background: "#202020",
                                border: "1px solid #303030",
                              }}
                            >
                              <small
                                className="d-block mb-1"
                                style={{
                                  color: "#64748b",
                                  fontSize: "10px",
                                }}
                              >
                                Payment
                              </small>

                              <span
                                className="fw-semibold small"
                                style={{ color: "#e2e8f0" }}
                              >
                                {order.paymentMethod || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="col-6">
                            <div
                              className="rounded-3 p-2 h-100"
                              style={{
                                background: "#202020",
                                border: "1px solid #303030",
                              }}
                            >
                              <small
                                className="d-block mb-1"
                                style={{
                                  color: "#64748b",
                                  fontSize: "10px",
                                }}
                              >
                                Payment Status
                              </small>

                              <span
                                className="fw-semibold small"
                                style={{
                                  color: getPaymentStatusColor(
                                    order.paymentStatus
                                  ),
                                }}
                              >
                                {order.paymentStatus || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className="border-top pt-3"
                          style={{ borderColor: "#303030" }}
                        >
                          <div className="d-flex justify-content-between align-items-center gap-2">
                            <div>
                              <small
                                className="d-block mb-1"
                                style={{
                                  color: "#64748b",
                                  fontSize: "10px",
                                }}
                              >
                                Total Amount
                              </small>

                              <span
                                className="fw-bold fs-5"
                                style={{ color: "#f8fafc" }}
                              >
                                ₹{order.totalAmount || 0}
                              </span>
                            </div>

                            <button
                              className="btn btn-sm rounded-3 d-flex align-items-center"
                              onClick={() =>
                                navigate(`/admin/order/${order._id}`)
                              }
                              style={{
                                background: "rgba(255, 113, 48, 0.12)",
                                border: "1px solid rgba(255, 113, 48, 0.4)",
                                color: "#ff8b55",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              <Eye size={15} className="me-1" />
                              View Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="rounded-4 text-center py-5 px-3"
              style={{
                background: "#171717",
                border: "1px solid #303030",
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  background: "rgba(255, 113, 48, 0.12)",
                  color: "#ff7130",
                }}
              >
                <ShoppingBag size={32} />
              </div>

              <h5 className="fw-bold mb-2">No Orders Found</h5>

              <p
                className="small mb-0"
                style={{ color: "#94a3b8" }}
              >
                Try changing your search or order status.
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};