// import React, { useEffect, useMemo, useState } from "react";
// import { Download, CalendarDays, TrendingUp, Utensils, Store, Tags, Star, CheckCircle2, XCircle } from "lucide-react";
// import { Navbar } from "../../Components/Navbar";
// import { Footer } from "../../Components/Footer";
// import { useDispatch, useSelector } from "react-redux";
// import { GetCategory } from "../../Redux/CategorySlice";
// import { GetRestaurant } from "../../Redux/RestaurantSlice";
// import { GetAllFoods } from "../../Redux/FoodSlice";

// export const AdminReports = () => {
//     const { category: categories } = useSelector((state) => state.category);
//     const { restaurants } = useSelector((state) => state.restaurant);
//     const { food } = useSelector((state) => state.food);
//     const dispatch = useDispatch();
//     const [period, setPeriod] = useState("All Time");
//     const [search, setSearch] = useState("");
//     const [availability, setAvailability] = useState("All");

//     const categoryList = Array.isArray(categories) ? categories : [];
//     const restaurantList = Array.isArray(restaurants) ? restaurants : [];
//     const foodList = Array.isArray(food) ? food : [];

//     useEffect(() => {
//         dispatch(GetCategory());
//         dispatch(GetRestaurant());
//         dispatch(GetAllFoods());
//     }, [dispatch]);

//     const totalFoods = foodList.length;
//     const availableFoods = foodList.filter((item) => item.isAvailable).length;
//     const unavailableFoods = foodList.filter((item) => !item.isAvailable).length;
//     const totalRestaurants = restaurantList.length;
//     const openRestaurants = restaurantList.filter((item) => item.isOpen).length;
//     const closedRestaurants = restaurantList.filter((item) => !item.isOpen).length;
//     const totalCategories = categoryList.length;

//     const averageFoodRating = foodList.length
//         ? (foodList.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / foodList.length).toFixed(1)
//         : "0.0";

//     const averageRestaurantRating = restaurantList.length
//         ? (restaurantList.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / restaurantList.length).toFixed(1)
//         : "0.0";

//     const filteredFoods = useMemo(() => {
//         return foodList.filter((item) => {
//             const matchesSearch =
//                 item.name?.toLowerCase().includes(search.toLowerCase()) ||
//                 item.restaurant?.name?.toLowerCase().includes(search.toLowerCase()) ||
//                 item.category?.name?.toLowerCase().includes(search.toLowerCase());

//             const matchesAvailability =
//                 availability === "All" ||
//                 (availability === "Available" && item.isAvailable) ||
//                 (availability === "Unavailable" && !item.isAvailable);

//             return matchesSearch && matchesAvailability;
//         });
//     }, [foodList, search, availability]);

//     const recentFoods = [...foodList]
//         .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
//         .slice(0, 5);

//     const categoryReport = categoryList.map((category) => {
//         const categoryFoods = foodList.filter(
//             (item) => item.category?._id === category._id || item.category === category._id
//         );

//         const available = categoryFoods.filter((item) => item.isAvailable).length;
//         const unavailable = categoryFoods.filter((item) => !item.isAvailable).length;

//         return {
//             ...category,
//             foodsCount: categoryFoods.length,
//             available,
//             unavailable
//         };
//     });

//     const restaurantReport = restaurantList.map((restaurant) => {
//         const restaurantFoods = foodList.filter(
//             (item) => item.restaurant?._id === restaurant._id || item.restaurant === restaurant._id
//         );

//         const available = restaurantFoods.filter((item) => item.isAvailable).length;
//         const unavailable = restaurantFoods.filter((item) => !item.isAvailable).length;

//         return {
//             ...restaurant,
//             foodsCount: restaurantFoods.length,
//             available,
//             unavailable
//         };
//     });

//     return (
//         <div className="bg-black">
//             <Navbar className="shadow-lg"/>

//             <div className="container py-4 text-white">
//                 <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 ">
//                     <div>
//                         <div className="d-flex align-items-center gap-2 mb-1">
//                             <TrendingUp size={21} />
//                             <span className="fw-semibold text-secondary">ADMIN REPORTS</span>
//                         </div>
//                         <h2 className="fw-bold mb-1">Reports & Analytics</h2>
//                         <p className="text-secondary mb-0">
//                             Analyze restaurants, food items and category performance.
//                         </p>
//                     </div>

//                     <div className="d-flex gap-2">
//                         <div className="dropdown">
//                             <button
//                                 className="btn btn-light border dropdown-toggle d-flex align-items-center gap-2"
//                                 data-bs-toggle="dropdown"
//                             >
//                                 <CalendarDays size={17} />
//                                 {period}
//                             </button>
//                             <ul className="dropdown-menu dropdown-menu-end">
//                                 <li><button className="dropdown-item" onClick={() => setPeriod("Today")}>Today</button></li>
//                                 <li><button className="dropdown-item" onClick={() => setPeriod("Last 7 Days")}>Last 7 Days</button></li>
//                                 <li><button className="dropdown-item" onClick={() => setPeriod("Last 30 Days")}>Last 30 Days</button></li>
//                                 <li><button className="dropdown-item" onClick={() => setPeriod("Last 3 Months")}>Last 3 Months</button></li>
//                                 <li><button className="dropdown-item" onClick={() => setPeriod("This Year")}>This Year</button></li>
//                                 <li><button className="dropdown-item" onClick={() => setPeriod("All Time")}>All Time</button></li>
//                             </ul>
//                         </div>

//                         <button className="btn btn-dark d-flex align-items-center gap-2">
//                             <Download size={17} />
//                             Export
//                         </button>
//                     </div>
//                 </div>

//                 <div className="row g-3 mb-4">
//                     <div className="col-6 col-xl-3">
//                         <div className="card border-0 shadow-sm h-100">
//                             <div className="card-body">
//                                 <div className="rounded-3 bg-primary-subtle text-primary p-2 d-inline-flex mb-3">
//                                     <Utensils size={21} />
//                                 </div>
//                                 <p className="text-secondary mb-1">Total Food Items</p>
//                                 <h3 className="fw-bold mb-0">{totalFoods}</h3>
//                                 <small className="text-secondary">All food items</small>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-6 col-xl-3">
//                         <div className="card border-0 shadow-sm h-100">
//                             <div className="card-body">
//                                 <div className="rounded-3 bg-success-subtle text-success p-2 d-inline-flex mb-3">
//                                     <CheckCircle2 size={21} />
//                                 </div>
//                                 <p className="text-secondary mb-1">Available Food</p>
//                                 <h3 className="fw-bold mb-0">{availableFoods}</h3>
//                                 <small className="text-secondary">Currently available</small>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-6 col-xl-3">
//                         <div className="card border-0 shadow-sm h-100">
//                             <div className="card-body">
//                                 <div className="rounded-3 bg-info-subtle text-info p-2 d-inline-flex mb-3">
//                                     <Store size={21} />
//                                 </div>
//                                 <p className="text-secondary mb-1">Restaurants</p>
//                                 <h3 className="fw-bold mb-0">{totalRestaurants}</h3>
//                                 <small className="text-success">
//                                     {openRestaurants} currently open
//                                 </small>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-6 col-xl-3">
//                         <div className="card border-0 shadow-sm h-100">
//                             <div className="card-body">
//                                 <div className="rounded-3 bg-warning-subtle text-warning p-2 d-inline-flex mb-3">
//                                     <Tags size={21} />
//                                 </div>
//                                 <p className="text-secondary mb-1">Categories</p>
//                                 <h3 className="fw-bold mb-0">{totalCategories}</h3>
//                                 <small className="text-secondary">Food categories</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="row g-4 mb-4">
//                     <div className="col-lg-7">
//                         <div className="card border-0 shadow-sm h-100">
//                             <div className="card-body p-4 bg-dark text-white rounded">
//                                 <div className="d-flex justify-content-between align-items-center mb-4">
//                                     <div>
//                                         <h5 className="fw-bold mb-1">Food Availability</h5>
//                                         <p className="text-secondary mb-0">
//                                             Current availability of food items.
//                                         </p>
//                                     </div>
//                                     <Utensils size={21} className="text-primary" />
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <div className="border rounded-3 p-4">
//                                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                                 <span className="fw-semibold">Available</span>
//                                                 <span className="badge bg-success-subtle text-success">
//                                                     {availableFoods}
//                                                 </span>
//                                             </div>
//                                             <div className="progress" style={{ height: "10px" }}>
//                                                 <div
//                                                     className="progress-bar bg-success"
//                                                     style={{
//                                                         width: `${totalFoods ? (availableFoods / totalFoods) * 100 : 0}%`
//                                                     }}
//                                                 ></div>
//                                             </div>
//                                             <small className="text-secondary d-block mt-2">
//                                                 {totalFoods ? ((availableFoods / totalFoods) * 100).toFixed(1) : 0}% of food items
//                                             </small>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-6">
//                                         <div className="border rounded-3 p-4">
//                                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                                 <span className="fw-semibold">Unavailable</span>
//                                                 <span className="badge bg-danger-subtle text-danger">
//                                                     {unavailableFoods}
//                                                 </span>
//                                             </div>
//                                             <div className="progress" style={{ height: "10px" }}>
//                                                 <div
//                                                     className="progress-bar bg-danger"
//                                                     style={{
//                                                         width: `${totalFoods ? (unavailableFoods / totalFoods) * 100 : 0}%`
//                                                     }}
//                                                 ></div>
//                                             </div>
//                                             <small className="text-secondary d-block mt-2">
//                                                 {totalFoods ? ((unavailableFoods / totalFoods) * 100).toFixed(1) : 0}% of food items
//                                             </small>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="border-top mt-4 pt-4">
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <span className="text-secondary">Average Food Rating</span>
//                                         <div className="d-flex align-items-center gap-1">
//                                             <Star size={17} fill="currentColor" className="text-warning" />
//                                             <strong>{averageFoodRating}</strong>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-lg-5">
//                         <div className="card border-0 shadow-sm h-100">
//                             <div className="card-body p-4 bg-dark text-white rounded">
//                                 <h5 className="fw-bold mb-1">Restaurant Overview</h5>
//                                 <p className="text-secondary mb-4">
//                                     Current restaurant availability.
//                                 </p>

//                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                     <div className="d-flex align-items-center gap-3">
//                                         <div className="rounded-3 bg-success-subtle text-success p-2">
//                                             <CheckCircle2 size={20} />
//                                         </div>
//                                         <div>
//                                             <strong>Open Restaurants</strong>
//                                             <small className="d-block text-secondary">Currently accepting</small>
//                                         </div>
//                                     </div>
//                                     <h4 className="mb-0">{openRestaurants}</h4>
//                                 </div>

//                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                     <div className="d-flex align-items-center gap-3">
//                                         <div className="rounded-3 bg-danger-subtle text-danger p-2">
//                                             <XCircle size={20} />
//                                         </div>
//                                         <div>
//                                             <strong>Closed Restaurants</strong>
//                                             <small className="d-block text-secondary">Currently unavailable</small>
//                                         </div>
//                                     </div>
//                                     <h4 className="mb-0">{closedRestaurants}</h4>
//                                 </div>

//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div className="d-flex align-items-center gap-3">
//                                         <div className="rounded-3 bg-warning-subtle text-warning p-2">
//                                             <Star size={20} />
//                                         </div>
//                                         <div>
//                                             <strong>Average Rating</strong>
//                                             <small className="d-block text-secondary">Across restaurants</small>
//                                         </div>
//                                     </div>
//                                     <h4 className="mb-0">{averageRestaurantRating}</h4>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card border-0 shadow-sm mb-4">
//                     <div className="card-body p-4 bg-dark text-white rounded">
//                         <div className="mb-4">
//                             <h5 className="fw-bold mb-1">Category Performance</h5>
//                             <p className="text-secondary mb-0">
//                                 Food item distribution across categories.
//                             </p>
//                         </div>

//                         <div className="table-responsive">
//                             <table className="table align-middle mb-0">
//                                 <thead className="table-black ">
//                                     <tr>
//                                         <th>Category</th>
//                                         <th>Total Foods</th>
//                                         <th>Available</th>
//                                         <th>Unavailable</th>
//                                         <th>Availability</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {categoryReport.length > 0 ? (
//                                         categoryReport.map((item) => {
//                                             const percentage = item.foodsCount
//                                                 ? ((item.available / item.foodsCount) * 100).toFixed(1)
//                                                 : 0;

//                                             return (
//                                                 <tr key={item._id}>
//                                                     <td>
//                                                         <span className="fw-semibold">{item.name}</span>
//                                                     </td>
//                                                     <td>{item.foodsCount}</td>
//                                                     <td>
//                                                         <span className="text-success fw-semibold">
//                                                             {item.available}
//                                                         </span>
//                                                     </td>
//                                                     <td>
//                                                         <span className="text-danger fw-semibold">
//                                                             {item.unavailable}
//                                                         </span>
//                                                     </td>
//                                                     <td>
//                                                         <span className="badge bg-success-subtle text-success">
//                                                             {percentage}%
//                                                         </span>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="5" className="text-center py-4 text-secondary">
//                                                 No categories available
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card border-0 shadow-sm mb-4">
//                     <div className="card-body p-4 bg-dark text-white rounded">
//                         <div className="mb-4">
//                             <h5 className="fw-bold mb-1">Restaurant Performance</h5>
//                             <p className="text-secondary mb-0">
//                                 Food contribution and availability by restaurant.
//                             </p>
//                         </div>

//                         <div className="table-responsive">
//                             <table className="table align-middle mb-0">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>Restaurant</th>
//                                         <th>City</th>
//                                         <th>Food Items</th>
//                                         <th>Available</th>
//                                         <th>Status</th>
//                                         <th>Rating</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {restaurantReport.length > 0 ? (
//                                         restaurantReport.map((item) => (
//                                             <tr key={item._id}>
//                                                 <td>
//                                                     <div className="d-flex align-items-center gap-2">
//                                                         {item.logo?.url ? (
//                                                             <img
//                                                                 src={item.logo.url}
//                                                                 alt={item.name}
//                                                                 className="rounded"
//                                                                 style={{
//                                                                     width: "38px",
//                                                                     height: "38px",
//                                                                     objectFit: "cover"
//                                                                 }}
//                                                             />
//                                                         ) : (
//                                                             <div className="rounded bg-light p-2">
//                                                                 <Store size={18} />
//                                                             </div>
//                                                         )}
//                                                         <span className="fw-semibold">{item.name}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td>{item.city || "N/A"}</td>
//                                                 <td>{item.foodsCount}</td>
//                                                 <td>
//                                                     <span className="text-success fw-semibold">
//                                                         {item.available}
//                                                     </span>
//                                                 </td>
//                                                 <td>
//                                                     <span className={`badge ${item.isOpen ? "bg-success" : "bg-secondary"}`}>
//                                                         {item.isOpen ? "Open" : "Closed"}
//                                                     </span>
//                                                 </td>
//                                                 <td>
//                                                     <div className="d-flex align-items-center gap-1">
//                                                         <Star size={15} fill="currentColor" className="text-warning" />
//                                                         <span>{item.rating || 0}</span>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="6" className="text-center py-4 text-secondary">
//                                                 No restaurants available
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card border-0 shadow-sm mb-4">
//                     <div className="card-body p-4 bg-dark text-white rounded">
//                         <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//                             <div>
//                                 <h5 className="fw-bold mb-1">Food Report</h5>
//                                 <p className="text-secondary mb-0">
//                                     Search and review food items on the platform.
//                                 </p>
//                             </div>

//                             <div className="d-flex flex-wrap gap-2">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Search food..."
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     style={{ width: "210px" }}
//                                 />

//                                 <select
//                                     className="form-select"
//                                     value={availability}
//                                     onChange={(e) => setAvailability(e.target.value)}
//                                     style={{ width: "160px" }}
//                                 >
//                                     <option value="All">All Food</option>
//                                     <option value="Available">Available</option>
//                                     <option value="Unavailable">Unavailable</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="table-responsive">
//                             <table className="table align-middle mb-0">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>Food</th>
//                                         <th>Restaurant</th>
//                                         <th>Category</th>
//                                         <th>Price</th>
//                                         <th>Availability</th>
//                                         <th>Rating</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredFoods.length > 0 ? (
//                                         filteredFoods.map((item) => (
//                                             <tr key={item._id}>
//                                                 <td>
//                                                     <div className="d-flex align-items-center gap-2">
//                                                         {item.image?.url && (
//                                                             <img
//                                                                 src={item.image.url}
//                                                                 alt={item.name}
//                                                                 className="rounded"
//                                                                 style={{
//                                                                     width: "42px",
//                                                                     height: "42px",
//                                                                     objectFit: "cover"
//                                                                 }}
//                                                             />
//                                                         )}
//                                                         <div>
//                                                             <span className="fw-semibold d-block">
//                                                                 {item.name}
//                                                             </span>
//                                                             <small className="text-secondary">
//                                                                 {item.preparedTime || "N/A"}
//                                                             </small>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td>{item.restaurant?.name || "N/A"}</td>
//                                                 <td>{item.category?.name || "N/A"}</td>
//                                                 <td>₹{item.price}</td>
//                                                 <td>
//                                                     <span className={`badge ${item.isAvailable ? "bg-success" : "bg-secondary"}`}>
//                                                         {item.isAvailable ? "Available" : "Unavailable"}
//                                                     </span>
//                                                 </td>
//                                                 <td>
//                                                     <div className="d-flex align-items-center gap-1">
//                                                         <Star size={15} fill="currentColor" className="text-warning" />
//                                                         <span>{item.rating || 0}</span>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="6" className="text-center py-4 text-secondary">
//                                                 No food items found
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card border-0 shadow-sm">
//                     <div className="card-body p-4">
//                         <div className="mb-4">
//                             <h5 className="fw-bold mb-1">Recently Added Foods</h5>
//                             <p className="text-secondary mb-0">
//                                 Latest food items added to the platform.
//                             </p>
//                         </div>

//                         <div className="row g-3">
//                             {recentFoods.length > 0 ? (
//                                 recentFoods.map((item) => (
//                                     <div className="col-12 col-md-6 col-xl-4" key={item._id}>
//                                         <div className="border rounded-3 p-3 h-100">
//                                             <div className="d-flex align-items-center gap-3">
//                                                 {item.image?.url ? (
//                                                     <img
//                                                         src={item.image.url}
//                                                         alt={item.name}
//                                                         className="rounded-3"
//                                                         style={{
//                                                             width: "65px",
//                                                             height: "65px",
//                                                             objectFit: "cover"
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     <div
//                                                         className="rounded-3 bg-light d-flex align-items-center justify-content-center"
//                                                         style={{
//                                                             width: "65px",
//                                                             height: "65px"
//                                                         }}
//                                                     >
//                                                         <Utensils size={24} />
//                                                     </div>
//                                                 )}

//                                                 <div className="flex-grow-1">
//                                                     <h6 className="fw-bold mb-1">{item.name}</h6>
//                                                     <small className="text-secondary d-block">
//                                                         {item.restaurant?.name || "Restaurant unavailable"}
//                                                     </small>
//                                                     <div className="d-flex align-items-center gap-2 mt-1">
//                                                         <span className="fw-semibold">₹{item.price}</span>
//                                                         <span className={`badge ${item.isAvailable ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
//                                                             {item.isAvailable ? "Available" : "Unavailable"}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="col-12 text-center text-secondary py-4">
//                                     No food items available
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </div>
//     );
// };









import React, { useEffect, useMemo, useState } from "react";
import {
    Download,
    CalendarDays,
    TrendingUp,
    Utensils,
    Store,
    Tags,
    Star,
    CheckCircle2,
    XCircle,
    Search,
} from "lucide-react";

import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";

import { useDispatch, useSelector } from "react-redux";
import { GetCategory } from "../../Redux/CategorySlice";
import { GetRestaurant } from "../../Redux/RestaurantSlice";
import { GetAllFoods } from "../../Redux/FoodSlice";

export const AdminReports = () => {
    const dispatch = useDispatch();

    const { category: categories } = useSelector((state) => state.category);
    const { restaurants } = useSelector((state) => state.restaurant);
    const { food } = useSelector((state) => state.food);

    const [period, setPeriod] = useState("All Time");
    const [search, setSearch] = useState("");
    const [availability, setAvailability] = useState("All");

    const categoryList = Array.isArray(categories) ? categories : [];
    const restaurantList = Array.isArray(restaurants) ? restaurants : [];
    const foodList = Array.isArray(food) ? food : [];

    useEffect(() => {
        dispatch(GetCategory());
        dispatch(GetRestaurant());
        dispatch(GetAllFoods());
    }, [dispatch]);

    const totalFoods = foodList.length;

    const availableFoods = foodList.filter(
        (item) => item.isAvailable
    ).length;

    const unavailableFoods = foodList.filter(
        (item) => !item.isAvailable
    ).length;

    const totalRestaurants = restaurantList.length;

    const openRestaurants = restaurantList.filter(
        (item) => item.isOpen
    ).length;

    const closedRestaurants = restaurantList.filter(
        (item) => !item.isOpen
    ).length;

    const totalCategories = categoryList.length;

    const averageFoodRating = foodList.length
        ? (
              foodList.reduce(
                  (sum, item) => sum + (Number(item.rating) || 0),
                  0
              ) / foodList.length
          ).toFixed(1)
        : "0.0";

    const averageRestaurantRating = restaurantList.length
        ? (
              restaurantList.reduce(
                  (sum, item) => sum + (Number(item.rating) || 0),
                  0
              ) / restaurantList.length
          ).toFixed(1)
        : "0.0";

    const filteredFoods = useMemo(() => {
        const searchValue = search.toLowerCase();

        return foodList.filter((item) => {
            const foodName = String(item.name || "").toLowerCase();
            const restaurantName = String(
                item.restaurant?.name || ""
            ).toLowerCase();
            const categoryName = String(
                item.category?.name || ""
            ).toLowerCase();

            const matchesSearch =
                foodName.includes(searchValue) ||
                restaurantName.includes(searchValue) ||
                categoryName.includes(searchValue);

            const matchesAvailability =
                availability === "All" ||
                (availability === "Available" && item.isAvailable) ||
                (availability === "Unavailable" && !item.isAvailable);

            return matchesSearch && matchesAvailability;
        });
    }, [foodList, search, availability]);

    const recentFoods = [...foodList]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        )
        .slice(0, 5);

    const categoryReport = categoryList.map((category) => {
        const categoryFoods = foodList.filter(
            (item) =>
                item.category?._id === category._id ||
                item.category === category._id
        );

        const available = categoryFoods.filter(
            (item) => item.isAvailable
        ).length;

        const unavailable = categoryFoods.filter(
            (item) => !item.isAvailable
        ).length;

        return {
            ...category,
            foodsCount: categoryFoods.length,
            available,
            unavailable,
        };
    });

    const restaurantReport = restaurantList.map((restaurant) => {
        const restaurantFoods = foodList.filter(
            (item) =>
                item.restaurant?._id === restaurant._id ||
                item.restaurant === restaurant._id
        );

        const available = restaurantFoods.filter(
            (item) => item.isAvailable
        ).length;

        const unavailable = restaurantFoods.filter(
            (item) => !item.isAvailable
        ).length;

        return {
            ...restaurant,
            foodsCount: restaurantFoods.length,
            available,
            unavailable,
        };
    });

    const exportReport = () => {
        const headers = [
            "Food",
            "Restaurant",
            "Category",
            "Price",
            "Availability",
            "Rating",
        ];

        const rows = filteredFoods.map((item) => [
            item.name || "N/A",
            item.restaurant?.name || "N/A",
            item.category?.name || "N/A",
            item.price || 0,
            item.isAvailable ? "Available" : "Unavailable",
            item.rating || 0,
        ]);

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "admin-food-report.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    const cardStyle = {
        background:
            "linear-gradient(145deg, #191c20 0%, #101214 100%)",
        border: "1px solid #292d32",
        borderRadius: "24px",
        color: "#ffffff",
    };

    const panelStyle = {
        background:
            "linear-gradient(145deg, #191c20 0%, #101214 100%)",
        border: "1px solid #292d32",
        borderRadius: "24px",
        color: "#ffffff",
    };

    const mutedText = {
        color: "#8d98a8",
    };

    const orangeText = {
        color: "#ff7a32",
    };

    const orangeIconStyle = {
        backgroundColor: "rgba(255, 122, 50, 0.15)",
        color: "#ff7a32",
        width: "52px",
        height: "52px",
        borderRadius: "16px",
    };

    const greenIconStyle = {
        backgroundColor: "rgba(35, 197, 129, 0.15)",
        color: "#23c581",
        width: "52px",
        height: "52px",
        borderRadius: "16px",
    };

    const yellowIconStyle = {
        backgroundColor: "rgba(255, 193, 7, 0.15)",
        color: "#ffc107",
        width: "52px",
        height: "52px",
        borderRadius: "16px",
    };

    const blueIconStyle = {
        backgroundColor: "rgba(67, 139, 255, 0.15)",
        color: "#438bff",
        width: "52px",
        height: "52px",
        borderRadius: "16px",
    };

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
                                ...orangeText,
                                letterSpacing: "3px",
                                fontSize: "13px",
                            }}
                        >
                            <TrendingUp size={17} />
                            ADMIN DASHBOARD
                        </div>

                        <h1
                            className="fw-bold mb-2"
                            style={{
                                fontSize: "clamp(30px, 4vw, 46px)",
                                letterSpacing: "-1.5px",
                            }}
                        >
                            Reports & Analytics
                        </h1>

                        <p className="mb-0" style={mutedText}>
                            Monitor food items, restaurants and category
                            performance from one place.
                        </p>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="dropdown">
                            <button
                                className="btn dropdown-toggle d-flex align-items-center gap-2 px-3 py-2"
                                data-bs-toggle="dropdown"
                                style={{
                                    backgroundColor: "#171a1d",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                    borderRadius: "30px",
                                }}
                            >
                                <CalendarDays size={17} />
                                {period}
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end shadow">
                                {[
                                    "Today",
                                    "Last 7 Days",
                                    "Last 30 Days",
                                    "Last 3 Months",
                                    "This Year",
                                    "All Time",
                                ].map((item) => (
                                    <li key={item}>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setPeriod(item)}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            className="btn d-flex align-items-center gap-2 px-3 py-2"
                            onClick={exportReport}
                            style={{
                                backgroundColor: "#ff7130",
                                color: "#ffffff",
                                border: "1px solid #ff7130",
                                borderRadius: "30px",
                            }}
                        >
                            <Download size={17} />
                            Export
                        </button>
                    </div>
                </section>

                {/* Statistics */}
                <section className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={cardStyle}
                        >
                            <div
                                className="d-flex align-items-center justify-content-center mb-4"
                                style={orangeIconStyle}
                            >
                                <Utensils size={23} />
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Total Food Items
                            </p>

                            <h2 className="fw-bold mb-2">
                                {totalFoods}
                            </h2>

                            <small style={mutedText}>
                                All food items
                            </small>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={cardStyle}
                        >
                            <div
                                className="d-flex align-items-center justify-content-center mb-4"
                                style={greenIconStyle}
                            >
                                <CheckCircle2 size={23} />
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Available Food
                            </p>

                            <h2 className="fw-bold mb-2">
                                {availableFoods}
                            </h2>

                            <small style={mutedText}>
                                Currently available
                            </small>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={cardStyle}
                        >
                            <div
                                className="d-flex align-items-center justify-content-center mb-4"
                                style={blueIconStyle}
                            >
                                <Store size={23} />
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Restaurants
                            </p>

                            <h2 className="fw-bold mb-2">
                                {totalRestaurants}
                            </h2>

                            <small style={{ color: "#23c581" }}>
                                {openRestaurants} currently open
                            </small>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div
                            className="p-4 h-100"
                            style={cardStyle}
                        >
                            <div
                                className="d-flex align-items-center justify-content-center mb-4"
                                style={yellowIconStyle}
                            >
                                <Tags size={23} />
                            </div>

                            <p className="mb-2" style={mutedText}>
                                Categories
                            </p>

                            <h2 className="fw-bold mb-2">
                                {totalCategories}
                            </h2>

                            <small style={mutedText}>
                                Food categories
                            </small>
                        </div>
                    </div>
                </section>

                {/* Overview Panels */}
                <section className="row g-4 mb-4">
                    <div className="col-12 col-lg-7">
                        <div
                            className="p-4 h-100"
                            style={panelStyle}
                        >
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h4 className="fw-bold mb-2">
                                        Food Availability
                                    </h4>

                                    <p className="mb-0" style={mutedText}>
                                        Current availability of food items.
                                    </p>
                                </div>

                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={orangeIconStyle}
                                >
                                    <Utensils size={21} />
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <div
                                        className="p-3 h-100"
                                        style={{
                                            backgroundColor: "#121518",
                                            border: "1px solid #2a2f35",
                                            borderRadius: "18px",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-semibold">
                                                Available
                                            </span>

                                            <span
                                                className="px-3 py-1 rounded-pill fw-semibold"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(35, 197, 129, 0.15)",
                                                    color: "#23c581",
                                                }}
                                            >
                                                {availableFoods}
                                            </span>
                                        </div>

                                        <div
                                            className="progress"
                                            style={{
                                                height: "8px",
                                                backgroundColor: "#292f35",
                                            }}
                                        >
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${
                                                        totalFoods
                                                            ? (availableFoods /
                                                                  totalFoods) *
                                                              100
                                                            : 0
                                                    }%`,
                                                    backgroundColor: "#23c581",
                                                }}
                                            />
                                        </div>

                                        <small
                                            className="d-block mt-2"
                                            style={mutedText}
                                        >
                                            {totalFoods
                                                ? (
                                                      (availableFoods /
                                                          totalFoods) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            % of food items
                                        </small>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div
                                        className="p-3 h-100"
                                        style={{
                                            backgroundColor: "#121518",
                                            border: "1px solid #2a2f35",
                                            borderRadius: "18px",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-semibold">
                                                Unavailable
                                            </span>

                                            <span
                                                className="px-3 py-1 rounded-pill fw-semibold"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(220, 53, 69, 0.15)",
                                                    color: "#ff6675",
                                                }}
                                            >
                                                {unavailableFoods}
                                            </span>
                                        </div>

                                        <div
                                            className="progress"
                                            style={{
                                                height: "8px",
                                                backgroundColor: "#292f35",
                                            }}
                                        >
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${
                                                        totalFoods
                                                            ? (unavailableFoods /
                                                                  totalFoods) *
                                                              100
                                                            : 0
                                                    }%`,
                                                    backgroundColor: "#ff6675",
                                                }}
                                            />
                                        </div>

                                        <small
                                            className="d-block mt-2"
                                            style={mutedText}
                                        >
                                            {totalFoods
                                                ? (
                                                      (unavailableFoods /
                                                          totalFoods) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            % of food items
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="d-flex justify-content-between align-items-center mt-4 pt-4"
                                style={{
                                    borderTop: "1px solid #2a2f35",
                                }}
                            >
                                <span style={mutedText}>
                                    Average Food Rating
                                </span>

                                <div className="d-flex align-items-center gap-2">
                                    <Star
                                        size={18}
                                        fill="#ffc107"
                                        color="#ffc107"
                                    />

                                    <strong>
                                        {averageFoodRating}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div
                            className="p-4 h-100"
                            style={panelStyle}
                        >
                            <h4 className="fw-bold mb-2">
                                Restaurant Overview
                            </h4>

                            <p className="mb-4" style={mutedText}>
                                Current restaurant availability.
                            </p>

                            <div
                                className="d-flex justify-content-between align-items-center py-3"
                                style={{
                                    borderBottom: "1px solid #2a2f35",
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div style={greenIconStyle}>
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            <CheckCircle2 size={21} />
                                        </div>
                                    </div>

                                    <div>
                                        <strong className="d-block">
                                            Open Restaurants
                                        </strong>

                                        <small style={mutedText}>
                                            Currently accepting
                                        </small>
                                    </div>
                                </div>

                                <h3 className="mb-0">
                                    {openRestaurants}
                                </h3>
                            </div>

                            <div
                                className="d-flex justify-content-between align-items-center py-3"
                                style={{
                                    borderBottom: "1px solid #2a2f35",
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        style={{
                                            backgroundColor:
                                                "rgba(220, 53, 69, 0.15)",
                                            color: "#ff6675",
                                            width: "52px",
                                            height: "52px",
                                            borderRadius: "16px",
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            <XCircle size={21} />
                                        </div>
                                    </div>

                                    <div>
                                        <strong className="d-block">
                                            Closed Restaurants
                                        </strong>

                                        <small style={mutedText}>
                                            Currently unavailable
                                        </small>
                                    </div>
                                </div>

                                <h3 className="mb-0">
                                    {closedRestaurants}
                                </h3>
                            </div>

                            <div className="d-flex justify-content-between align-items-center py-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={yellowIconStyle}>
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            <Star size={21} />
                                        </div>
                                    </div>

                                    <div>
                                        <strong className="d-block">
                                            Average Rating
                                        </strong>

                                        <small style={mutedText}>
                                            Across restaurants
                                        </small>
                                    </div>
                                </div>

                                <h3 className="mb-0">
                                    {averageRestaurantRating}
                                </h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Performance */}
                <section
                    className="p-4 mb-4"
                    style={panelStyle}
                >
                    <div className="mb-4">
                        <h4 className="fw-bold mb-2">
                            Category Performance
                        </h4>

                        <p className="mb-0" style={mutedText}>
                            Food item distribution across categories.
                        </p>
                    </div>

                    <div className="table-responsive">
                        <table
                            className="table table-dark table-hover align-middle mb-0"
                            style={{
                                "--bs-table-bg": "transparent",
                                "--bs-table-hover-bg": "#1c2025",
                            }}
                        >
                            <thead>
                                <tr style={{ color: "#8d98a8" }}>
                                    <th>Category</th>
                                    <th>Total Foods</th>
                                    <th>Available</th>
                                    <th>Unavailable</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categoryReport.length > 0 ? (
                                    categoryReport.map((item) => {
                                        const percentage = item.foodsCount
                                            ? (
                                                  (item.available /
                                                      item.foodsCount) *
                                                  100
                                              ).toFixed(1)
                                            : 0;

                                        return (
                                            <tr key={item._id}>
                                                <td className="fw-semibold">
                                                    {item.name}
                                                </td>

                                                <td>{item.foodsCount}</td>

                                                <td
                                                    style={{
                                                        color: "#23c581",
                                                    }}
                                                >
                                                    {item.available}
                                                </td>

                                                <td
                                                    style={{
                                                        color: "#ff6675",
                                                    }}
                                                >
                                                    {item.unavailable}
                                                </td>

                                                <td>
                                                    <span
                                                        className="px-3 py-1 rounded-pill"
                                                        style={{
                                                            backgroundColor:
                                                                "rgba(35, 197, 129, 0.15)",
                                                            color: "#23c581",
                                                        }}
                                                    >
                                                        {percentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-4"
                                            style={mutedText}
                                        >
                                            No categories available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Restaurant Performance */}
                <section
                    className="p-4 mb-4"
                    style={panelStyle}
                >
                    <div className="mb-4">
                        <h4 className="fw-bold mb-2">
                            Restaurant Performance
                        </h4>

                        <p className="mb-0" style={mutedText}>
                            Food contribution and availability by restaurant.
                        </p>
                    </div>

                    <div className="table-responsive">
                        <table
                            className="table table-dark table-hover align-middle mb-0"
                            style={{
                                "--bs-table-bg": "transparent",
                                "--bs-table-hover-bg": "#1c2025",
                            }}
                        >
                            <thead>
                                <tr style={{ color: "#8d98a8" }}>
                                    <th>Restaurant</th>
                                    <th>City</th>
                                    <th>Food Items</th>
                                    <th>Available</th>
                                    <th>Status</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>

                            <tbody>
                                {restaurantReport.length > 0 ? (
                                    restaurantReport.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {item.logo?.url ? (
                                                        <img
                                                            src={item.logo.url}
                                                            alt={item.name}
                                                            className="rounded-3"
                                                            style={{
                                                                width: "44px",
                                                                height: "44px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-3"
                                                            style={{
                                                                width: "44px",
                                                                height: "44px",
                                                                backgroundColor:
                                                                    "#252a30",
                                                                color: "#8d98a8",
                                                            }}
                                                        >
                                                            <Store size={20} />
                                                        </div>
                                                    )}

                                                    <span className="fw-semibold">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>{item.city || "N/A"}</td>

                                            <td>{item.foodsCount}</td>

                                            <td
                                                style={{
                                                    color: "#23c581",
                                                }}
                                            >
                                                {item.available}
                                            </td>

                                            <td>
                                                <span
                                                    className="px-3 py-1 rounded-pill"
                                                    style={{
                                                        backgroundColor: item.isOpen
                                                            ? "rgba(35, 197, 129, 0.15)"
                                                            : "rgba(141, 152, 168, 0.15)",
                                                        color: item.isOpen
                                                            ? "#23c581"
                                                            : "#8d98a8",
                                                    }}
                                                >
                                                    {item.isOpen
                                                        ? "Open"
                                                        : "Closed"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Star
                                                        size={16}
                                                        fill="#ffc107"
                                                        color="#ffc107"
                                                    />

                                                    {item.rating || 0}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                            style={mutedText}
                                        >
                                            No restaurants available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Food Report */}
                <section
                    className="p-4 mb-4"
                    style={panelStyle}
                >
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold mb-2">
                                Food Report
                            </h4>

                            <p className="mb-0" style={mutedText}>
                                Search and review food items on the platform.
                            </p>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            <div className="position-relative">
                                <Search
                                    size={17}
                                    className="position-absolute top-50 translate-middle-y ms-3"
                                    style={{ color: "#8d98a8" }}
                                />

                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder="Search food..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    style={{
                                        width: "230px",
                                        backgroundColor: "#111417",
                                        color: "#ffffff",
                                        border: "1px solid #30353b",
                                        borderRadius: "30px",
                                    }}
                                />
                            </div>

                            <select
                                className="form-select"
                                value={availability}
                                onChange={(e) =>
                                    setAvailability(e.target.value)
                                }
                                style={{
                                    width: "170px",
                                    backgroundColor: "#111417",
                                    color: "#ffffff",
                                    border: "1px solid #30353b",
                                    borderRadius: "30px",
                                }}
                            >
                                <option value="All">All Food</option>
                                <option value="Available">
                                    Available
                                </option>
                                <option value="Unavailable">
                                    Unavailable
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table
                            className="table table-dark table-hover align-middle mb-0"
                            style={{
                                "--bs-table-bg": "transparent",
                                "--bs-table-hover-bg": "#1c2025",
                            }}
                        >
                            <thead>
                                <tr style={{ color: "#8d98a8" }}>
                                    <th>Food</th>
                                    <th>Restaurant</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Availability</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredFoods.length > 0 ? (
                                    filteredFoods.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {item.image?.url ? (
                                                        <img
                                                            src={item.image.url}
                                                            alt={item.name}
                                                            className="rounded-3"
                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-3"
                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                backgroundColor:
                                                                    "#252a30",
                                                                color: "#8d98a8",
                                                            }}
                                                        >
                                                            <Utensils size={20} />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <strong className="d-block">
                                                            {item.name}
                                                        </strong>

                                                        <small style={mutedText}>
                                                            {item.preparedTime ||
                                                                "N/A"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {item.restaurant?.name || "N/A"}
                                            </td>

                                            <td>
                                                {item.category?.name || "N/A"}
                                            </td>

                                            <td>₹{item.price || 0}</td>

                                            <td>
                                                <span
                                                    className="px-3 py-1 rounded-pill"
                                                    style={{
                                                        backgroundColor:
                                                            item.isAvailable
                                                                ? "rgba(35, 197, 129, 0.15)"
                                                                : "rgba(141, 152, 168, 0.15)",
                                                        color: item.isAvailable
                                                            ? "#23c581"
                                                            : "#8d98a8",
                                                    }}
                                                >
                                                    {item.isAvailable
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Star
                                                        size={16}
                                                        fill="#ffc107"
                                                        color="#ffc107"
                                                    />

                                                    {item.rating || 0}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                            style={mutedText}
                                        >
                                            No food items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recently Added Foods */}
                <section
                    className="p-4 mb-4"
                    style={panelStyle}
                >
                    <div className="mb-4">
                        <h4 className="fw-bold mb-2">
                            Recently Added Foods
                        </h4>

                        <p className="mb-0" style={mutedText}>
                            Latest food items added to the platform.
                        </p>
                    </div>

                    <div className="row g-3">
                        {recentFoods.length > 0 ? (
                            recentFoods.map((item) => (
                                <div
                                    className="col-12 col-md-6 col-xl-4"
                                    key={item._id}
                                >
                                    <div
                                        className="p-3 h-100"
                                        style={{
                                            backgroundColor: "#121518",
                                            border: "1px solid #2a2f35",
                                            borderRadius: "18px",
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            {item.image?.url ? (
                                                <img
                                                    src={item.image.url}
                                                    alt={item.name}
                                                    className="rounded-3"
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-3"
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        backgroundColor:
                                                            "#252a30",
                                                        color: "#8d98a8",
                                                    }}
                                                >
                                                    <Utensils size={25} />
                                                </div>
                                            )}

                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">
                                                    {item.name}
                                                </h6>

                                                <small
                                                    className="d-block mb-2"
                                                    style={mutedText}
                                                >
                                                    {item.restaurant?.name ||
                                                        "Restaurant unavailable"}
                                                </small>

                                                <div className="d-flex align-items-center flex-wrap gap-2">
                                                    <strong>
                                                        ₹{item.price || 0}
                                                    </strong>

                                                    <span
                                                        className="px-2 py-1 rounded-pill"
                                                        style={{
                                                            backgroundColor:
                                                                item.isAvailable
                                                                    ? "rgba(35, 197, 129, 0.15)"
                                                                    : "rgba(141, 152, 168, 0.15)",
                                                            color: item.isAvailable
                                                                ? "#23c581"
                                                                : "#8d98a8",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {item.isAvailable
                                                            ? "Available"
                                                            : "Unavailable"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                className="col-12 text-center py-4"
                                style={mutedText}
                            >
                                No food items available
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};