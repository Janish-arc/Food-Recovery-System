import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Plus,
    Star,
    Clock3,
    Store,
    Utensils,
    MoreVertical,
    Edit3,
    Trash2,
    Eye,
    SlidersHorizontal,
    CheckCircle2,
    XCircle,
    Layers3,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { GetAllFoods } from "../../Redux/FoodSlice";
import { GetRestaurant } from "../../Redux/RestaurantSlice";
import { GetCategory } from "../../Redux/CategorySlice";

import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";

export const AllFoods = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { food = [] } = useSelector((state) => state.food);
    const { restaurants = [] } = useSelector(
        (state) => state.restaurant
    );
    const { category = [] } = useSelector(
        (state) => state.category
    );

    const [search, setSearch] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] =
        useState("all");
    const [selectedCategory, setSelectedCategory] =
        useState("all");
    const [availability, setAvailability] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    useEffect(() => {
        dispatch(GetAllFoods());
        dispatch(GetRestaurant());
        dispatch(GetCategory());
    }, [dispatch]);

    const foodList = Array.isArray(food) ? food : [];
    const restaurantList = Array.isArray(restaurants)
        ? restaurants
        : [];
    const categoryList = Array.isArray(category)
        ? category
        : [];

    const availableFoods = foodList.filter(
        (item) => item.isAvailable
    );

    const unavailableFoods = foodList.filter(
        (item) => !item.isAvailable
    );

    const restaurantCount = new Set(
        foodList
            .map((item) => item.restaurant?._id)
            .filter(Boolean)
    ).size;

    const filteredFoods = useMemo(() => {
        let result = [...foodList];

        if (search.trim()) {
            const searchValue = search.toLowerCase().trim();

            result = result.filter((item) => {
                const searchableText = [
                    item.name,
                    item.description,
                    item.restaurant?.name,
                    item.category?.name,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(searchValue);
            });
        }

        if (selectedRestaurant !== "all") {
            result = result.filter(
                (item) =>
                    item.restaurant?._id === selectedRestaurant
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(
                (item) => item.category?._id === selectedCategory
            );
        }

        if (availability === "available") {
            result = result.filter((item) => item.isAvailable);
        }

        if (availability === "unavailable") {
            result = result.filter((item) => !item.isAvailable);
        }

        if (sortBy === "price-low") {
            result.sort(
                (a, b) =>
                    (Number(a.price) || 0) -
                    (Number(b.price) || 0)
            );
        }

        if (sortBy === "price-high") {
            result.sort(
                (a, b) =>
                    (Number(b.price) || 0) -
                    (Number(a.price) || 0)
            );
        }

        if (sortBy === "rating") {
            result.sort(
                (a, b) =>
                    (Number(b.rating) || 0) -
                    (Number(a.rating) || 0)
            );
        }

        if (sortBy === "oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.createdAt || 0) -
                    new Date(b.createdAt || 0)
            );
        }

        if (sortBy === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );
        }

        return result;
    }, [
        foodList,
        search,
        selectedRestaurant,
        selectedCategory,
        availability,
        sortBy,
    ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        selectedRestaurant,
        selectedCategory,
        availability,
        sortBy,
        itemsPerPage,
    ]);

    const totalPages = Math.ceil(
        filteredFoods.length / itemsPerPage
    );

    const currentFoods = filteredFoods.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearch("");
        setSelectedRestaurant("all");
        setSelectedCategory("all");
        setAvailability("all");
        setSortBy("newest");
    };

    const panelStyle = {
        background:
            "linear-gradient(145deg, #191c20 0%, #101214 100%)",
        border: "1px solid #292d32",
        borderRadius: "24px",
        color: "#ffffff",
    };

    const inputStyle = {
        backgroundColor: "#111417",
        color: "#ffffff",
        border: "1px solid #30353b",
        borderRadius: "14px",
    };

    const mutedText = {
        color: "#8d98a8",
    };

    const getAvailabilityStyle = (isAvailable) => ({
        color: isAvailable ? "#23c581" : "#ff6675",
        backgroundColor: isAvailable
            ? "rgba(35, 197, 129, 0.15)"
            : "rgba(255, 102, 117, 0.15)",
        border: isAvailable
            ? "1px solid rgba(35, 197, 129, 0.3)"
            : "1px solid rgba(255, 102, 117, 0.3)",
    });

    return (
        <div
            className="min-vh-100"
            style={{
                background:
                    "radial-gradient(circle at top left, #24140f 0%, #0b0b0d 38%, #090a0b 100%)",
            }}
        >
            <Navbar />

            <main className="container-fluid container-xl px-3 px-lg-4 py-4 text-white">
                {/* Header */}
                <section className="d-flex flex-wrap justify-content-between align-items-end gap-4 mb-4">
                    <div>
                        <div
                            className="d-flex align-items-center gap-2 fw-bold mb-3"
                            style={{
                                color: "#ff7a32",
                                letterSpacing: "3px",
                                fontSize: "13px",
                            }}
                        >
                            <Utensils size={17} />
                            ADMIN DASHBOARD
                        </div>

                        <h1
                            className="fw-bold mb-2"
                            style={{
                                fontSize: "clamp(30px, 4vw, 46px)",
                                letterSpacing: "-1.5px",
                            }}
                        >
                            Food Management
                        </h1>

                        <p className="mb-0" style={mutedText}>
                            Manage food items, availability and restaurant
                            menus.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn d-flex align-items-center gap-2 px-4 py-3"
                        onClick={() => navigate("/admin/addfood")}
                        style={{
                            backgroundColor: "#ff7130",
                            color: "#ffffff",
                            border: "1px solid #ff7130",
                            borderRadius: "16px",
                        }}
                    >
                        <Plus size={18} />
                        Add Food
                    </button>
                </section>

                {/* Statistics */}
                <section className="row g-3 mb-4">
                    <div className="col-6 col-xl-3">
                        <div className="p-4 h-100" style={panelStyle}>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "16px",
                                        backgroundColor:
                                            "rgba(67, 139, 255, 0.15)",
                                        color: "#438bff",
                                    }}
                                >
                                    <Utensils size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={mutedText}
                                >
                                    Total
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Total Foods
                            </p>

                            <h2 className="fw-bold mb-0">
                                {foodList.length}
                            </h2>
                        </div>
                    </div>

                    <div className="col-6 col-xl-3">
                        <div className="p-4 h-100" style={panelStyle}>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "16px",
                                        backgroundColor:
                                            "rgba(35, 197, 129, 0.15)",
                                        color: "#23c581",
                                    }}
                                >
                                    <CheckCircle2 size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={{ color: "#23c581" }}
                                >
                                    Active
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Available Foods
                            </p>

                            <h2 className="fw-bold mb-0">
                                {availableFoods.length}
                            </h2>
                        </div>
                    </div>

                    <div className="col-6 col-xl-3">
                        <div className="p-4 h-100" style={panelStyle}>
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "16px",
                                        backgroundColor:
                                            "rgba(255, 102, 117, 0.15)",
                                        color: "#ff6675",
                                    }}
                                >
                                    <XCircle size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={{ color: "#ff6675" }}
                                >
                                    Inactive
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Unavailable Foods
                            </p>

                            <h2 className="fw-bold mb-0">
                                {unavailableFoods.length}
                            </h2>
                        </div>
                    </div>

                    <div className="col-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={{
                                ...panelStyle,
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                navigate("/admin/allrestaurants")
                            }
                        >
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "16px",
                                        backgroundColor:
                                            "rgba(255, 193, 7, 0.15)",
                                        color: "#ffc107",
                                    }}
                                >
                                    <Store size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={mutedText}
                                >
                                    Linked
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Restaurants
                            </p>

                            <h2 className="fw-bold mb-0">
                                {restaurantCount}
                            </h2>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section className="p-4 mb-4" style={panelStyle}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <SlidersHorizontal
                            size={19}
                            style={{ color: "#ff7a32" }}
                        />

                        <h5 className="fw-bold mb-0">
                            Food Filters
                        </h5>
                    </div>

                    <div className="row g-3">
                        <div className="col-12 col-lg-5">
                            <div className="position-relative">
                                <Search
                                    size={18}
                                    className="position-absolute top-50 translate-middle-y"
                                    style={{
                                        left: "15px",
                                        color: "#8d98a8",
                                    }}
                                />

                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder="Search food or restaurant..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="col-6 col-lg-3">
                            <select
                                className="form-select"
                                value={selectedRestaurant}
                                onChange={(e) =>
                                    setSelectedRestaurant(e.target.value)
                                }
                                style={inputStyle}
                            >
                                <option value="all">
                                    All Restaurants
                                </option>

                                {restaurantList.map((restaurant) => (
                                    <option
                                        key={restaurant._id}
                                        value={restaurant._id}
                                    >
                                        {restaurant.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-6 col-lg-2">
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                style={inputStyle}
                            >
                                <option value="all">
                                    All Categories
                                </option>

                                {categoryList.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-6 col-lg-2">
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value)
                                }
                                style={inputStyle}
                            >
                                <option value="newest">
                                    Newest
                                </option>
                                <option value="oldest">
                                    Oldest
                                </option>
                                <option value="price-low">
                                    Price: Low to High
                                </option>
                                <option value="price-high">
                                    Price: High to Low
                                </option>
                                <option value="rating">
                                    Highest Rated
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                type="button"
                                className="btn btn-sm rounded-pill px-3"
                                onClick={() => setAvailability("all")}
                                style={{
                                    backgroundColor:
                                        availability === "all"
                                            ? "#ff7130"
                                            : "#252a30",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                }}
                            >
                                All Foods
                            </button>

                            <button
                                type="button"
                                className="btn btn-sm rounded-pill px-3"
                                onClick={() =>
                                    setAvailability("available")
                                }
                                style={{
                                    backgroundColor:
                                        availability === "available"
                                            ? "#23c581"
                                            : "#252a30",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                }}
                            >
                                Available
                            </button>

                            <button
                                type="button"
                                className="btn btn-sm rounded-pill px-3"
                                onClick={() =>
                                    setAvailability("unavailable")
                                }
                                style={{
                                    backgroundColor:
                                        availability === "unavailable"
                                            ? "#ff6675"
                                            : "#252a30",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                }}
                            >
                                Unavailable
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <small style={mutedText}>
                                {filteredFoods.length} foods found
                            </small>

                            {(search ||
                                selectedRestaurant !== "all" ||
                                selectedCategory !== "all" ||
                                availability !== "all" ||
                                sortBy !== "newest") && (
                                <button
                                    type="button"
                                    className="btn btn-sm rounded-pill px-3"
                                    onClick={clearFilters}
                                    style={{
                                        backgroundColor:
                                            "rgba(255, 122, 50, 0.15)",
                                        color: "#ff7a32",
                                        border: "1px solid rgba(255, 122, 50, 0.3)",
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Food Cards */}
                <section className="row g-4 mb-4">
                    {currentFoods.length > 0 ? (
                        currentFoods.map((item) => (
                            <div
                                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                key={item._id}
                            >
                                <div
                                    className="h-100 overflow-hidden"
                                    style={panelStyle}
                                >
                                    <div
                                        className="position-relative"
                                        style={{
                                            height: "205px",
                                            backgroundColor: "#20242a",
                                        }}
                                    >
                                        {item.image?.url ? (
                                            <img
                                                src={item.image.url}
                                                alt={item.name}
                                                className="w-100 h-100"
                                                style={{
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100">
                                                <Utensils
                                                    size={55}
                                                    style={{
                                                        color: "#66717f",
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="position-absolute top-0 end-0 m-3">
                                            <span
                                                className="px-3 py-2 rounded-pill small fw-semibold"
                                                style={getAvailabilityStyle(
                                                    item.isAvailable
                                                )}
                                            >
                                                {item.isAvailable
                                                    ? "● Available"
                                                    : "● Unavailable"}
                                            </span>
                                        </div>

                                        <div
                                            className="position-absolute bottom-0 start-0 end-0 px-3 py-3"
                                            style={{
                                                background:
                                                    "linear-gradient(transparent, rgba(0,0,0,0.85))",
                                            }}
                                        >
                                            <span
                                                className="fw-bold"
                                                style={{
                                                    color: "#ffffff",
                                                    fontSize: "20px",
                                                }}
                                            >
                                                ₹{item.price || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                            <div className="min-width-0">
                                                <h5
                                                    className="fw-bold mb-2 text-truncate"
                                                    title={item.name}
                                                >
                                                    {item.name}
                                                </h5>

                                                <span
                                                    className="px-2 py-1 rounded-pill small"
                                                    style={{
                                                        color: "#ffb27d",
                                                        backgroundColor:
                                                            "rgba(255, 122, 50, 0.12)",
                                                        border: "1px solid rgba(255, 122, 50, 0.25)",
                                                    }}
                                                >
                                                    {item.category?.name ||
                                                        "Uncategorized"}
                                                </span>
                                            </div>

                                            <div className="dropdown">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm rounded-3"
                                                    data-bs-toggle="dropdown"
                                                    style={{
                                                        backgroundColor:
                                                            "#252a30",
                                                        color: "#ffffff",
                                                        border: "1px solid #30353b",
                                                    }}
                                                >
                                                    <MoreVertical size={17} />
                                                </button>

                                                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item d-flex align-items-center gap-2"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/food/${item._id}`
                                                                )
                                                            }
                                                        >
                                                            <Eye size={16} />
                                                            View Food
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item d-flex align-items-center gap-2"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/food/edit/${item._id}`
                                                                )
                                                            }
                                                        >
                                                            <Edit3 size={16} />
                                                            Edit Food
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>

                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item text-danger d-flex align-items-center gap-2"
                                                            onClick={() =>
                                                                console.log(
                                                                    "Delete food:",
                                                                    item._id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Food
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div
                                            className="d-flex align-items-center gap-2 mb-3"
                                            style={mutedText}
                                        >
                                            <Store size={16} />

                                            <small className="text-truncate">
                                                {item.restaurant?.name ||
                                                    "Unknown Restaurant"}
                                            </small>
                                        </div>

                                        <div
                                            className="d-flex align-items-center justify-content-between pt-3"
                                            style={{
                                                borderTop:
                                                    "1px solid #2a2f35",
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-1">
                                                <Star
                                                    size={16}
                                                    fill="#ffc107"
                                                    color="#ffc107"
                                                />

                                                <small className="fw-semibold">
                                                    {Number(
                                                        item.rating || 0
                                                    ).toFixed(1)}
                                                </small>
                                            </div>

                                            <div
                                                className="d-flex align-items-center gap-1"
                                                style={mutedText}
                                            >
                                                <Clock3 size={15} />

                                                <small>
                                                    {item.preparedTime || "--"}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div
                                className="text-center p-5"
                                style={panelStyle}
                            >
                                <div
                                    className="d-flex align-items-center justify-content-center mx-auto mb-4"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "24px",
                                        backgroundColor:
                                            "rgba(255, 122, 50, 0.15)",
                                        color: "#ff7a32",
                                    }}
                                >
                                    <Utensils size={35} />
                                </div>

                                <h4 className="fw-bold mb-2">
                                    No Foods Found
                                </h4>

                                <p className="mb-4" style={mutedText}>
                                    No food items match your current filters.
                                </p>

                                <button
                                    type="button"
                                    className="btn rounded-pill px-4"
                                    onClick={clearFilters}
                                    style={{
                                        backgroundColor: "#ff7130",
                                        color: "#ffffff",
                                        border: "1px solid #ff7130",
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                        <small style={mutedText}>
                            Showing{" "}
                            {(currentPage - 1) * itemsPerPage + 1}–
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredFoods.length
                            )}{" "}
                            of {filteredFoods.length} foods
                        </small>

                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="btn rounded-3"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(page - 1, 1)
                                    )
                                }
                                style={{
                                    backgroundColor: "#191c20",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                }}
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            )
                                .slice(
                                    Math.max(0, currentPage - 3),
                                    Math.min(totalPages, currentPage + 2)
                                )
                                .map((page) => (
                                    <button
                                        type="button"
                                        key={page}
                                        className="btn rounded-3"
                                        onClick={() =>
                                            setCurrentPage(page)
                                        }
                                        style={{
                                            backgroundColor:
                                                currentPage === page
                                                    ? "#ff7130"
                                                    : "#191c20",
                                            color: "#ffffff",
                                            border: "1px solid #30353b",
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}

                            <button
                                type="button"
                                className="btn rounded-3"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(page + 1, totalPages)
                                    )
                                }
                                style={{
                                    backgroundColor: "#191c20",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};