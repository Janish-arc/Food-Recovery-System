// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Plus,
//   MoreVertical,
//   Star,
//   MapPin,
//   Phone,
//   Clock,
//   Pencil,
//   Trash2,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   Store,
//   Mail,
//   IndianRupee,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { GetRestaurant } from "../../Redux/RestaurantSlice";
// import { Navbar } from "../../Components/Navbar";
// import { Footer } from "../../Components/Footer";
// import { useNavigate } from "react-router-dom";

// export const AdminRestaurants = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { restaurants = [] } = useSelector((state) => state.restaurant);

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("All");
//   const [rating, setRating] = useState("All");
//   const [sort, setSort] = useState("Newest");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   useEffect(() => {
//     dispatch(GetRestaurant());
//   }, [dispatch]);

//   const totalRestaurants = restaurants.length;

//   const openRestaurants = restaurants.filter(
//     (restaurant) => restaurant.isOpen === true
//   ).length;

//   const closedRestaurants = restaurants.filter(
//     (restaurant) => restaurant.isOpen === false
//   ).length;

//   const averageRating =
//     totalRestaurants > 0
//       ? (
//           restaurants.reduce(
//             (total, restaurant) => total + (restaurant.rating || 0),
//             0
//           ) / totalRestaurants
//         ).toFixed(1)
//       : "0.0";

//   const filteredRestaurants = useMemo(() => {
//     let result = [...restaurants];

//     if (search.trim()) {
//       const searchValue = search.toLowerCase().trim();

//       result = result.filter((restaurant) => {
//         const searchableText = [
//           restaurant.name,
//           restaurant.description,
//           restaurant.email,
//           restaurant.phone,
//           restaurant.address,
//           restaurant.city,
//           restaurant.state,
//           restaurant.pincode,
//           restaurant.location,
//           restaurant.owner?.name,
//           restaurant.owner?.email,
//           restaurant.owner?.phoneNo,
//         ]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase();

//         return searchableText.includes(searchValue);
//       });
//     }

//     if (status === "Open") {
//       result = result.filter((restaurant) => restaurant.isOpen === true);
//     }

//     if (status === "Closed") {
//       result = result.filter((restaurant) => restaurant.isOpen === false);
//     }

//     if (rating === "4+") {
//       result = result.filter((restaurant) => (restaurant.rating || 0) >= 4);
//     }

//     if (rating === "3+") {
//       result = result.filter((restaurant) => (restaurant.rating || 0) >= 3);
//     }

//     if (rating === "2+") {
//       result = result.filter((restaurant) => (restaurant.rating || 0) >= 2);
//     }

//     if (sort === "Newest") {
//       result.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//     }

//     if (sort === "Oldest") {
//       result.sort(
//         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//       );
//     }

//     if (sort === "Highest Rated") {
//       result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//     }

//     if (sort === "Lowest Rated") {
//       result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
//     }

//     return result;
//   }, [restaurants, search, status, rating, sort]);

//   const totalPages = Math.ceil(
//     filteredRestaurants.length / itemsPerPage
//   );

//   const paginatedRestaurants = filteredRestaurants.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, status, rating, sort, itemsPerPage]);

//   const startItem =
//     filteredRestaurants.length === 0
//       ? 0
//       : (currentPage - 1) * itemsPerPage + 1;

//   const endItem = Math.min(
//     currentPage * itemsPerPage,
//     filteredRestaurants.length
//   );

//   return (
//     <>
//     <Navbar/>
//     <div className="container-fluid bg-light min-vh-100 px-3 px-md-4 py-4">
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
//         <div>
//           <h3 className="fw-bold mb-1">All Restaurants</h3>
//           <p className="text-secondary mb-0">
//             Manage restaurants, owners and availability
//           </p>
//         </div>

//         <button className="btn btn-dark rounded-3 px-4 d-flex align-items-center justify-content-center gap-2">
//           <Plus size={18} />
//           Add Restaurant
//         </button>
//       </div>

//       <div className="row g-3 mb-4">
//         <div className="col-6 col-xl-3">
//           <div className="bg-white rounded-4 shadow-sm p-3 h-100">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-secondary small mb-1">
//                   Total Restaurants
//                 </div>
//                 <h3 className="fw-bold mb-0">{totalRestaurants}</h3>
//               </div>
//               <div
//                 className="rounded-3 p-2"
//                 style={{
//                   background: "#eef2ff",
//                   color: "#4f46e5",
//                 }}
//               >
//                 <Store size={21} />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-6 col-xl-3">
//           <div className="bg-white rounded-4 shadow-sm p-3 h-100">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-secondary small mb-1">
//                   Open Restaurants
//                 </div>
//                 <h3 className="fw-bold mb-0">{openRestaurants}</h3>
//               </div>
//               <div
//                 className="rounded-3 p-2"
//                 style={{
//                   background: "#ecfdf3",
//                   color: "#16a34a",
//                 }}
//               >
//                 <span
//                   className="d-block bg-success rounded-circle"
//                   style={{
//                     width: 11,
//                     height: 11,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-6 col-xl-3">
//           <div className="bg-white rounded-4 shadow-sm p-3 h-100">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-secondary small mb-1">
//                   Closed Restaurants
//                 </div>
//                 <h3 className="fw-bold mb-0">{closedRestaurants}</h3>
//               </div>
//               <div
//                 className="rounded-3 p-2"
//                 style={{
//                   background: "#fff1f2",
//                   color: "#e11d48",
//                 }}
//               >
//                 <Clock size={21} />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-6 col-xl-3">
//           <div className="bg-white rounded-4 shadow-sm p-3 h-100">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-secondary small mb-1">
//                   Average Rating
//                 </div>
//                 <h3 className="fw-bold mb-0">{averageRating}</h3>
//               </div>
//               <div
//                 className="rounded-3 p-2"
//                 style={{
//                   background: "#fffbeb",
//                   color: "#f59e0b",
//                 }}
//               >
//                 <Star size={21} fill="currentColor" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-4 shadow-sm overflow-hidden">
//         <div className="p-3 p-md-4 border-bottom">
//           <div className="row g-2">
//             <div className="col-12 col-md-5">
//               <div className="position-relative">
//                 <Search
//                   size={18}
//                   className="position-absolute text-secondary"
//                   style={{
//                     left: 14,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }}
//                 />
//                 <input
//                   type="text"
//                   className="form-control rounded-3 ps-5"
//                   placeholder="Search restaurant, owner, city..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="col-6 col-md-2">
//               <select
//                 className="form-select rounded-3"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option value="All">All Status</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>

//             <div className="col-6 col-md-2">
//               <select
//                 className="form-select rounded-3"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//               >
//                 <option value="All">All Ratings</option>
//                 <option value="4+">4+ Stars</option>
//                 <option value="3+">3+ Stars</option>
//                 <option value="2+">2+ Stars</option>
//               </select>
//             </div>

//             <div className="col-8 col-md-2">
//               <select
//                 className="form-select rounded-3"
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//               >
//                 <option value="Newest">Newest</option>
//                 <option value="Oldest">Oldest</option>
//                 <option value="Highest Rated">Highest Rated</option>
//                 <option value="Lowest Rated">Lowest Rated</option>
//               </select>
//             </div>

//             <div className="col-4 col-md-1">
//               <select
//                 className="form-select rounded-3"
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-secondary">
//                 <th className="ps-4 py-3 text-nowrap">RESTAURANT</th>
//                 <th className="text-nowrap">OWNER</th>
//                 <th className="text-nowrap">CONTACT</th>
//                 <th className="text-nowrap">LOCATION</th>
//                 <th className="text-nowrap">RATING</th>
//                 <th className="text-nowrap">DELIVERY</th>
//                 <th className="text-nowrap">STATUS</th>
//                 <th className="text-end pe-4 text-nowrap">ACTION</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedRestaurants.length > 0 ? (
//                 paginatedRestaurants.map((restaurant) => (
//                   <tr key={restaurant._id} onClick={() => navigate(`/admin/restaurant/${restaurant._id}`)}>
//                     <td className="ps-4">
//                       <div className="d-flex align-items-center gap-3">
//                         <img
//                           src={restaurant.banner?.url}
//                           alt={restaurant.name}
//                           className="rounded-3 flex-shrink-0"
//                           style={{
//                             width: 55,
//                             height: 55,
//                             objectFit: "cover",
//                           }}
//                         />
//                         <div>
//                           <div className="fw-semibold text-nowrap">
//                             {restaurant.name}
//                           </div>
//                           <div
//                             className="text-secondary small text-truncate"
//                             style={{ maxWidth: 180 }}
//                           >
//                             {restaurant.description}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td>
//                       <div className="fw-medium text-nowrap">
//                         {restaurant.owner?.name || "N/A"}
//                       </div>
//                       <div className="text-secondary small text-nowrap">
//                         Owner
//                       </div>
//                     </td>

//                     <td>
//                       <div className="small text-nowrap d-flex align-items-center gap-1">
//                         <Phone size={14} />
//                         {restaurant.phone}
//                       </div>
//                       <div className="small text-secondary text-nowrap d-flex align-items-center gap-1 mt-1">
//                         <Mail size={14} />
//                         {restaurant.email}
//                       </div>
//                     </td>

//                     <td>
//                       <div className="small d-flex align-items-start gap-1">
//                         <MapPin size={14} className="mt-1 flex-shrink-0" />
//                         <div>
//                           <div className="text-nowrap">
//                             {restaurant.city}, {restaurant.state}
//                           </div>
//                           <div className="text-secondary">
//                             {restaurant.pincode}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td>
//                       <div className="d-flex align-items-center gap-1">
//                         <Star
//                           size={16}
//                           fill="#f59e0b"
//                           color="#f59e0b"
//                         />
//                         <span className="fw-semibold">
//                           {(restaurant.rating || 0).toFixed(1)}
//                         </span>
//                       </div>
//                       <div className="small text-secondary text-nowrap">
//                         {restaurant.totalReviews || 0} reviews
//                       </div>
//                     </td>

//                     <td>
//                       <div className="fw-semibold small text-nowrap">
//                         {restaurant.deliveryTime}
//                       </div>
//                       <div className="small text-secondary d-flex align-items-center gap-1">
//                         <IndianRupee size={13} />
//                         {restaurant.deliveryFee}
//                       </div>
//                     </td>

//                     <td>
//                       <span
//                         className={`badge rounded-pill px-3 py-2 ${
//                           restaurant.isOpen
//                             ? "text-success bg-success-subtle"
//                             : "text-danger bg-danger-subtle"
//                         }`}
//                       >
//                         <span className="me-1">●</span>
//                         {restaurant.isOpen ? "Open" : "Closed"}
//                       </span>
//                     </td>

//                     <td className="text-end pe-4">
//                       <div className="dropdown">
//                         <button
//                           className="btn btn-light rounded-3"
//                           data-bs-toggle="dropdown"
//                           type="button"
//                         >
//                           <MoreVertical size={18} />
//                         </button>

//                         <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
//                           <li>
//                             <button className="dropdown-item d-flex align-items-center gap-2">
//                               <Eye size={16} />
//                               View Restaurant
//                             </button>
//                           </li>
//                           <li>
//                             <button className="dropdown-item d-flex align-items-center gap-2">
//                               <Pencil size={16} />
//                               Edit Restaurant
//                             </button>
//                           </li>
//                           <li>
//                             <hr className="dropdown-divider" />
//                           </li>
//                           <li>
//                             <button className="dropdown-item text-danger d-flex align-items-center gap-2">
//                               <Trash2 size={16} />
//                               Delete Restaurant
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-5">
//                     <Store
//                       size={42}
//                       className="text-secondary mb-3"
//                     />
//                     <h6 className="fw-semibold">
//                       No restaurants found
//                     </h6>
//                     <p className="text-secondary small mb-0">
//                       Try changing your search or filters.
//                     </p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="border-top p-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
//           <div className="small text-secondary">
//             Showing {startItem}–{endItem} of{" "}
//             {filteredRestaurants.length} restaurants
//           </div>

//           <div className="d-flex align-items-center gap-1">
//             <button
//               className="btn btn-light btn-sm rounded-3"
//               disabled={currentPage === 1}
//               onClick={() =>
//                 setCurrentPage((page) => Math.max(page - 1, 1))
//               }
//             >
//               <ChevronLeft size={17} />
//             </button>

//             {Array.from({ length: totalPages }, (_, index) => index + 1)
//               .slice(
//                 Math.max(0, currentPage - 3),
//                 Math.min(totalPages, currentPage + 2)
//               )
//               .map((page) => (
//                 <button
//                   key={page}
//                   className={`btn btn-sm rounded-3 ${
//                     currentPage === page
//                       ? "btn-dark"
//                       : "btn-light"
//                   }`}
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </button>
//               ))}

//             <button
//               className="btn btn-light btn-sm rounded-3"
//               disabled={currentPage === totalPages || totalPages === 0}
//               onClick={() =>
//                 setCurrentPage((page) =>
//                   Math.min(page + 1, totalPages)
//                 )
//               }
//             >
//               <ChevronRight size={17} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// };














import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Plus,
    MoreVertical,
    Star,
    MapPin,
    Phone,
    Clock,
    Pencil,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Store,
    Mail,
    IndianRupee,
    CheckCircle2,
    XCircle,
    SlidersHorizontal,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { GetRestaurant } from "../../Redux/RestaurantSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";

export const AdminRestaurants = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { restaurants = [] } = useSelector(
        (state) => state.restaurant
    );

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [rating, setRating] = useState("All");
    const [sort, setSort] = useState("Newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        dispatch(GetRestaurant());
    }, [dispatch]);

    const restaurantList = Array.isArray(restaurants)
        ? restaurants
        : [];

    const totalRestaurants = restaurantList.length;

    const openRestaurants = restaurantList.filter(
        (restaurant) => restaurant.isOpen === true
    ).length;

    const closedRestaurants = restaurantList.filter(
        (restaurant) => restaurant.isOpen === false
    ).length;

    const averageRating =
        totalRestaurants > 0
            ? (
                  restaurantList.reduce(
                      (total, restaurant) =>
                          total + (Number(restaurant.rating) || 0),
                      0
                  ) / totalRestaurants
              ).toFixed(1)
            : "0.0";

    const filteredRestaurants = useMemo(() => {
        let result = [...restaurantList];

        if (search.trim()) {
            const searchValue = search.toLowerCase().trim();

            result = result.filter((restaurant) => {
                const searchableText = [
                    restaurant.name,
                    restaurant.description,
                    restaurant.email,
                    restaurant.phone,
                    restaurant.address,
                    restaurant.city,
                    restaurant.state,
                    restaurant.pincode,
                    restaurant.location,
                    restaurant.owner?.name,
                    restaurant.owner?.email,
                    restaurant.owner?.phoneNo,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(searchValue);
            });
        }

        if (status === "Open") {
            result = result.filter(
                (restaurant) => restaurant.isOpen === true
            );
        }

        if (status === "Closed") {
            result = result.filter(
                (restaurant) => restaurant.isOpen === false
            );
        }

        if (rating === "4+") {
            result = result.filter(
                (restaurant) => (Number(restaurant.rating) || 0) >= 4
            );
        }

        if (rating === "3+") {
            result = result.filter(
                (restaurant) => (Number(restaurant.rating) || 0) >= 3
            );
        }

        if (rating === "2+") {
            result = result.filter(
                (restaurant) => (Number(restaurant.rating) || 0) >= 2
            );
        }

        if (sort === "Newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );
        }

        if (sort === "Oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.createdAt || 0) -
                    new Date(b.createdAt || 0)
            );
        }

        if (sort === "Highest Rated") {
            result.sort(
                (a, b) =>
                    (Number(b.rating) || 0) -
                    (Number(a.rating) || 0)
            );
        }

        if (sort === "Lowest Rated") {
            result.sort(
                (a, b) =>
                    (Number(a.rating) || 0) -
                    (Number(b.rating) || 0)
            );
        }

        return result;
    }, [restaurantList, search, status, rating, sort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, rating, sort, itemsPerPage]);

    const totalPages = Math.ceil(
        filteredRestaurants.length / itemsPerPage
    );

    const paginatedRestaurants = filteredRestaurants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const startItem =
        filteredRestaurants.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredRestaurants.length
    );

    const clearFilters = () => {
        setSearch("");
        setStatus("All");
        setRating("All");
        setSort("Newest");
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

    const iconBox = {
        width: "52px",
        height: "52px",
        borderRadius: "16px",
    };

    const getStatusStyle = (isOpen) => ({
        color: isOpen ? "#23c581" : "#ff6675",
        backgroundColor: isOpen
            ? "rgba(35, 197, 129, 0.15)"
            : "rgba(255, 102, 117, 0.15)",
        border: isOpen
            ? "1px solid rgba(35, 197, 129, 0.25)"
            : "1px solid rgba(255, 102, 117, 0.25)",
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
                {/* Page Header */}
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
                            <Store size={17} />
                            ADMIN DASHBOARD
                        </div>

                        <h1
                            className="fw-bold mb-2"
                            style={{
                                fontSize: "clamp(30px, 4vw, 46px)",
                                letterSpacing: "-1.5px",
                            }}
                        >
                            Restaurants
                        </h1>

                        <p className="mb-0" style={mutedText}>
                            Manage restaurants, owners and restaurant
                            availability.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn d-flex align-items-center gap-2 px-4 py-3"
                        onClick={() => navigate("/admin/restaurant/create")}
                        style={{
                            backgroundColor: "#ff7130",
                            color: "#ffffff",
                            border: "1px solid #ff7130",
                            borderRadius: "16px",
                        }}
                    >
                        <Plus size={18} />
                        Add Restaurant
                    </button>
                </section>

                {/* Summary Cards */}
                <section className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={panelStyle}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        ...iconBox,
                                        backgroundColor:
                                            "rgba(67, 139, 255, 0.15)",
                                        color: "#438bff",
                                    }}
                                >
                                    <Store size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={mutedText}
                                >
                                    Total
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Total Restaurants
                            </p>

                            <h2 className="fw-bold mb-0">
                                {totalRestaurants}
                            </h2>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={panelStyle}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        ...iconBox,
                                        backgroundColor:
                                            "rgba(35, 197, 129, 0.15)",
                                        color: "#23c581",
                                    }}
                                >
                                    <CheckCircle2 size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={{
                                        color: "#23c581",
                                    }}
                                >
                                    Active
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Open Restaurants
                            </p>

                            <h2 className="fw-bold mb-0">
                                {openRestaurants}
                            </h2>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={panelStyle}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        ...iconBox,
                                        backgroundColor:
                                            "rgba(255, 102, 117, 0.15)",
                                        color: "#ff6675",
                                    }}
                                >
                                    <XCircle size={23} />
                                </div>

                                <span
                                    className="small"
                                    style={{
                                        color: "#ff6675",
                                    }}
                                >
                                    Inactive
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Closed Restaurants
                            </p>

                            <h2 className="fw-bold mb-0">
                                {closedRestaurants}
                            </h2>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={panelStyle}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        ...iconBox,
                                        backgroundColor:
                                            "rgba(255, 193, 7, 0.15)",
                                        color: "#ffc107",
                                    }}
                                >
                                    <Star
                                        size={23}
                                        fill="currentColor"
                                    />
                                </div>

                                <span
                                    className="small"
                                    style={mutedText}
                                >
                                    Rating
                                </span>
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Average Rating
                            </p>

                            <h2 className="fw-bold mb-0">
                                {averageRating}
                                <small
                                    className="ms-1"
                                    style={{
                                        color: "#ffc107",
                                        fontSize: "15px",
                                    }}
                                >
                                    / 5
                                </small>
                            </h2>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section
                    className="p-4 mb-4"
                    style={panelStyle}
                >
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <SlidersHorizontal
                            size={19}
                            style={{ color: "#ff7a32" }}
                        />

                        <h5 className="fw-bold mb-0">
                            Filter Restaurants
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
                                    placeholder="Search restaurant, owner, city..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                style={inputStyle}
                            >
                                <option value="All">All Status</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <select
                                className="form-select"
                                value={rating}
                                onChange={(e) =>
                                    setRating(e.target.value)
                                }
                                style={inputStyle}
                            >
                                <option value="All">All Ratings</option>
                                <option value="4+">4+ Stars</option>
                                <option value="3+">3+ Stars</option>
                                <option value="2+">2+ Stars</option>
                            </select>
                        </div>

                        <div className="col-8 col-md-4 col-lg-2">
                            <select
                                className="form-select"
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value)
                                }
                                style={inputStyle}
                            >
                                <option value="Newest">Newest</option>
                                <option value="Oldest">Oldest</option>
                                <option value="Highest Rated">
                                    Highest Rated
                                </option>
                                <option value="Lowest Rated">
                                    Lowest Rated
                                </option>
                            </select>
                        </div>

                        <div className="col-4 col-lg-1">
                            <select
                                className="form-select"
                                value={itemsPerPage}
                                onChange={(e) =>
                                    setItemsPerPage(
                                        Number(e.target.value)
                                    )
                                }
                                style={inputStyle}
                            >
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
                        <small style={mutedText}>
                            Showing{" "}
                            <strong className="text-white">
                                {paginatedRestaurants.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="text-white">
                                {filteredRestaurants.length}
                            </strong>{" "}
                            restaurants
                        </small>

                        {(search ||
                            status !== "All" ||
                            rating !== "All" ||
                            sort !== "Newest") && (
                            <button
                                type="button"
                                className="btn btn-sm rounded-pill px-3"
                                onClick={clearFilters}
                                style={{
                                    color: "#ff7a32",
                                    backgroundColor:
                                        "rgba(255, 122, 50, 0.15)",
                                    border: "1px solid rgba(255, 122, 50, 0.3)",
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </section>

                {/* Restaurant Cards */}
                <section className="row g-4 mb-4">
                    {paginatedRestaurants.length > 0 ? (
                        paginatedRestaurants.map((restaurant) => (
                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={restaurant._id}
                            >
                                <div
                                    className="h-100 overflow-hidden"
                                    style={panelStyle}
                                >
                                    <div
                                        className="position-relative"
                                        style={{
                                            height: "190px",
                                            backgroundColor: "#20242a",
                                        }}
                                    >
                                        {restaurant.banner?.url ? (
                                            <img
                                                src={restaurant.banner.url}
                                                alt={restaurant.name}
                                                className="w-100 h-100"
                                                style={{
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100">
                                                <Store
                                                    size={55}
                                                    style={{
                                                        color: "#66717f",
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div
                                            className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill small fw-semibold"
                                            style={getStatusStyle(
                                                restaurant.isOpen
                                            )}
                                        >
                                            {restaurant.isOpen
                                                ? "● Open"
                                                : "● Closed"}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1">
                                                    {restaurant.name}
                                                </h5>

                                                <small style={mutedText}>
                                                    {restaurant.owner?.name ||
                                                        "Owner not available"}
                                                </small>
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
                                                                    `/admin/restaurant/${restaurant._id}`
                                                                )
                                                            }
                                                        >
                                                            <Eye size={16} />
                                                            View Restaurant
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item d-flex align-items-center gap-2"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/restaurant/edit/${restaurant._id}`
                                                                )
                                                            }
                                                        >
                                                            <Pencil size={16} />
                                                            Edit Restaurant
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
                                                                    "Delete restaurant:",
                                                                    restaurant._id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Restaurant
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <p
                                            className="small mb-3"
                                            style={{
                                                ...mutedText,
                                                minHeight: "40px",
                                            }}
                                        >
                                            {restaurant.description ||
                                                "No restaurant description available."}
                                        </p>

                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <MapPin
                                                size={16}
                                                style={{
                                                    color: "#ff7a32",
                                                }}
                                            />

                                            <span
                                                className="small"
                                                style={mutedText}
                                            >
                                                {restaurant.city || "N/A"},{" "}
                                                {restaurant.state || ""}
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <Phone
                                                size={16}
                                                style={{
                                                    color: "#438bff",
                                                }}
                                            />

                                            <span
                                                className="small"
                                                style={mutedText}
                                            >
                                                {restaurant.phone || "N/A"}
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <Mail
                                                size={16}
                                                style={{
                                                    color: "#23c581",
                                                }}
                                            />

                                            <span
                                                className="small text-truncate"
                                                style={mutedText}
                                            >
                                                {restaurant.email || "N/A"}
                                            </span>
                                        </div>

                                        <div
                                            className="d-flex justify-content-between align-items-center pt-3"
                                            style={{
                                                borderTop:
                                                    "1px solid #2a2f35",
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <Star
                                                    size={17}
                                                    fill="#ffc107"
                                                    color="#ffc107"
                                                />

                                                <span className="fw-semibold">
                                                    {Number(
                                                        restaurant.rating || 0
                                                    ).toFixed(1)}
                                                </span>

                                                <small style={mutedText}>
                                                    (
                                                    {restaurant.totalReviews ||
                                                        0}
                                                    )
                                                </small>
                                            </div>

                                            <div
                                                className="small d-flex align-items-center gap-1"
                                                style={mutedText}
                                            >
                                                <Clock size={15} />
                                                {restaurant.deliveryTime ||
                                                    "N/A"}
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
                                <Store
                                    size={48}
                                    style={{
                                        color: "#66717f",
                                    }}
                                />

                                <h5 className="fw-bold mt-3 mb-2">
                                    No restaurants found
                                </h5>

                                <p className="mb-3" style={mutedText}>
                                    Try changing your search or filters.
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
                            Showing {startItem}–{endItem} of{" "}
                            {filteredRestaurants.length} restaurants
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
                                <ChevronLeft size={17} />
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
                                    currentPage === totalPages ||
                                    totalPages === 0
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
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};