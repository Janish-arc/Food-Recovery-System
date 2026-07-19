import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetRestaurant } from "../../Redux/RestaurantSlice";
import { GetCategory } from "../../Redux/CategorySlice";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, X, ChevronLeft, ChevronRight, UtensilsCrossed, Flame } from "lucide-react";

export const AllRestaurants = () => {

    // ---- helpers / constants ----
    const TAG_COLORS = [
        { bg: "#FDE8D8", text: "#C2542A" }, // clay
        { bg: "#E1EEE0", text: "#2F6F4E" }, // basil
        { bg: "#FBEBB5", text: "#966B08" }, // mango
        { bg: "#E5E4F5", text: "#5B4E9C" }, // plum
        { bg: "#DCEEF2", text: "#1F7A8C" }, // teal
    ];

    const colorForString = (str = "") => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
    };

    const sortLabels = {
        rating: "Top Rated",
        new: "Newest",
        az: "A-Z"
    };

    // ---- hooks ----
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { restaurants } = useSelector((state) => state.restaurant);
    const { category } = useSelector((state) => state.category);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sort, setSort] = useState("default");
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const restaurantsPerPage = 8;

    useEffect(() => {
        dispatch(GetRestaurant());
        dispatch(GetCategory());
    }, [dispatch]);

    useEffect(() => {
        if (restaurants) setIsLoading(false);
    }, [restaurants]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory, sort]);

    const filteredRestaurants = useMemo(() => {

        let data = [...(restaurants || [])];

        if (search.trim()) {
            data = data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            data = data.filter((item) =>
                item.foods?.some(
                    (food) => food.category?.name === selectedCategory
                )
            );
        }

        switch (sort) {
            case "rating":
                data.sort((a, b) => b.rating - a.rating);
                break;
            case "new":
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "az":
                data.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        return data;

    }, [restaurants, search, selectedCategory, sort]);

    const lastRestaurant = currentPage * restaurantsPerPage;
    const firstRestaurant = lastRestaurant - restaurantsPerPage;
    const currentRestaurants = filteredRestaurants.slice(firstRestaurant, lastRestaurant);
    const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);
    const hasActiveFilters = search.trim() || selectedCategory !== "All" || sort !== "default";

    return (
<div className="home">
    <Navbar />

    {/* Hero */}
    <section className="py-5 border-bottom">
        <div className="container">
            <span className="badge rounded-pill bg-white text-danger shadow-sm px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold">
                <Flame size={14}/>
                Handpicked for your cravings
            </span>
            <h1
                className="display-4 fw-bold mt-4 mb-4"
                style={{fontFamily:"'Fraunces', serif"}}>
                Find your next{" "}
                <span className="text-danger">
                    <em>favorite</em>
                </span>{" "}meal.
            </h1>
            <div className="d-flex align-items-center gap-2 mt-4">

    {/* Search */}
    <div
        className="position-relative flex-grow-1"
        style={{ maxWidth: "650px" }}
    >
        <Search
            size={16}
            className="position-absolute text-secondary"
            style={{
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)"
            }}
        />

        <input
            className="form-control rounded-pill shadow-sm border-0 ps-5 pe-5"
            style={{ height: "42px", fontSize: "14px" }}
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
            <button
                className="btn btn-light rounded-circle position-absolute d-flex justify-content-center align-items-center p-0"
                style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "24px",
                    height: "24px"
                }}
                onClick={() => setSearch("")}
            >
                <X size={13} />
            </button>
        )}
    </div>

    {/* Sort */}
    <select
        className="form-select rounded-pill shadow-sm flex-shrink-0"
        style={{
            width: "160px",
            height: "42px",
            fontSize: "14px"
        }}
        value={sort}
        onChange={(e) => setSort(e.target.value)}
    >
        <option value="default">Default</option>
        <option value="rating">⭐ Top Rated</option>
        <option value="new">🆕 Newest</option>
        <option value="az">🔤 A-Z</option>
    </select>

</div>

        </div>
    </section>

    {/* Toolbar */}

    <div className="container py-4">

        

        <div className="d-flex justify-content-between align-items-center mb-4">

            <h4
                className="fw-bold mb-0"
                style={{
                    fontFamily:"Fraunces"
                }}
            >

                {
                    isLoading
                    ? "Loading..."
                    : `${filteredRestaurants.length} Restaurants`
                }

            </h4>

            {
                hasActiveFilters &&

                <button
                    className="btn btn-outline-danger rounded-pill"
                    onClick={()=>{
                        setSearch("")
                        setSelectedCategory("All")
                        setSort("default")
                    }}
                >
                    Clear Filters
                </button>

            }

        </div>

        {/* Restaurant Cards Starts Here */}
        <div className="row g-4">

    {isLoading ? (

        [...Array(8)].map((_, index) => (

            <div className="col-12 col-sm-6 col-lg-3" key={index}>

                <div className="card border-0 shadow h-100 placeholder-glow">

                    <div
                        className="placeholder w-100"
                        style={{
                            height: "220px"
                        }}
                    ></div>

                    <div className="card-body">

                        <span className="placeholder col-8 mb-2"></span>

                        <span className="placeholder col-12"></span>

                        <span className="placeholder col-6 mt-3"></span>

                    </div>

                </div>

            </div>

        ))

    ) : currentRestaurants.length > 0 ? (

        currentRestaurants.map((item) => (

            <div
                className="col-6 col-lg-3"
                key={item._id}
            >

                <div
                    className="card border-0 shadow h-100 overflow-hidden"
                    style={{
                        cursor: "pointer",
                        borderRadius: "18px",
                        transition: ".3s"
                    }}
                    onClick={() =>
                        navigate(`/restaurantdetails/${item._id}`)
                    }
                >

                    <div className="position-relative overflow-hidden">

                        <img
                            src={item.banner.url}
                            alt={item.name}
                            className="card-img-top"
                            style={{
                                height: "230px",
                                objectFit: "cover"
                            }}
                        />
                        <span
                            className="badge bg-light text-dark position-absolute top-0 end-0 m-3 rounded-pill d-flex align-items-center gap-1"
                        >
                            <Star
                                size={13}
                                fill="currentColor"
                                strokeWidth={0}
                            />
                            {item.rating}
                        </span>

                        <div
                            className="position-absolute bottom-0 start-0 end-0 text-white p-3"
                            style={{
                                background:
                                    "linear-gradient(to top,rgba(0,0,0,.8),transparent)"
                            }}
                        >

                            <h5 className="fw-bold mb-1 text-truncate">

                                {item.name}

                            </h5>

                            <small className="text-white-75">

                                {
                                    item.foods
                                        ?.slice(0,3)
                                        .map(food=>food.name)
                                        .join(" • ")
                                }

                            </small>

                        </div>

                    </div>

                    <div className="card-body d-flex justify-content-between">

                        <small className="text-muted d-flex align-items-center gap-1">

                            <Star size={14}/>

                            {item.totalReviews} Reviews

                        </small>

                        <small className="text-muted d-flex align-items-center gap-1">

                            <Clock size={14}/>

                            {item.deliveryTime}

                        </small>

                    </div>

                </div>

            </div>

        ))

    ) : (

        <div className="col-12">

            <div className="text-center py-5">

                <div
                    className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                    style={{
                        width: "90px",
                        height: "90px"
                    }}
                >

                    <UtensilsCrossed
                        size={40}
                    />

                </div>

                <h3 className="fw-bold">

                    No Restaurants Found

                </h3>

                <p className="text-muted">

                    Try another search or category.

                </p>

                {
                    hasActiveFilters &&

                    <button
                        className="btn btn-danger rounded-pill px-4"
                        onClick={()=>{
                            setSearch("")
                            setSelectedCategory("All")
                            setSort("default")
                        }}
                    >

                        Clear Filters

                    </button>

                }

            </div>

        </div>

    )}

</div>
            {/* Pagination */}

{
    !isLoading && totalPages > 1 && (

        <div className="d-flex justify-content-center mt-5">

            <nav>

                <ul className="pagination shadow-sm rounded">

                    <li
                        className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link border-0"
                            onClick={() =>
                                setCurrentPage((prev) => prev - 1)
                            }
                        >
                            <ChevronLeft size={18} />
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (

                        <li
                            key={index}
                            className={`page-item ${
                                currentPage === index + 1
                                    ? "active"
                                    : ""
                            }`}
                        >

                            <button
                                className="page-link border-0"
                                onClick={() =>
                                    setCurrentPage(index + 1)
                                }
                            >
                                {index + 1}
                            </button>

                        </li>

                    ))}

                    <li
                        className={`page-item ${
                            currentPage === totalPages
                                ? "disabled"
                                : ""
                        }`}
                    >
                        <button
                            className="page-link border-0"
                            onClick={() =>
                                setCurrentPage((prev) => prev + 1)
                            }
                        >
                            <ChevronRight size={18} />
                        </button>
                    </li>

                </ul>

            </nav>

        </div>

    )
}

</div>

<Footer />

</div>

)
}