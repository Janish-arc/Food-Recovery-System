import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";

import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers } from "../../Redux/UserSlice";
import { GetAllFoods } from "../../Redux/FoodSlice";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";

import {
    Users,
    Utensils,
    CheckCircle2,
    Truck,
    PackageCheck,
    Clock3,
    Eye,
    X,
    CalendarDays,
    ChevronRight,
    LayoutDashboard,
} from "lucide-react";


export const Admin = () => {
    const { users, user } = useSelector((state) => state.user);
    const { food } = useSelector((state) => state.food);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pop, setPop] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const userList = Array.isArray(users) ? users : [];
    const foodList = Array.isArray(food) ? food : [];

    const availableFoods = foodList.filter(
        (item) => item.status === "Available"
    ).length;

    const acceptedFoods = foodList.filter(
        (item) => item.status === "Accepted"
    ).length;

    const outForDeliveryFoods = foodList.filter(
        (item) => item.status === "Out for Delivery"
    ).length;

    const deliveredFoods = foodList.filter(
        (item) => item.status === "Delivered"
    ).length;

    const expiredFoods = foodList.filter(
        (item) =>
            new Date(item.expiryDate) < new Date() &&
            item.status !== "Delivered"
    ).length;

    const sortedFood = [...foodList].slice(0, 5);

    const chartData = [
        { name: "Available", value: availableFoods },
        { name: "Accepted", value: acceptedFoods },
        { name: "Out for Delivery", value: outForDeliveryFoods },
        { name: "Delivered", value: deliveredFoods },
        { name: "Expired", value: expiredFoods },
    ];

    const chartColors = [
        "#22c55e",
        "#facc15",
        "#f97316",
        "#3b82f6",
        "#ef4444",
    ];

    useEffect(() => {
        dispatch(GetAllUsers());
        dispatch(GetAllFoods());
    }, [dispatch]);

    const getStatusClass = (status) => {
        switch (status) {
            case "Available":
                return "status-available";
            case "Accepted":
                return "status-accepted";
            case "Out for Delivery":
                return "status-delivery";
            case "Delivered":
                return "status-delivered";
            default:
                return "status-expired";
        }
    };

    return (
    <div className="admin-page min-vh-100">
        <Navbar />

        <main className="container-fluid px-3 px-md-5 py-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                <div>
                    <small className="admin-label">
                        <i className="bi bi-speedometer2 me-2"></i>
                        ADMIN DASHBOARD
                    </small>

                    <h1 className="fw-bold text-white mt-2 mb-2">
                        Welcome back, {user?.name || "Admin"} 👋
                    </h1>

                    <p className="text-secondary mb-0">
                        Manage users, food donations and delivery activities.
                    </p>
                </div>

                <div className="date-box">
                    <i className="bi bi-calendar3 me-2"></i>
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Statistics */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div
                        className="dashboard-card h-100 p-4"
                        onClick={() => navigate("/allUsers")}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="stat-icon users-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <i className="bi bi-arrow-up-right text-secondary"></i>
                        </div>

                        <p className="text-secondary mb-1">Total Users</p>
                        <h2 className="text-white fw-bold">{userList.length}</h2>
                        <small className="text-secondary">
                            Registered users
                        </small>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div
                        className="dashboard-card h-100 p-4"
                        onClick={() => navigate("/allfoods?status=Available")}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="stat-icon available-icon">
                                <i className="bi bi-basket"></i>
                            </div>

                            <i className="bi bi-arrow-up-right text-secondary"></i>
                        </div>

                        <p className="text-secondary mb-1">Available Food</p>
                        <h2 className="text-white fw-bold">
                            {availableFoods}
                        </h2>
                        <small className="text-secondary">
                            Waiting for acceptance
                        </small>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div
                        className="dashboard-card h-100 p-4"
                        onClick={() => navigate("/allfoods?status=Accepted")}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="stat-icon accepted-icon">
                                <i className="bi bi-check-circle"></i>
                            </div>

                            <i className="bi bi-arrow-up-right text-secondary"></i>
                        </div>

                        <p className="text-secondary mb-1">Accepted Orders</p>
                        <h2 className="text-white fw-bold">
                            {acceptedFoods}
                        </h2>
                        <small className="text-secondary">
                            Accepted by NGOs
                        </small>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div
                        className="dashboard-card h-100 p-4"
                        onClick={() =>
                            navigate("/allfoods?status=Out for Delivery")
                        }
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="stat-icon delivery-icon">
                                <i className="bi bi-truck"></i>
                            </div>

                            <i className="bi bi-arrow-up-right text-secondary"></i>
                        </div>

                        <p className="text-secondary mb-1">Out for Delivery</p>
                        <h2 className="text-white fw-bold">
                            {outForDeliveryFoods}
                        </h2>
                        <small className="text-secondary">
                            Currently being delivered
                        </small>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="dashboard-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="text-white mb-1">
                                    Food Distribution
                                </h4>

                                <p className="text-secondary mb-0">
                                    Current food donation status
                                </p>
                            </div>

                            <span className="total-count">
                                {foodList.length}
                            </span>
                        </div>

                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={4}
                                    >
                                        {chartData.map((item, index) => (
                                            <Cell
                                                key={item.name}
                                                fill={chartColors[index]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            background: "#171b1f",
                                            border: "1px solid #30363d",
                                            borderRadius: "10px",
                                        }}
                                    />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="dashboard-card p-4 h-100">
                        <h4 className="text-white mb-1">
                            Quick Overview
                        </h4>

                        <p className="text-secondary mb-4">
                            Food delivery progress
                        </p>

                        <div className="list-group list-group-flush">
                            <div className="overview-row">
                                <span>
                                    <i className="bi bi-check-circle me-2 text-success"></i>
                                    Delivered
                                </span>

                                <strong>{deliveredFoods}</strong>
                            </div>

                            <div className="overview-row">
                                <span>
                                    <i className="bi bi-check2-square me-2 text-warning"></i>
                                    Accepted
                                </span>

                                <strong>{acceptedFoods}</strong>
                            </div>

                            <div className="overview-row">
                                <span>
                                    <i className="bi bi-truck me-2 text-orange"></i>
                                    Out for Delivery
                                </span>

                                <strong>{outForDeliveryFoods}</strong>
                            </div>

                            <div className="overview-row">
                                <span>
                                    <i className="bi bi-basket me-2 text-success"></i>
                                    Available
                                </span>

                                <strong>{availableFoods}</strong>
                            </div>

                            <div className="overview-row">
                                <span>
                                    <i className="bi bi-clock me-2 text-danger"></i>
                                    Expired
                                </span>

                                <strong className="text-danger">
                                    {expiredFoods}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Food Table */}
            <div className="dashboard-card p-3 p-md-4 mt-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                    <div>
                        <h4 className="text-white mb-1">
                            Recently Added Food
                        </h4>

                        <p className="text-secondary mb-0">
                            Latest food donations
                        </p>
                    </div>

                    <button
                        className="btn btn-orange"
                        onClick={() => navigate("/allfoods")}
                    >
                        View All
                        <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table admin-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Restaurant</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedFood.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            {item.image?.url ? (
                                                <img
                                                    src={item.image.url}
                                                    alt={item.name}
                                                    className="food-image rounded"
                                                    style={{width:"100px", height:"100px", objectFit:"cover"}}
                                                />
                                            ) : (
                                                <div className="food-placeholder">
                                                    <i className="bi bi-basket"></i>
                                                </div>
                                            )}

                                            <div>
                                                <div className="fw-semibold text-white">
                                                    {item.name}
                                                </div>

                                                <small className="text-secondary">
                                                    {item.description?.slice(
                                                        0,
                                                        35
                                                    ) || "Food donation"}
                                                </small>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        {item.restaurant?.name || "N/A"}
                                    </td>

                                    <td>
                                        <span className="category-badge">
                                            {item.category?.name ||
                                                item.category ||
                                                "General"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge ${getStatusClass(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-light"
                                            onClick={() => {
                                                setSelectedFood(item);
                                                setPop(true);
                                            }}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <Footer />
    </div>
);
};