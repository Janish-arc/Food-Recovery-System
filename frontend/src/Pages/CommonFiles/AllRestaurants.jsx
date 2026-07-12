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

    // ---- render ----
    // return (
    //     <div className="home fd-page">
    //     <Navbar />

    //     <div className="py-5 border-bottom border-1">
    //         <div className="container">
    //             <span className="rounded-pill bg-white shadow p-2 d-inline-flex gap-1 align-items-center" style={{fontSize:"13px", fontWeight: 500, color:"#C2402C"}}>
    //                 <Flame size={14} />
    //                 Handpicked for your cravings
    //             </span>
    //             <h1 className="fd-headline mt-4">
    //                 Find your next <em>favorite</em> meal.
    //             </h1>

    //             <div className="fd-search-bar">
    //                 <Search size={19} className="fd-search-icon" />
    //                 <input
    //                     className="fd-search-input"
    //                     placeholder="Search by restaurant name..."
    //                     value={search}
    //                     onChange={(e) => setSearch(e.target.value)}
    //                 />
    //                 {search && (
    //                     <button className="fd-clear-btn" onClick={() => setSearch("")} aria-label="Clear search">
    //                         <X size={16} />
    //                     </button>
    //                 )}
    //             </div>
    //         </div>
    //     </div>

    //     <div className="container py-4">

    //         <div className="fd-toolbar mb-4">

    //             <div className="fd-chip-rail">
    //                 <button
    //                     className={`fd-cat-pill ${selectedCategory === "All" ? "active" : ""}`}
    //                     onClick={() => setSelectedCategory("All")}
    //                 >
    //                     All
    //                 </button>
    //                 {category?.map((item) => {
    //                     const c = colorForString(item.name);
    //                     const active = selectedCategory === item.name;
    //                     return (
    //                         <button
    //                             key={item._id}
    //                             className={`fd-cat-pill ${active ? "active" : ""}`}
    //                             style={active ? { background: c.text, color: "#fff", borderColor: c.text } : { color: c.text, borderColor: c.bg }}
    //                             onClick={() => setSelectedCategory(item.name)}
    //                         >
    //                             {item.name}
    //                         </button>
    //                     );
    //                 })}
    //             </div>

    //             <select
    //                 className="fd-sort-select"
    //                 value={sort}
    //                 onChange={(e) => setSort(e.target.value)}
    //             >
    //                 <option value="default">Sort: Default</option>
    //                 <option value="rating">Sort: Top Rated</option>
    //                 <option value="new">Sort: Newest</option>
    //                 <option value="az">Sort: A-Z</option>
    //             </select>

    //         </div>

    //         <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
    //             <h5 className="fw-bold mb-0 me-1 fd-count">
    //                 {isLoading ? "Loading restaurants..." : `${filteredRestaurants.length} restaurants`}
    //             </h5>

    //             {hasActiveFilters && !isLoading && (
    //                 <button
    //                     className="fd-clear-all"
    //                     onClick={() => { setSearch(""); setSelectedCategory("All"); setSort("default"); }}
    //                 >
    //                     Clear filters
    //                     <X size={13} />
    //                 </button>
    //             )}
    //         </div>

    //         <div className="row g-4">

    //             {isLoading ? (

    //                 [...Array(8)].map((_, index) => (
    //                     <div className="col-12 col-sm-6 col-lg-3" key={index}>
    //                         <div className="fd-card fd-skeleton">
    //                             <div className="fd-skel-img" />
    //                             <div className="fd-card-body">
    //                                 <div className="fd-skel-line w-75 mb-2" />
    //                                 <div className="fd-skel-line w-100" />
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))

    //             ) : currentRestaurants.length > 0 ? (

    //                 currentRestaurants.map((item) => {
    //                     const tagCategory = item.foods?.[0]?.category?.name;
    //                     const tag = tagCategory ? colorForString(tagCategory) : null;

    //                     return (
    //                         <div className="col-12 col-sm-6 col-lg-3" key={item._id}>
    //                             <div
    //                                 className="fd-card"
    //                                 onClick={() => navigate(`/restaurantdetails/${item._id}`)}
    //                             >
    //                                 <div className="fd-img-wrap">
    //                                     <img src={item.banner.url} alt={item.name} className="fd-img" />
    //                                     <div className="fd-img-scrim" />

    //                                     {tag && (
    //                                         <span
    //                                             className="fd-tag"
    //                                             style={{ background: tag.bg, color: tag.text }}
    //                                         >
    //                                             {tagCategory}
    //                                         </span>
    //                                     )}

    //                                     <span className="fd-rating">
    //                                         <Star size={12} fill="currentColor" strokeWidth={0} />
    //                                         {item.rating}
    //                                     </span>

    //                                     <div className="fd-name-overlay">
    //                                         <h5 className="fd-rest-name">{item.name}</h5>
    //                                         <p className="fd-rest-foods">
    //                                             {item.foods?.slice(0, 3).map(food => food.name).join(" · ")}
    //                                         </p>
    //                                     </div>
    //                                 </div>

    //                                 <div className="fd-card-body">
    //                                     <small className="d-flex align-items-center gap-1 text-muted">
    //                                         <Star size={13} />
    //                                         {item.totalReviews} reviews
    //                                     </small>
    //                                     <small className="d-flex align-items-center gap-1 text-muted">
    //                                         <Clock size={13} />
    //                                         {item.deliveryTime}
    //                                     </small>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     );
    //                 })

    //             ) : (

    //                 <div className="text-center py-5">
    //                     <div className="fd-empty-icon mx-auto mb-3">
    //                         <UtensilsCrossed size={38} strokeWidth={1.5} />
    //                     </div>
    //                     <h4 className="fw-bold">No restaurants found</h4>
    //                     <p className="text-muted mb-3">Try a different search term or clear your filters.</p>
    //                     {hasActiveFilters && (
    //                         <button
    //                             className="fd-clear-all-lg"
    //                             onClick={() => { setSearch(""); setSelectedCategory("All"); setSort("default"); }}
    //                         >
    //                             Clear all filters
    //                         </button>
    //                     )}
    //                 </div>

    //             )}

    //         </div>

    //         {!isLoading && totalPages > 1 && (
    //             <div className="d-flex justify-content-center mt-5">
    //                 <nav>
    //                     <ul className="pagination fd-pagination">
    //                         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
    //                             <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>
    //                                 <ChevronLeft size={16} />
    //                             </button>
    //                         </li>

    //                         {[...Array(totalPages)].map((_, index) => (
    //                             <li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
    //                                 <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
    //                                     {index + 1}
    //                                 </button>
    //                             </li>
    //                         ))}

    //                         <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
    //                             <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
    //                                 <ChevronRight size={16} />
    //                             </button>
    //                         </li>
    //                     </ul>
    //                 </nav>
    //             </div>
    //         )}

    //     </div>

    //     <Footer />

    //     <style>{`
    //         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    //         .fd-page {
    //             --ink: #2B241C;
    //             --cream: #FFF8EC;
    //             --clay: #E8503A;
    //             --clay-dark: #C2402C;
    //             font-family: 'Plus Jakarta Sans', sans-serif;

    //         }
    //         // .fd-eyebrow {
    //         //     display: inline-flex;
    //         //     align-items: center;
    //         //     gap: 6px;
    //         //     background: #fff;
    //         //     color: var(--clay-dark);
    //         //     font-size: 13px;
    //         //     font-weight: 600;
    //         //     padding: 6px 14px;
    //         //     border-radius: 20px;
    //         //     margin-bottom: 18px;
    //         //     box-shadow: 0 2px 8px rgba(43,36,28,0.06);
    //         // }
    //         .fd-headline {
    //             font-family: 'Fraunces', serif;
    //             font-weight: 600;
    //             font-size: clamp(2.2rem, 5vw, 3.4rem);
    //             line-height: 1.08;
    //             letter-spacing: -0.01em;
    //             margin-bottom: 28px;
    //         }
    //         .fd-headline em {
    //             color: var(--clay);
    //             font-style: italic;
    //         }

    //         .fd-search-bar {
    //             position: relative;
    //             max-width: 520px;
    //             background: #fff;
    //             border-radius: 16px;
    //             box-shadow: 0 6px 20px rgba(43,36,28,0.10);
    //             display: flex;
    //             align-items: center;
    //         }
    //         .fd-search-icon {
    //             position: absolute;
    //             left: 18px;
    //             color: #b8ab99;
    //         }
    //         .fd-search-input {
    //             width: 100%;
    //             border: none;
    //             background: transparent;
    //             padding: 16px 40px 16px 48px;
    //             font-size: 15px;
    //             font-family: inherit;
    //             border-radius: 16px;
    //         }
    //         .fd-search-input:focus {
    //             outline: none;
    //         }
    //         .fd-clear-btn {
    //             position: absolute;
    //             right: 14px;
    //             border: none;
    //             background: #f2ede3;
    //             color: #8a7d6a;
    //             border-radius: 50%;
    //             width: 26px;
    //             height: 26px;
    //             display: flex;
    //             align-items: center;
    //             justify-content: center;
    //         }

    //         .fd-toolbar {
    //             display: flex;
    //             align-items: center;
    //             justify-content: space-between;
    //             gap: 16px;
    //             flex-wrap: wrap;
    //         }
    //         .fd-chip-rail {
    //             display: flex;
    //             gap: 8px;
    //             overflow-x: auto;
    //             padding-bottom: 4px;
    //             scrollbar-width: none;
    //         }
    //         .fd-cat-pill {
    //             white-space: nowrap;
    //             border: 1.5px solid #eee;
    //             background: #fff;
    //             color: var(--ink);
    //             font-size: 13px;
    //             font-weight: 600;
    //             padding: 8px 16px;
    //             border-radius: 20px;
    //             transition: all 0.15s ease;
    //             flex-shrink: 0;
    //         }
    //         .fd-cat-pill.active {
    //             background: var(--ink);
    //             color: #fff;
    //             border-color: var(--ink);
    //         }
    //         .fd-sort-select {
    //             border: 1.5px solid #eee;
    //             border-radius: 20px;
    //             padding: 8px 16px;
    //             font-size: 13px;
    //             font-weight: 600;
    //             background: #fff;
    //             color: var(--ink);
    //             flex-shrink: 0;
    //         }

    //         .fd-count {
    //             font-family: 'Fraunces', serif;
    //             font-weight: 600;
    //             font-size: 1.3rem;
    //         }
    //         .fd-clear-all, .fd-clear-all-lg {
    //             display: inline-flex;
    //             align-items: center;
    //             gap: 4px;
    //             border: none;
    //             background: #fff;
    //             color: var(--clay-dark);
    //             font-size: 13px;
    //             font-weight: 600;
    //             padding: 6px 12px;
    //             border-radius: 16px;
    //         }
    //         .fd-clear-all-lg {
    //             padding: 10px 22px;
    //             border-radius: 24px;
    //         }

    //         .fd-card {
    //             cursor: pointer;
    //             border-radius: 20px;
    //             overflow: hidden;
    //             background: #fff;
    //             box-shadow: 0 3px 14px rgba(43,36,28,0.07);
    //             transition: transform 0.25s ease, box-shadow 0.25s ease;
    //             height: 100%;
    //         }
    //         .fd-card:hover {
    //             transform: translateY(-6px);
    //             box-shadow: 0 16px 32px rgba(43,36,28,0.16);
    //         }
    //         .fd-img-wrap {
    //             position: relative;
    //             height: 230px;
    //             overflow: hidden;
    //         }
    //         .fd-img {
    //             width: 100%;
    //             height: 100%;
    //             object-fit: cover;
    //             transition: transform 0.45s ease;
    //         }
    //         .fd-card:hover .fd-img {
    //             transform: scale(1.09);
    //         }
    //         .fd-img-scrim {
    //             position: absolute;
    //             inset: 0;
    //             background: linear-gradient(to top, rgba(20,15,10,0.85) 0%, rgba(20,15,10,0.15) 45%, transparent 65%);
    //         }
    //         .fd-tag {
    //             position: absolute;
    //             top: 14px;
    //             left: 14px;
    //             font-size: 11px;
    //             font-weight: 700;
    //             padding: 4px 10px;
    //             border-radius: 12px;
    //         }
    //         .fd-rating {
    //             position: absolute;
    //             top: 14px;
    //             right: 14px;
    //             display: flex;
    //             align-items: center;
    //             gap: 4px;
    //             background: rgba(255,255,255,0.95);
    //             color: var(--clay-dark);
    //             font-weight: 700;
    //             font-size: 12px;
    //             padding: 4px 9px;
    //             border-radius: 12px;
    //         }
    //         .fd-name-overlay {
    //             position: absolute;
    //             bottom: 0;
    //             left: 0;
    //             right: 0;
    //             padding: 14px 16px 12px;
    //         }
    //         .fd-rest-name {
    //             color: #fff;
    //             font-weight: 700;
    //             font-size: 1.08rem;
    //             margin-bottom: 2px;
    //             text-shadow: 0 1px 4px rgba(0,0,0,0.3);
    //         }
    //         .fd-rest-foods {
    //             color: rgba(255,255,255,0.85);
    //             font-size: 12px;
    //             margin: 0;
    //             white-space: nowrap;
    //             overflow: hidden;
    //             text-overflow: ellipsis;
    //         }
    //         .fd-card-body {
    //             padding: 12px 16px 14px;
    //             display: flex;
    //             justify-content: space-between;
    //             align-items: center;
    //         }

    //         .fd-skeleton .fd-skel-img {
    //             height: 230px;
    //             background: linear-gradient(90deg, #f1ece1 25%, #e6dfd0 37%, #f1ece1 63%);
    //             background-size: 400% 100%;
    //             animation: fd-shimmer 1.4s ease infinite;
    //         }
    //         .fd-skel-line {
    //             height: 12px;
    //             border-radius: 6px;
    //             background: linear-gradient(90deg, #f1ece1 25%, #e6dfd0 37%, #f1ece1 63%);
    //             background-size: 400% 100%;
    //             animation: fd-shimmer 1.4s ease infinite;
    //         }
    //         @keyframes fd-shimmer {
    //             0% { background-position: 100% 0; }
    //             100% { background-position: -100% 0; }
    //         }

    //         .fd-empty-icon {
    //             width: 84px;
    //             height: 84px;
    //             border-radius: 50%;
    //             background: #FDE8D8;
    //             color: var(--clay-dark);
    //             display: flex;
    //             align-items: center;
    //             justify-content: center;
    //         }

    //         .fd-pagination .page-link {
    //             border: none;
    //             background: #fff;
    //             color: var(--ink);
    //             border-radius: 10px;
    //             margin: 0 3px;
    //             font-weight: 600;
    //         }
    //         .fd-pagination .page-item.active .page-link {
    //             background: var(--ink);
    //             color: #fff;
    //         }
    //         .fd-pagination .page-item.disabled .page-link {
    //             color: #c9beac;
    //         }
    //     `}</style>

    //     </div>
    // )

    return (
<div className="home">
    <Navbar />

    {/* Hero */}
    <section className="py-5 border-bottom">
        <div className="container">

            <span
                className="badge rounded-pill bg-white text-danger shadow-sm px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
            >
                <Flame size={14}/>
                Handpicked for your cravings
            </span>

            <h1
                className="display-4 fw-bold mt-4 mb-4"
                style={{fontFamily:"'Fraunces', serif"}}>
                Find your next{" "}
                <span className="text-danger">
                    <em>favorite</em>
                </span>{" "}
                meal.
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
                            className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 rounded-pill"
                        >
                            {item.foods?.[0]?.category?.name}
                        </span>

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

                            <small className="text-white-50">

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