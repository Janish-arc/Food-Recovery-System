
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navbar } from "../../Components/Navbar";
// import { Footer } from "../../Components/Footer";
// import { useNavigate, useParams } from "react-router-dom";
// import { GetAllFoods } from "../../Redux/FoodSlice";
// import { GetAllUsers, GetSingleUser, logout, removeError, removeSuccess, UpdateProfile } from "../../Redux/UserSlice";
// import { GetMyOrder, GetOrdersByAdmin } from "../../Redux/OrderSlice";
// import { CreateRestaurant } from "../../Redux/RestaurantSlice";
// import { GetUserReview } from "../../Redux/ReviewSlice";
// import api from "../../api";
// import toast from "react-hot-toast";
// import {
//     Mail, Phone, MapPin, Calendar, ShieldCheck, Users, Truck,
//     Salad, Lock, LogOut, Edit2, Package, Heart, Star,
//     IndianRupee, ClipboardList, CheckCircle2, Clock, Bike,
//     XCircle, ChefHat
// } from "lucide-react";

// const STATUS_META = {
//     pending: { label: "Pending", color: "#b45309", bg: "#fef3c7", icon: Clock },
//     confirmed: { label: "Confirmed", color: "#1d4ed8", bg: "#dbeafe", icon: CheckCircle2 },
//     preparing: { label: "Preparing", color: "#7c3aed", bg: "#ede9fe", icon: Package },
//     out: { label: "Out for delivery", color: "#0369a1", bg: "#e0f2fe", icon: Bike },
//     delivered: { label: "Delivered", color: "#15803d", bg: "#dcfce7", icon: CheckCircle2 },
//     cancelled: { label: "Cancelled", color: "#b91c1c", bg: "#fee2e2", icon: XCircle }
// };

// const getStatusMeta = (status) => {
//     return STATUS_META[status?.toLowerCase()] || {
//         label: status || "Processing",
//         color: "#475569",
//         bg: "#f1f5f9",
//         icon: Truck
//     };
// };

// export const Profile = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const { user, users, error, success, singleuser } = useSelector((state) => state.user);
//     const { food } = useSelector((state) => state.food);
//     const { order, adminOrder } = useSelector((state) => state.order);
//     const { success: restaurantSuccess } = useSelector((state) => state.restaurant);
//     const profileData = id ? singleuser : user;

//     const [pop, setPop] = useState(false);
//     const [popUp, setPopUp] = useState(false);
//     const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
//     const [restaurantPreview, setRestaurantPreview] = useState("https://png.pngtree.com/png-clipart/20250601/original/pngtree-classic-restaurant-logo-with-cutlery-and-plate-png-image_21108177.png");
//     const [restaurantLogo, setRestaurantLogo] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
//     const [image, setImage] = useState(null);
//     const [resImage, setResImage] = useState(null);
//     const [logoImage, setLogoImage] = useState(null);

//     const [userdata, setUser] = useState({
//         name: "",
//         email: "",
//         phoneNo: "",
//         state: "",
//         address: "",
//         country: "",
//         pincode: ""
//     });

//     const [restaurant, setRestaurant] = useState({
//         name: "",
//         description: "",
//         email: "",
//         phone: "",
//         state: "",
//         address: "",
//         city: "",
//         pincode: "",
//         location: "",
//         openingTime: "",
//         closingTime: "",
//         deliveryFee: "",
//         minimumOrder: "",
//         deliveryTime: ""
//     });

//     const {
//         name,
//         email,
//         phoneNo,
//         address,
//         state: userState,
//         country,
//         pincode
//     } = userdata;

//     const {
//         name: restaurantName,
//         description,
//         email: restaurantEmail,
//         phone,
//         state: restaurantState,
//         address: restaurantAddress,
//         city,
//         pincode: restaurantPincode,
//         location,
//         openingTime,
//         closingTime,
//         deliveryFee,
//         minimumOrder,
//         deliveryTime
//     } = restaurant;

//     useEffect(() => {
//         if (id) {
//             dispatch(GetSingleUser(id));
//         }
//     }, [dispatch, id]);

//     useEffect(() => {
//         if (user && !id) {
//             setUser({
//                 name: user?.name || "",
//                 email: user?.email || "",
//                 phoneNo: user?.phoneNo || "",
//                 address: user?.address || "",
//                 state: user?.state || "",
//                 country: user?.country || "",
//                 pincode: user?.pincode || ""
//             });
//             setPreview(
//                 user?.image?.url ||
//                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//             );
//         }
//     }, [user, id]);

//     useEffect(() => {
//         if (error) {
//             toast.error(error);
//             dispatch(removeError());
//         }
//     }, [error, dispatch]);

//     useEffect(() => {
//         if (success) {
//             setPop(false);
//             dispatch(removeSuccess());
//         }
//     }, [success, dispatch]);

//     useEffect(() => {
//         if (restaurantSuccess) {
//             setPopUp(false);
//             dispatch(removeSuccess());
//         }
//     }, [restaurantSuccess, dispatch]);

//     useEffect(() => {
//         if (!user) return;

//         if (user.role === "admin") {
//             dispatch(GetAllUsers());
//             dispatch(GetOrdersByAdmin());
//             dispatch(GetAllFoods());
//         }

//         if (user.role === "customer") {
//             dispatch(GetMyOrder());
//         }

//         if (user.role === "restaurant") {
//             dispatch(GetAllFoods());
//         }
//     }, [dispatch, user?.role]);

//     useEffect(() => {
//         if (user?.role === "customer") {
//             dispatch(GetUserReview());
//         }
//     }, [dispatch, user?.role]);

//     const getInitials = (name = "") => {
//         return name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase()
//             .slice(0, 2);
//     };

//     const handleChange = (e) => {
//         setUser({
//             ...userdata,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleCreateRestaurant = (e) => {
//         setRestaurant({
//             ...restaurant,
//             [e.target.name]: e.target.value
//         });
//     };

//     const updateNow = (e) => {
//         e.preventDefault();
//         const myform = new FormData();
//         myform.set("name", name);
//         myform.set("email", email);
//         myform.set("phoneNo", phoneNo);
//         myform.set("address", address);
//         myform.set("state", userState);
//         myform.set("country", country);
//         myform.set("pincode", pincode);

//         if (image) {
//             myform.set("image", image);
//         }

//         dispatch(UpdateProfile(myform));
//     };

//     const createRestaurant = (e) => {
//         e.preventDefault();
//         const myform = new FormData();
//         myform.set("name", restaurantName);
//         myform.set("description", description);
//         myform.set("email", restaurantEmail);
//         myform.set("phone", phone);
//         myform.set("address", restaurantAddress);
//         myform.set("city", city);
//         myform.set("state", restaurantState);
//         myform.set("pincode", restaurantPincode);
//         myform.set("location", location);
//         myform.set("openingTime", openingTime);
//         myform.set("closingTime", closingTime);
//         myform.set("deliveryFee", deliveryFee);
//         myform.set("minimumOrder", minimumOrder);
//         myform.set("deliveryTime", deliveryTime);

//         if (resImage) {
//             myform.set("banner", resImage);
//         }

//         if (logoImage) {
//             myform.set("logo", logoImage);
//         }

//         dispatch(CreateRestaurant(myform));
//     };

//     const logoutUser = async () => {
//         try {
//             await api.post("/api/v1/user/logout", {}, {
//                 withCredentials: true
//             });
//         } catch (err) {
//             console.log("Logout API failed:", err);
//         }

//         dispatch(logout());
//         navigate("/");
//     };

//     const recentOrders = [...(order || [])]
//         .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
//         .slice(0, 4);

//     const availableUsers = (users || []).filter((item) => item.role !== "admin");

//     const totalSpent = (order || []).reduce(
//         (sum, item) => sum + (Number(item?.totalAmount) || 0),
//         0
//     );

//     const pendingOrders = (adminOrder || []).filter(
//         (item) =>
//             item?.orderStatus !== "Delivered" &&
//             item?.orderStatus !== "Cancelled"
//     ).length;

//     return (
//         <div>
//             <Navbar />
//             <div className="container-fluid px-3 px-md-4 py-4" style={{ background: "#f8fafc", minHeight: "80vh" }}>
//                 <div className="container">
//                     <div className="mb-4">
//                         <h2 className="fw-bold mb-1">My Account</h2>
//                         <p className="text-secondary mb-0">Manage your profile and account details</p>
//                     </div>

//                     <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16, overflow: "hidden" }}>
//                         <div
//                             className="d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 text-center text-md-start p-4"
//                             style={{ background: "#6c63ff" }}
//                         >
//                             <div
//                                 className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
//                                 style={{
//                                     width: 105,
//                                     height: 105,
//                                     border: "3px solid rgba(255,255,255,0.4)",
//                                     background: "#4f46e5",
//                                     color: "white",
//                                     fontSize: 28,
//                                     fontWeight: 700
//                                 }}
//                             >
//                                 {profileData?.image?.url ? (
//                                     <img
//                                         src={profileData.image.url}
//                                         alt="Profile"
//                                         style={{
//                                             width: "100%",
//                                             height: "100%",
//                                             objectFit: "cover"
//                                         }}
//                                     />
//                                 ) : (
//                                     getInitials(profileData?.name)
//                                 )}
//                             </div>

//                             <div className="flex-grow-1">
//                                 <div className="d-flex flex-column flex-md-row align-items-center gap-2">
//                                     <h3 className="mb-0 text-white fw-bold">
//                                         {profileData?.name || "User"}
//                                     </h3>

//                                     {profileData?.role && (
//                                         <span
//                                             className="badge rounded-pill d-flex align-items-center gap-1"
//                                             style={{
//                                                 background: "rgba(255,255,255,0.18)",
//                                                 color: "white"
//                                             }}
//                                         >
//                                             <ShieldCheck size={13} />
//                                             {profileData.role}
//                                         </span>
//                                     )}
//                                 </div>

//                                 <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-md-start gap-2 gap-sm-3 mt-2">
//                                     <span className="text-white-50 d-flex align-items-center gap-1">
//                                         <Mail size={14} />
//                                         {profileData?.email || "—"}
//                                     </span>

//                                     <span className="text-white-50 d-flex align-items-center gap-1">
//                                         <Phone size={14} />
//                                         {profileData?.phoneNo ? `+91 ${profileData.phoneNo}` : "—"}
//                                     </span>

//                                     {profileData?.address && (
//                                         <span className="text-white-50 d-flex align-items-center gap-1">
//                                             <MapPin size={14} />
//                                             {profileData.address}
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>

//                             {!id && (
//                                 <button
//                                     className="btn btn-light rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
//                                     onClick={() => setPop(true)}
//                                 >
//                                     <Edit2 size={15} />
//                                     Edit Profile
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     <div className="row g-4">
//                         <div className="col-12 col-lg-7">
//                             <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
//                                 <div className="card-body p-4">
//                                     <h6 className="fw-bold text-uppercase text-secondary mb-3">
//                                         Profile Details
//                                     </h6>

//                                     {[
//                                         {
//                                             label: "Name",
//                                             value: profileData?.name,
//                                             icon: Users
//                                         },
//                                         {
//                                             label: "Joined",
//                                             value: profileData?.createdAt
//                                                 ? new Date(profileData.createdAt).toLocaleDateString()
//                                                 : "—",
//                                             icon: Calendar
//                                         },
//                                         {
//                                             label: "Address",
//                                             value: profileData?.address,
//                                             icon: MapPin
//                                         },
//                                         {
//                                             label: "State",
//                                             value: profileData?.state,
//                                             icon: MapPin
//                                         },
//                                         {
//                                             label: "Country",
//                                             value: profileData?.country,
//                                             icon: MapPin
//                                         },
//                                         {
//                                             label: "Pincode",
//                                             value: profileData?.pincode,
//                                             icon: MapPin
//                                         }
//                                     ].map(({ label, value, icon: Icon }) => (
//                                         <div
//                                             key={label}
//                                             className="d-flex align-items-center py-3 border-bottom"
//                                         >
//                                             <div
//                                                 className="d-flex align-items-center gap-2 text-secondary"
//                                                 style={{ width: "35%", flexShrink: 0 }}
//                                             >
//                                                 <Icon size={15} />
//                                                 <span>{label}</span>
//                                             </div>

//                                             <div className="fw-semibold text-dark">
//                                                 {value || "—"}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="col-12 col-lg-5">
//                             {profileData?.role === "admin" && (
//                                 <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
//                                     <div className="card-body p-4">
//                                         <h6 className="fw-bold text-uppercase text-secondary mb-3">
//                                             Admin Overview
//                                         </h6>

//                                         <div
//                                             className="rounded-3 p-3 mb-3 text-white"
//                                             style={{ background: "#6c63ff" }}
//                                         >
//                                             <div className="fw-bold mb-1">
//                                                 Platform Summary
//                                             </div>
//                                             <small className="text-white-50">
//                                                 Monitor users, food and orders.
//                                             </small>
//                                         </div>

//                                         <div className="row g-2">
//                                             <div className="col-6">
//                                                 <div className="border rounded-3 p-3 text-center h-100">
//                                                     <Users size={20} className="text-primary mb-2" />
//                                                     <h5 className="fw-bold mb-0">
//                                                         {availableUsers.length}
//                                                     </h5>
//                                                     <small className="text-secondary">
//                                                         Customers
//                                                     </small>
//                                                 </div>
//                                             </div>

//                                             <div className="col-6">
//                                                 <div className="border rounded-3 p-3 text-center h-100">
//                                                     <Salad size={20} className="text-success mb-2" />
//                                                     <h5 className="fw-bold mb-0">
//                                                         {food?.length || 0}
//                                                     </h5>
//                                                     <small className="text-secondary">
//                                                         Food Items
//                                                     </small>
//                                                 </div>
//                                             </div>

//                                             <div className="col-6">
//                                                 <div className="border rounded-3 p-3 text-center h-100">
//                                                     <Package size={20} className="text-info mb-2" />
//                                                     <h5 className="fw-bold mb-0">
//                                                         {adminOrder?.length || 0}
//                                                     </h5>
//                                                     <small className="text-secondary">
//                                                         Orders
//                                                     </small>
//                                                 </div>
//                                             </div>

//                                             <div className="col-6">
//                                                 <div className="border rounded-3 p-3 text-center h-100">
//                                                     <Clock size={20} className="text-warning mb-2" />
//                                                     <h5 className="fw-bold mb-0">
//                                                         {pendingOrders}
//                                                     </h5>
//                                                     <small className="text-secondary">
//                                                         Active Orders
//                                                     </small>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {profileData?.role === "customer" && (
//                                 <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
//                                     <div className="card-body p-4">
//                                         <h6 className="fw-bold text-uppercase text-secondary mb-3">
//                                             Quick Actions
//                                         </h6>

//                                         <div className="d-flex flex-column gap-2">
//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => setPop(true)}
//                                             >
//                                                 <Edit2 size={15} />
//                                                 Edit Profile
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => navigate("/myorder")}
//                                             >
//                                                 <Package size={15} />
//                                                 My Orders
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                             >
//                                                 <MapPin size={15} />
//                                                 Manage Addresses
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                             >
//                                                 <Lock size={15} />
//                                                 Change Password
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => setPopUp(true)}
//                                             >
//                                                 <ChefHat size={15} />
//                                                 Become a Restaurant
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-danger rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={logoutUser}
//                                             >
//                                                 <LogOut size={15} />
//                                                 Logout
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {profileData?.role === "restaurant" && (
//                                 <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14 }}>
//                                     <div className="card-body p-4">
//                                         <h6 className="fw-bold text-uppercase text-secondary mb-3">
//                                             Restaurant Dashboard
//                                         </h6>

//                                         <div className="d-flex flex-column gap-2">
//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => navigate("/restaurant/dashboard")}
//                                             >
//                                                 <ChefHat size={15} />
//                                                 Dashboard
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => navigate("/restaurant/menu")}
//                                             >
//                                                 <Salad size={15} />
//                                                 Manage Menu
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => navigate("/restaurant/orders")}
//                                             >
//                                                 <Package size={15} />
//                                                 Orders
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={() => navigate("/restaurant/reviews")}
//                                             >
//                                                 <Star size={15} />
//                                                 Reviews
//                                             </button>

//                                             <button
//                                                 className="btn btn-outline-danger rounded-pill d-flex align-items-center justify-content-center gap-2"
//                                                 onClick={logoutUser}
//                                             >
//                                                 <LogOut size={15} />
//                                                 Logout
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {profileData?.role === "customer" && (
//                             <>
//                                 <div className="col-12">
//                                     <h6 className="fw-bold text-uppercase text-secondary mb-3">
//                                         Statistics
//                                     </h6>

//                                     <div className="row g-3">
//                                         <div className="col-6 col-md-4">
//                                             <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 14 }}>
//                                                 <div className="card-body py-4">
//                                                     <Package size={22} className="text-primary mb-2" />
//                                                     <h4 className="fw-bold mb-1">
//                                                         {order?.length || 0}
//                                                     </h4>
//                                                     <small className="text-secondary">
//                                                         Total Orders
//                                                     </small>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="col-6 col-md-4">
//                                             <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 14 }}>
//                                                 <div className="card-body py-4">
//                                                     <Heart size={22} className="text-danger mb-2" />
//                                                     <h4 className="fw-bold mb-1">
//                                                         0
//                                                     </h4>
//                                                     <small className="text-secondary">
//                                                         Favorites
//                                                     </small>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="col-12 col-md-4">
//                                             <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 14 }}>
//                                                 <div className="card-body py-4">
//                                                     <IndianRupee size={22} className="text-success mb-2" />
//                                                     <h4 className="fw-bold mb-1">
//                                                         ₹{totalSpent}
//                                                     </h4>
//                                                     <small className="text-secondary">
//                                                         Total Spent
//                                                     </small>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-12">
//                                     <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
//                                         <div className="card-body p-4">
//                                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                                 <div>
//                                                     <h6 className="fw-bold mb-1">
//                                                         Recent Orders
//                                                     </h6>
//                                                     <small className="text-secondary">
//                                                         Your latest orders
//                                                     </small>
//                                                 </div>

//                                                 {recentOrders.length > 0 && (
//                                                     <button
//                                                         className="btn btn-sm btn-outline-primary rounded-pill"
//                                                         onClick={() => navigate("/myorder")}
//                                                     >
//                                                         View All
//                                                     </button>
//                                                 )}
//                                             </div>

//                                             {recentOrders.length === 0 ? (
//                                                 <div className="text-center text-secondary py-4">
//                                                     <ClipboardList size={30} className="mb-2" />
//                                                     <div>No orders yet</div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="d-flex flex-column gap-2">
//                                                     {recentOrders.map((o) => {
//                                                         const meta = getStatusMeta(o?.orderStatus);
//                                                         const StatusIcon = meta.icon;
//                                                         const itemCount =
//                                                             o?.orderItems?.length ??
//                                                             o?.items?.length ??
//                                                             o?.foodItems?.length ??
//                                                             0;
//                                                         const amount =
//                                                             o?.totalAmount ??
//                                                             o?.totalPrice ??
//                                                             o?.amount;

//                                                         return (
//                                                             <div
//                                                                 key={o?._id}
//                                                                 className="d-flex align-items-center justify-content-between gap-3 p-3 rounded-3"
//                                                                 style={{ background: "#f8fafc" }}
//                                                             >
//                                                                 <div className="d-flex align-items-center gap-3">
//                                                                     <div
//                                                                         className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
//                                                                         style={{
//                                                                             width: 40,
//                                                                             height: 40,
//                                                                             background: meta.bg,
//                                                                             color: meta.color
//                                                                         }}
//                                                                     >
//                                                                         <StatusIcon size={17} />
//                                                                     </div>

//                                                                     <div>
//                                                                         <div className="fw-semibold">
//                                                                             Order #{o?._id?.slice(-6) || "—"}
//                                                                         </div>

//                                                                         <small className="text-secondary">
//                                                                             {o?.createdAt
//                                                                                 ? new Date(o.createdAt).toLocaleDateString()
//                                                                                 : "—"}
//                                                                             {itemCount
//                                                                                 ? ` · ${itemCount} item${itemCount > 1 ? "s" : ""}`
//                                                                                 : ""}
//                                                                         </small>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="text-end">
//                                                                     <span
//                                                                         className="badge rounded-pill mb-1"
//                                                                         style={{
//                                                                             background: meta.bg,
//                                                                             color: meta.color
//                                                                         }}
//                                                                     >
//                                                                         {meta.label}
//                                                                     </span>

//                                                                     {amount != null && (
//                                                                         <div className="fw-bold">
//                                                                             ₹{amount}
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {pop && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center px-3"
//                     style={{
//                         zIndex: 1050,
//                         background: "rgba(0,0,0,0.55)"
//                     }}
//                 >
//                     <div
//                         className="bg-white rounded-4 shadow-lg p-4 w-100 overflow-auto"
//                         style={{
//                             maxWidth: 550,
//                             maxHeight: "90vh",
//                             scrollbarWidth: "none"
//                         }}
//                     >
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <h4 className="fw-bold mb-0">Edit Profile</h4>
//                             <button
//                                 type="button"
//                                 className="btn-close"
//                                 onClick={() => setPop(false)}
//                             ></button>
//                         </div>

//                         <form onSubmit={updateNow}>
//                             <div className="d-flex flex-column gap-3">
//                                 <div>
//                                     <label className="form-label fw-semibold">Name</label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="name"
//                                         value={name}
//                                         onChange={handleChange}
//                                         placeholder="Enter your name"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Email</label>
//                                     <input
//                                         className="form-control"
//                                         type="email"
//                                         name="email"
//                                         value={email}
//                                         onChange={handleChange}
//                                         placeholder="Enter your email"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Phone</label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="phoneNo"
//                                         value={phoneNo}
//                                         onChange={handleChange}
//                                         placeholder="Enter your phone number"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Address</label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="address"
//                                         value={address}
//                                         onChange={handleChange}
//                                         placeholder="Enter your address"
//                                     />
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">State</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="state"
//                                             value={userState}
//                                             onChange={handleChange}
//                                             placeholder="Enter state"
//                                         />
//                                     </div>

//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Country</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="country"
//                                             value={country}
//                                             onChange={handleChange}
//                                             placeholder="Enter country"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Pincode</label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="pincode"
//                                         value={pincode}
//                                         onChange={handleChange}
//                                         placeholder="Enter pincode"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">
//                                         Profile Image
//                                     </label>

//                                     <div className="d-flex align-items-center gap-3">
//                                         <img
//                                             src={preview}
//                                             alt="Preview"
//                                             className="rounded-circle"
//                                             style={{
//                                                 width: 65,
//                                                 height: 65,
//                                                 objectFit: "cover"
//                                             }}
//                                         />

//                                         <input
//                                             className="form-control"
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={(e) => {
//                                                 const file = e.target.files?.[0];

//                                                 if (file) {
//                                                     setImage(file);
//                                                     setPreview(URL.createObjectURL(file));
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="d-flex gap-2 mt-2">
//                                     <button
//                                         type="submit"
//                                         className="btn btn-primary rounded-pill w-50"
//                                     >
//                                         Update
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-secondary rounded-pill w-50"
//                                         onClick={() => setPop(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {popUp && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center px-3"
//                     style={{
//                         zIndex: 1050,
//                         background: "rgba(0,0,0,0.55)"
//                     }}
//                 >
//                     <div
//                         className="bg-white rounded-4 shadow-lg p-4 w-100 overflow-auto"
//                         style={{
//                             maxWidth: 600,
//                             maxHeight: "90vh",
//                             scrollbarWidth: "none"
//                         }}
//                     >
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <h4 className="fw-bold mb-0">Become a Restaurant</h4>
//                             <button
//                                 type="button"
//                                 className="btn-close"
//                                 onClick={() => setPopUp(false)}
//                             ></button>
//                         </div>

//                         <form onSubmit={createRestaurant}>
//                             <div className="d-flex flex-column gap-3">
//                                 <div>
//                                     <label className="form-label fw-semibold">Restaurant Name</label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="name"
//                                         value={restaurantName}
//                                         onChange={handleCreateRestaurant}
//                                         placeholder="Enter restaurant name"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="description"
//                                         value={description}
//                                         onChange={handleCreateRestaurant}
//                                         placeholder="Enter restaurant description"
//                                         rows="3"
//                                         required
//                                     ></textarea>
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Email</label>
//                                         <input
//                                             className="form-control"
//                                             type="email"
//                                             name="email"
//                                             value={restaurantEmail}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="Restaurant email"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Phone</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="phone"
//                                             value={phone}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="Restaurant phone"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Address</label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="address"
//                                         value={restaurantAddress}
//                                         onChange={handleCreateRestaurant}
//                                         placeholder="Restaurant address"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">City</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="city"
//                                             value={city}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="City"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">State</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="state"
//                                             value={restaurantState}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="State"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Pincode</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="pincode"
//                                             value={restaurantPincode}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="Pincode"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Location</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="location"
//                                             value={location}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="Nearby location"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Opening Time</label>
//                                         <input
//                                             className="form-control"
//                                             type="time"
//                                             name="openingTime"
//                                             value={openingTime}
//                                             onChange={handleCreateRestaurant}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-6">
//                                         <label className="form-label fw-semibold">Closing Time</label>
//                                         <input
//                                             className="form-control"
//                                             type="time"
//                                             name="closingTime"
//                                             value={closingTime}
//                                             onChange={handleCreateRestaurant}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row g-3">
//                                     <div className="col-md-4">
//                                         <label className="form-label fw-semibold">Delivery Fee</label>
//                                         <input
//                                             className="form-control"
//                                             type="number"
//                                             name="deliveryFee"
//                                             value={deliveryFee}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="₹0"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-4">
//                                         <label className="form-label fw-semibold">Minimum Order</label>
//                                         <input
//                                             className="form-control"
//                                             type="number"
//                                             name="minimumOrder"
//                                             value={minimumOrder}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="₹0"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-4">
//                                         <label className="form-label fw-semibold">Delivery Time</label>
//                                         <input
//                                             className="form-control"
//                                             type="text"
//                                             name="deliveryTime"
//                                             value={deliveryTime}
//                                             onChange={handleCreateRestaurant}
//                                             placeholder="30-40 min"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Restaurant Banner</label>

//                                     <div className="d-flex align-items-center gap-3">
//                                         <img
//                                             src={restaurantPreview}
//                                             alt="Restaurant Banner"
//                                             className="rounded-3"
//                                             style={{
//                                                 width: 80,
//                                                 height: 60,
//                                                 objectFit: "cover"
//                                             }}
//                                         />

//                                         <input
//                                             className="form-control"
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={(e) => {
//                                                 const file = e.target.files?.[0];

//                                                 if (file) {
//                                                     setResImage(file);
//                                                     setRestaurantPreview(URL.createObjectURL(file));
//                                                 }
//                                             }}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="form-label fw-semibold">Restaurant Logo</label>

//                                     <div className="d-flex align-items-center gap-3">
//                                         <img
//                                             src={restaurantLogo}
//                                             alt="Restaurant Logo"
//                                             className="rounded-circle"
//                                             style={{
//                                                 width: 65,
//                                                 height: 65,
//                                                 objectFit: "cover"
//                                             }}
//                                         />

//                                         <input
//                                             className="form-control"
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={(e) => {
//                                                 const file = e.target.files?.[0];

//                                                 if (file) {
//                                                     setLogoImage(file);
//                                                     setRestaurantLogo(URL.createObjectURL(file));
//                                                 }
//                                             }}
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="d-flex gap-2 mt-2">
//                                     <button
//                                         type="submit"
//                                         className="btn btn-primary rounded-pill w-50"
//                                     >
//                                         Create Restaurant
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-secondary rounded-pill w-50"
//                                         onClick={() => setPopUp(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <Footer />
//         </div>
//     );
// };






















import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";

import {
  GetAllUsers,
  GetSingleUser,
  logout,
  removeError,
  removeSuccess,
  UpdateProfile,
} from "../../Redux/UserSlice";

import { GetAllFoods } from "../../Redux/FoodSlice";
import { GetMyOrder, GetOrdersByAdmin } from "../../Redux/OrderSlice";
import { CreateRestaurant } from "../../Redux/RestaurantSlice";
import { GetUserReview } from "../../Redux/ReviewSlice";

import api from "../../api";
import toast from "react-hot-toast";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Users,
  Truck,
  Salad,
  Lock,
  LogOut,
  Edit2,
  Package,
  Heart,
  Star,
  IndianRupee,
  ClipboardList,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  ChefHat,
  ArrowRight,
  X,
  Store,
  MapPinned,
} from "lucide-react";

/* =====================================
   THEME
===================================== */

const colors = {
  bg: "#171717",
  card: "#242424",
  card2: "#2c2c2c",
  border: "#3a3a3a",
  text: "#ffffff",
  muted: "#a3a3a3",
  orange: "#f97316",
  orangeDark: "#ea580c",
};

/* =====================================
   STATUS
===================================== */

const STATUS_META = {
  pending: {
    label: "Pending",
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.13)",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.13)",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Preparing",
    color: "#c084fc",
    bg: "rgba(168,85,247,0.13)",
    icon: Package,
  },
  out: {
    label: "Out for delivery",
    color: "#38bdf8",
    bg: "rgba(14,165,233,0.13)",
    icon: Bike,
  },
  delivered: {
    label: "Delivered",
    color: "#4ade80",
    bg: "rgba(34,197,94,0.13)",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "#f87171",
    bg: "rgba(239,68,68,0.13)",
    icon: XCircle,
  },
};

const getStatusMeta = (status) => {
  return (
    STATUS_META[status?.toLowerCase()] || {
      label: status || "Processing",
      color: colors.muted,
      bg: "rgba(163,163,163,0.13)",
      icon: Truck,
    }
  );
};

/* =====================================
   REUSABLE COMPONENTS
===================================== */

const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`profile-card ${className}`}
    style={{
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="d-flex align-items-center gap-2 mb-3">
    <div
      className="d-flex align-items-center justify-content-center rounded-3"
      style={{
        width: 36,
        height: 36,
        background: "rgba(249,115,22,0.12)",
        color: colors.orange,
      }}
    >
      <Icon size={18} />
    </div>

    <div>
      <h6
        className="fw-bold mb-0"
        style={{ color: colors.text, fontSize: 15 }}
      >
        {title}
      </h6>

      {subtitle && (
        <small style={{ color: colors.muted, fontSize: 11 }}>
          {subtitle}
        </small>
      )}
    </div>
  </div>
);

const ActionButton = ({
  icon: Icon,
  children,
  onClick,
  danger = false,
}) => (
  <button
    type="button"
    className="profile-action btn w-100 d-flex align-items-center justify-content-between text-start"
    onClick={onClick}
    style={{
      background: danger
        ? "rgba(239,68,68,0.08)"
        : colors.card2,
      color: danger ? "#f87171" : colors.text,
      border: danger
        ? "1px solid rgba(239,68,68,0.25)"
        : `1px solid ${colors.border}`,
      borderRadius: 10,
      padding: "12px 13px",
      fontSize: 13,
      fontWeight: 600,
    }}
  >
    <span className="d-flex align-items-center gap-2">
      <Icon
        size={16}
        color={danger ? "#f87171" : colors.orange}
      />
      {children}
    </span>

    <ArrowRight size={14} color={colors.muted} />
  </button>
);

/* =====================================
   PROFILE
===================================== */

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    user,
    users,
    error,
    success,
    singleuser,
  } = useSelector((state) => state.user);

  const { food } = useSelector((state) => state.food);
  const { order, adminOrder } = useSelector((state) => state.order);

  const { success: restaurantSuccess } = useSelector(
    (state) => state.restaurant
  );

  const profileData = id ? singleuser : user;

  const [pop, setPop] = useState(false);
  const [popUp, setPopUp] = useState(false);

  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  const [restaurantPreview, setRestaurantPreview] = useState(
    "https://png.pngtree.com/png-clipart/20250601/original/pngtree-classic-restaurant-logo-with-cutlery-and-plate-png-image_21108177.png"
  );

  const [restaurantLogo, setRestaurantLogo] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  const [image, setImage] = useState(null);
  const [resImage, setResImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  const [userdata, setUser] = useState({
    name: "",
    email: "",
    phoneNo: "",
    state: "",
    address: "",
    country: "",
    pincode: "",
  });

  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    state: "",
    address: "",
    city: "",
    pincode: "",
    location: "",
    openingTime: "",
    closingTime: "",
    deliveryFee: "",
    minimumOrder: "",
    deliveryTime: "",
  });

  const {
    name,
    email,
    phoneNo,
    state: userState,
    address,
    country,
    pincode,
  } = userdata;

  const {
    name: restaurantName,
    description,
    email: restaurantEmail,
    phone,
    state: restaurantState,
    address: restaurantAddress,
    city,
    pincode: restaurantPincode,
    location,
    openingTime,
    closingTime,
    deliveryFee,
    minimumOrder,
    deliveryTime,
  } = restaurant;

  /* =====================================
     EFFECTS
  ===================================== */

  useEffect(() => {
    if (id) {
      dispatch(GetSingleUser(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user && !id) {
      setUser({
        name: user?.name || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        state: user?.state || "",
        country: user?.country || "",
        pincode: user?.pincode || "",
      });

      setPreview(
        user?.image?.url ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      );
    }
  }, [user, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      setPop(false);
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (restaurantSuccess) {
      setPopUp(false);
      dispatch(removeSuccess());
    }
  }, [restaurantSuccess, dispatch]);

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      dispatch(GetAllUsers());
      dispatch(GetOrdersByAdmin());
      dispatch(GetAllFoods());
    }

    if (user.role === "customer") {
      dispatch(GetMyOrder());
    }

    if (user.role === "restaurant") {
      dispatch(GetAllFoods());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (user?.role === "customer") {
      dispatch(GetUserReview());
    }
  }, [dispatch, user?.role]);

  /* =====================================
     HELPERS
  ===================================== */

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e) => {
    setUser({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateRestaurant = (e) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });
  };

  const updateNow = (e) => {
    e.preventDefault();

    const myform = new FormData();

    myform.set("name", name);
    myform.set("email", email);
    myform.set("phoneNo", phoneNo);
    myform.set("address", address);
    myform.set("state", userState);
    myform.set("country", country);
    myform.set("pincode", pincode);

    if (image) {
      myform.set("image", image);
    }

    dispatch(UpdateProfile(myform));
  };

  const createRestaurant = (e) => {
    e.preventDefault();

    const myform = new FormData();

    myform.set("name", restaurantName);
    myform.set("description", description);
    myform.set("email", restaurantEmail);
    myform.set("phone", phone);
    myform.set("address", restaurantAddress);
    myform.set("city", city);
    myform.set("state", restaurantState);
    myform.set("pincode", restaurantPincode);
    myform.set("location", location);
    myform.set("openingTime", openingTime);
    myform.set("closingTime", closingTime);
    myform.set("deliveryFee", deliveryFee);
    myform.set("minimumOrder", minimumOrder);
    myform.set("deliveryTime", deliveryTime);

    if (resImage) {
      myform.set("banner", resImage);
    }

    if (logoImage) {
      myform.set("logo", logoImage);
    }

    dispatch(CreateRestaurant(myform));
  };

  const logoutUser = async () => {
    try {
      await api.post(
        "/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log("Logout API failed:", err);
    }

    dispatch(logout());
    navigate("/");
  };

  const recentOrders = [...(order || [])]
    .sort(
      (a, b) =>
        new Date(b?.createdAt || 0) -
        new Date(a?.createdAt || 0)
    )
    .slice(0, 4);

  const availableUsers = (users || []).filter(
    (item) => item.role !== "admin"
  );

  const totalSpent = (order || []).reduce(
    (sum, item) => sum + (Number(item?.totalAmount) || 0),
    0
  );

  const pendingOrders = (adminOrder || []).filter(
    (item) =>
      item?.orderStatus !== "Delivered" &&
      item?.orderStatus !== "Cancelled"
  ).length;

  /* =====================================
     FORM STYLES
  ===================================== */

  const inputStyle = {
    background: colors.card2,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    borderRadius: 10,
    fontSize: 13,
    padding: "11px 13px",
  };

  const labelStyle = {
    color: colors.muted,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 7,
  };

  const FormInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
  }) => (
    <div>
      <label className="form-label" style={labelStyle}>
        {label}
      </label>

      <input
        className="form-control shadow-none"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  );

  const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
  }) => (
    <div>
      <label className="form-label" style={labelStyle}>
        {label}
      </label>

      <textarea
        className="form-control shadow-none"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        required={required}
        style={{ ...inputStyle, resize: "vertical" }}
      />
    </div>
  );

  const ImageUpload = ({
    label,
    previewImage,
    alt,
    circular = false,
    onChange,
    required = false,
  }) => (
    <div>
      <label className="form-label" style={labelStyle}>
        {label}
      </label>

      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div
          className="overflow-hidden flex-shrink-0"
          style={{
            width: circular ? 65 : 90,
            height: circular ? 65 : 65,
            borderRadius: circular ? "50%" : 10,
            background: colors.card2,
            border: `1px solid ${colors.border}`,
          }}
        >
          <img
            src={previewImage}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div className="flex-grow-1" style={{ minWidth: 150 }}>
          <input
            className="form-control shadow-none"
            type="file"
            accept="image/*"
            onChange={onChange}
            required={required}
            style={{
              ...inputStyle,
              padding: "8px 10px",
            }}
          />
        </div>
      </div>
    </div>
  );

  /* =====================================
     MAIN UI
  ===================================== */

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        color: colors.text,
      }}
    >
      <Navbar />

      <style>{`
        .profile-page {
          background: #171717;
          min-height: 80vh;
        }

        .profile-card {
          transition: transform 0.2s ease,
            border-color 0.2s ease;
        }

        .profile-card:hover {
          border-color: #f97316 !important;
          transform: translateY(-2px);
        }

        .profile-action {
          transition: background 0.2s ease,
            transform 0.2s ease;
        }

        .profile-action:hover {
          background: #3a2a20 !important;
          border-color: #f97316 !important;
          transform: translateX(3px);
        }

        .profile-primary:hover {
          background: linear-gradient(135deg, #f97316, #ea580c) !important;
          box-shadow: 0 8px 22px rgba(249,115,22,0.22);
        }

        .profile-page .form-control::placeholder {
          color: #737373 !important;
          opacity: 1;
        }

        .profile-page .form-control:focus {
          border-color: #f97316 !important;
          box-shadow: 0 0 0 0.15rem
            rgba(249,115,22,0.12) !important;
        }

        .profile-page .form-control[type="file"] {
          color: #a3a3a3;
        }

        .profile-page
          .form-control[type="file"]::file-selector-button {
          background: #3a3a3a;
          color: #ffffff;
          border: 0;
          border-radius: 7px;
          padding: 7px 10px;
          margin-right: 10px;
          font-size: 11px;
        }

        .profile-modal {
          animation: profileFade 0.2s ease;
        }

        .profile-modal-content {
          animation: profileSlide 0.25s ease;
        }

        @keyframes profileFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes profileSlide {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          .profile-page .container-fluid {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .profile-header {
            padding: 20px 16px !important;
          }

          .profile-avatar {
            width: 82px !important;
            height: 82px !important;
            font-size: 23px !important;
          }

          .profile-heading {
            font-size: 20px !important;
          }

          .profile-card-body {
            padding: 16px !important;
          }

          .profile-stat-value {
            font-size: 21px !important;
          }

          .profile-order-row {
            align-items: flex-start !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-card,
          .profile-action,
          .profile-modal,
          .profile-modal-content {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="profile-page">
        <div className="container-fluid px-3 px-md-4 py-4 py-md-5">
          <div className="container">
            {/* TOP BAR */}

            <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
              <div>
                <div
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{
                    color: colors.orange,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: colors.orange,
                    }}
                  />
                  ACCOUNT
                </div>

                <h2
                  className="fw-bold mb-1"
                  style={{
                    color: colors.text,
                    fontSize: "clamp(22px, 4vw, 28px)",
                    letterSpacing: "-0.6px",
                  }}
                >
                  My Profile
                </h2>

                <p
                  className="mb-0"
                  style={{ color: colors.muted, fontSize: 12 }}
                >
                  Manage your account
                </p>
              </div>

              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <ShieldCheck size={18} color={colors.orange} />
              </div>
            </div>

            {/* PROFILE HEADER */}

            <Card className="mb-4" style={{ overflow: "hidden" }}>
              <div
                className="profile-header d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 p-4"
                style={{
                  background:
                    "linear-gradient(110deg, #2b211a, #242424 65%)",
                }}
              >
                <div
                  className="profile-avatar rounded-circle overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 92,
                    height: 92,
                    border: "2px solid rgba(249,115,22,0.65)",
                    background: colors.orange,
                    color: "#ffffff",
                    fontSize: 26,
                    fontWeight: 700,
                  }}
                >
                  {profileData?.image?.url ? (
                    <img
                      src={profileData.image.url}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    getInitials(profileData?.name)
                  )}
                </div>

                <div className="flex-grow-1 text-center text-md-start">
                  <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-md-start gap-2">
                    <h3
                      className="profile-heading mb-0 fw-bold"
                      style={{
                        color: colors.text,
                        fontSize: 22,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {profileData?.name || "User"}
                    </h3>

                    {profileData?.role && (
                      <span
                        className="badge rounded-pill d-flex align-items-center gap-1"
                        style={{
                          background: "rgba(249,115,22,0.14)",
                          color: "#fb923c",
                          border: "1px solid rgba(249,115,22,0.25)",
                          fontSize: 9,
                          padding: "6px 10px",
                        }}
                      >
                        <ShieldCheck size={11} />
                        {profileData.role}
                      </span>
                    )}
                  </div>

                  <p
                    className="mb-2 mt-1"
                    style={{ color: colors.muted, fontSize: 12 }}
                  >
                    Welcome back! Your account at a glance.
                  </p>

                  <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-md-start gap-2 gap-sm-3">
                    <span
                      className="d-flex align-items-center gap-1"
                      style={{ color: colors.muted, fontSize: 11 }}
                    >
                      <Mail size={13} color={colors.orange} />
                      {profileData?.email || "—"}
                    </span>

                    <span
                      className="d-flex align-items-center gap-1"
                      style={{ color: colors.muted, fontSize: 11 }}
                    >
                      <Phone size={13} color={colors.orange} />
                      {profileData?.phoneNo
                        ? `+91 ${profileData.phoneNo}`
                        : "—"}
                    </span>
                  </div>
                </div>

                {!id && (
                  <button
                    className="btn profile-primary rounded-pill px-4 fw-semibold d-flex align-items-center gap-2 flex-shrink-0"
                    onClick={() => setPop(true)}
                    style={{
                      background: colors.orange,
                      color: "#ffffff",
                      border: "none",
                      fontSize: 12,
                      padding: "11px 16px",
                    }}
                  >
                    <Edit2 size={14} />
                    Edit Profile
                  </button>
                )}
              </div>
            </Card>

            {/* PROFILE DETAILS + ACTIONS */}

            <div className="row g-3 g-md-4">
              <div className="col-12 col-lg-7">
                <Card className="h-100">
                  <div className="profile-card-body p-4">
                    <SectionHeading
                      icon={Users}
                      title="Personal Details"
                      subtitle="Your account information"
                    />

                    {[
                      {
                        label: "Full Name",
                        value: profileData?.name,
                        icon: Users,
                      },
                      {
                        label: "Email",
                        value: profileData?.email,
                        icon: Mail,
                      },
                      {
                        label: "Phone",
                        value: profileData?.phoneNo
                          ? `+91 ${profileData.phoneNo}`
                          : "—",
                        icon: Phone,
                      },
                      {
                        label: "Address",
                        value: profileData?.address,
                        icon: MapPin,
                      },
                      {
                        label: "Joined",
                        value: profileData?.createdAt
                          ? new Date(
                              profileData.createdAt
                            ).toLocaleDateString()
                          : "—",
                        icon: Calendar,
                      },
                    ].map(({ label, value, icon: Icon }, index, arr) => (
                      <div
                        key={label}
                        className="d-flex align-items-center gap-3 py-3"
                        style={{
                          borderBottom:
                            index !== arr.length - 1
                              ? `1px solid ${colors.border}`
                              : "none",
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                          style={{
                            width: 34,
                            height: 34,
                            background: colors.card2,
                            color: colors.orange,
                          }}
                        >
                          <Icon size={15} />
                        </div>

                        <div
                          className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-1 flex-grow-1"
                          style={{ minWidth: 0 }}
                        >
                          <span
                            style={{
                              color: colors.muted,
                              fontSize: 12,
                            }}
                          >
                            {label}
                          </span>

                          <span
                            className="fw-semibold text-sm-end"
                            style={{
                              color: colors.text,
                              fontSize: 13,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {value || "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="col-12 col-lg-5">
                {profileData?.role === "admin" && (
                  <Card className="h-100">
                    <div className="profile-card-body p-4">
                      <SectionHeading
                        icon={ShieldCheck}
                        title="Admin Overview"
                        subtitle="Platform summary"
                      />

                      <div
                        className="rounded-3 p-3 mb-3"
                        style={{
                          background:
                            "linear-gradient(110deg, #3b2414, #2a211c)",
                          border: "1px solid rgba(249,115,22,0.18)",
                        }}
                      >
                        <div
                          className="fw-bold mb-1"
                          style={{ color: colors.text, fontSize: 13 }}
                        >
                          Platform Summary
                        </div>

                        <small style={{ color: colors.muted, fontSize: 11 }}>
                          Monitor users, food and orders.
                        </small>
                      </div>

                      <div className="row g-2">
                        {[
                          {
                            icon: Users,
                            value: availableUsers.length,
                            label: "Customers",
                          },
                          {
                            icon: Salad,
                            value: food?.length || 0,
                            label: "Food Items",
                          },
                          {
                            icon: Package,
                            value: adminOrder?.length || 0,
                            label: "Orders",
                          },
                          {
                            icon: Clock,
                            value: pendingOrders,
                            label: "Active Orders",
                          },
                        ].map(({ icon: Icon, value, label }) => (
                          <div className="col-6" key={label}>
                            <div
                              className="rounded-3 p-3 text-center h-100"
                              style={{
                                background: colors.card2,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              <Icon
                                size={19}
                                color={colors.orange}
                                className="mb-2"
                              />

                              <h5
                                className="fw-bold mb-1"
                                style={{
                                  color: colors.text,
                                  fontSize: 22,
                                }}
                              >
                                {value}
                              </h5>

                              <small
                                style={{
                                  color: colors.muted,
                                  fontSize: 10,
                                }}
                              >
                                {label}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {profileData?.role === "customer" && (
                  <Card className="h-100">
                    <div className="profile-card-body p-4">
                      <SectionHeading
                        icon={Store}
                        title="Account Menu"
                        subtitle="Everything you need"
                      />

                      <div className="d-flex flex-column gap-2">
                        <ActionButton
                          icon={Edit2}
                          onClick={() => setPop(true)}
                        >
                          Edit Profile
                        </ActionButton>

                        <ActionButton
                          icon={Package}
                          onClick={() => navigate("/myorder")}
                        >
                          My Orders
                        </ActionButton>

                        <ActionButton
                          icon={MapPinned}
                          onClick={() =>
                            toast("Address management coming soon")
                          }
                        >
                          Manage Addresses
                        </ActionButton>

                        <ActionButton
                          icon={Lock}
                          onClick={() =>
                            toast("Password management coming soon")
                          }
                        >
                          Change Password
                        </ActionButton>

                        <ActionButton
                          icon={ChefHat}
                          onClick={() => setPopUp(true)}
                        >
                          Become a Restaurant
                        </ActionButton>

                        <ActionButton
                          icon={LogOut}
                          danger
                          onClick={logoutUser}
                        >
                          Logout
                        </ActionButton>
                      </div>
                    </div>
                  </Card>
                )}

                {profileData?.role === "restaurant" && (
                  <Card className="h-100">
                    <div className="profile-card-body p-4">
                      <SectionHeading
                        icon={ChefHat}
                        title="Restaurant Menu"
                        subtitle="Manage your restaurant"
                      />

                      <div className="d-flex flex-column gap-2">
                        <ActionButton
                          icon={ChefHat}
                          onClick={() =>
                            navigate("/restaurant/dashboard")
                          }
                        >
                          Dashboard
                        </ActionButton>

                        <ActionButton
                          icon={Salad}
                          onClick={() => navigate("/restaurant/menu")}
                        >
                          Manage Menu
                        </ActionButton>

                        <ActionButton
                          icon={Package}
                          onClick={() => navigate("/restaurant/orders")}
                        >
                          Orders
                        </ActionButton>

                        <ActionButton
                          icon={Star}
                          onClick={() => navigate("/restaurant/reviews")}
                        >
                          Reviews
                        </ActionButton>

                        <ActionButton
                          icon={LogOut}
                          danger
                          onClick={logoutUser}
                        >
                          Logout
                        </ActionButton>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* CUSTOMER STATISTICS */}

              {profileData?.role === "customer" && (
                <>
                  <div className="col-12">
                    <SectionHeading
                      icon={ClipboardList}
                      title="Your Activity"
                      subtitle="Your food delivery statistics"
                    />

                    <div className="row g-3">
                      {[
                        {
                          icon: Package,
                          value: order?.length || 0,
                          label: "Total Orders",
                        },
                        {
                          icon: Heart,
                          value: 0,
                          label: "Favorites",
                        },
                        {
                          icon: IndianRupee,
                          value: `₹${totalSpent}`,
                          label: "Total Spent",
                        },
                      ].map(({ icon: Icon, value, label }) => (
                        <div className="col-6 col-md-4" key={label}>
                          <Card className="h-100">
                            <div className="profile-card-body p-4 text-center">
                              <div
                                className="d-flex align-items-center justify-content-center mx-auto mb-2 rounded-3"
                                style={{
                                  width: 42,
                                  height: 42,
                                  background: "rgba(249,115,22,0.12)",
                                }}
                              >
                                <Icon size={20} color={colors.orange} />
                              </div>

                              <h4
                                className="profile-stat-value fw-bold mb-1"
                                style={{
                                  color: colors.text,
                                  fontSize: 25,
                                }}
                              >
                                {value}
                              </h4>

                              <small
                                style={{
                                  color: colors.muted,
                                  fontSize: 11,
                                }}
                              >
                                {label}
                              </small>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RECENT ORDERS */}

                  <div className="col-12">
                    <Card>
                      <div className="profile-card-body p-4">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <SectionHeading
                            icon={ClipboardList}
                            title="Recent Orders"
                            subtitle="Your latest orders"
                          />

                          {recentOrders.length > 0 && (
                            <button
                              className="btn rounded-pill flex-shrink-0"
                              onClick={() => navigate("/myorder")}
                              style={{
                                background: "rgba(249,115,22,0.1)",
                                color: colors.orange,
                                border: "1px solid rgba(249,115,22,0.2)",
                                fontSize: 11,
                                padding: "7px 12px",
                              }}
                            >
                              View All
                            </button>
                          )}
                        </div>

                        {recentOrders.length === 0 ? (
                          <div
                            className="text-center py-4 rounded-3"
                            style={{
                              background: colors.card2,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <ClipboardList
                              size={30}
                              color={colors.muted}
                              className="mb-2"
                            />

                            <div
                              style={{
                                color: colors.text,
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              No orders yet
                            </div>

                            <small
                              style={{
                                color: colors.muted,
                                fontSize: 11,
                              }}
                            >
                              Your recent orders will appear here.
                            </small>
                          </div>
                        ) : (
                          <div className="d-flex flex-column gap-2">
                            {recentOrders.map((o) => {
                              const meta = getStatusMeta(o?.orderStatus);
                              const StatusIcon = meta.icon;

                              const itemCount =
                                o?.orderItems?.length ??
                                o?.items?.length ??
                                o?.foodItems?.length ??
                                0;

                              const amount =
                                o?.totalAmount ??
                                o?.totalPrice ??
                                o?.amount;

                              return (
                                <div
                                  key={o?._id}
                                  className="profile-order-row d-flex align-items-center justify-content-between gap-3 p-3 rounded-3"
                                  style={{
                                    background: colors.card2,
                                    border: `1px solid ${colors.border}`,
                                  }}
                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <div
                                      className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                      style={{
                                        width: 42,
                                        height: 42,
                                        background: meta.bg,
                                        color: meta.color,
                                      }}
                                    >
                                      <StatusIcon size={18} />
                                    </div>

                                    <div>
                                      <div
                                        className="fw-semibold"
                                        style={{
                                          color: colors.text,
                                          fontSize: 12,
                                        }}
                                      >
                                        Order #
                                        {o?._id?.slice(-6) || "—"}
                                      </div>

                                      <small
                                        style={{
                                          color: colors.muted,
                                          fontSize: 10,
                                        }}
                                      >
                                        {o?.createdAt
                                          ? new Date(
                                              o.createdAt
                                            ).toLocaleDateString()
                                          : "—"}

                                        {itemCount
                                          ? ` · ${itemCount} item${
                                              itemCount > 1 ? "s" : ""
                                            }`
                                          : ""}
                                      </small>
                                    </div>
                                  </div>

                                  <div className="text-end">
                                    <span
                                      className="badge rounded-pill mb-1"
                                      style={{
                                        background: meta.bg,
                                        color: meta.color,
                                        fontSize: 9,
                                        padding: "5px 8px",
                                      }}
                                    >
                                      {meta.label}
                                    </span>

                                    {amount != null && (
                                      <div
                                        className="fw-bold"
                                        style={{
                                          color: colors.text,
                                          fontSize: 14,
                                        }}
                                      >
                                        ₹{amount}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          EDIT PROFILE MODAL
      ===================================== */}

      {pop && (
        <div
          className="profile-modal position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center px-3 py-3"
          style={{
            zIndex: 1050,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            className="profile-modal-content w-100 overflow-auto"
            style={{
              maxWidth: 550,
              maxHeight: "92vh",
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 18,
              scrollbarWidth: "none",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between p-4"
              style={{
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 38,
                    height: 38,
                    background: "rgba(249,115,22,0.12)",
                  }}
                >
                  <Edit2 size={18} color={colors.orange} />
                </div>

                <div>
                  <h4
                    className="fw-bold mb-0"
                    style={{ color: colors.text, fontSize: 18 }}
                  >
                    Edit Profile
                  </h4>

                  <small style={{ color: colors.muted, fontSize: 11 }}>
                    Update your account details
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center rounded-circle"
                onClick={() => setPop(false)}
                style={{
                  width: 32,
                  height: 32,
                  background: colors.card2,
                  border: `1px solid ${colors.border}`,
                  color: colors.muted,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={updateNow}>
              <div className="p-4 d-flex flex-column gap-3">
                <FormInput
                  label="Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />

                <FormInput
                  label="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter your email"
                />

                <FormInput
                  label="Phone"
                  name="phoneNo"
                  value={phoneNo}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />

                <FormInput
                  label="Address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />

                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="State"
                      name="state"
                      value={userState}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="Country"
                      name="country"
                      value={country}
                      onChange={handleChange}
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                <FormInput
                  label="Pincode"
                  name="pincode"
                  value={pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />

                <ImageUpload
                  label="Profile Image"
                  previewImage={preview}
                  alt="Profile Preview"
                  circular
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                <div className="row g-2 mt-2">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn profile-primary w-100 rounded-pill fw-semibold"
                      style={{
                        background: colors.orange,
                        color: "#ffffff",
                        border: "none",
                        padding: "11px",
                        fontSize: 12,
                      }}
                    >
                      Update Profile
                    </button>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      className="btn w-100 rounded-pill fw-semibold"
                      onClick={() => setPop(false)}
                      style={{
                        background: colors.card2,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        padding: "11px",
                        fontSize: 12,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================
          BECOME A RESTAURANT MODAL
      ===================================== */}

      {popUp && (
        <div
          className="profile-modal position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center px-3 py-3"
          style={{
            zIndex: 1050,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            className="profile-modal-content w-100 overflow-auto"
            style={{
              maxWidth: 600,
              maxHeight: "92vh",
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 18,
              scrollbarWidth: "none",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between p-4"
              style={{
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 38,
                    height: 38,
                    background: "rgba(249,115,22,0.12)",
                  }}
                >
                  <ChefHat size={19} color={colors.orange} />
                </div>

                <div>
                  <h4
                    className="fw-bold mb-0"
                    style={{ color: colors.text, fontSize: 18 }}
                  >
                    Become a Restaurant
                  </h4>

                  <small style={{ color: colors.muted, fontSize: 11 }}>
                    Register your restaurant
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center rounded-circle"
                onClick={() => setPopUp(false)}
                style={{
                  width: 32,
                  height: 32,
                  background: colors.card2,
                  border: `1px solid ${colors.border}`,
                  color: colors.muted,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={createRestaurant}>
              <div className="p-4 d-flex flex-column gap-3">
                <FormInput
                  label="Restaurant Name"
                  name="name"
                  value={restaurantName}
                  onChange={handleCreateRestaurant}
                  placeholder="Enter restaurant name"
                  required
                />

                <FormTextarea
                  label="Description"
                  name="description"
                  value={description}
                  onChange={handleCreateRestaurant}
                  placeholder="Enter restaurant description"
                  required
                />

                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="Email"
                      name="email"
                      value={restaurantEmail}
                      onChange={handleCreateRestaurant}
                      type="email"
                      placeholder="Restaurant email"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="Phone"
                      name="phone"
                      value={phone}
                      onChange={handleCreateRestaurant}
                      placeholder="Restaurant phone"
                      required
                    />
                  </div>
                </div>

                <FormInput
                  label="Address"
                  name="address"
                  value={restaurantAddress}
                  onChange={handleCreateRestaurant}
                  placeholder="Restaurant address"
                  required
                />

                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="City"
                      name="city"
                      value={city}
                      onChange={handleCreateRestaurant}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="State"
                      name="state"
                      value={restaurantState}
                      onChange={handleCreateRestaurant}
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="Pincode"
                      name="pincode"
                      value={restaurantPincode}
                      onChange={handleCreateRestaurant}
                      placeholder="Pincode"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="Location"
                      name="location"
                      value={location}
                      onChange={handleCreateRestaurant}
                      placeholder="Nearby location"
                      required
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="Opening Time"
                      name="openingTime"
                      value={openingTime}
                      onChange={handleCreateRestaurant}
                      type="time"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="Closing Time"
                      name="closingTime"
                      value={closingTime}
                      onChange={handleCreateRestaurant}
                      type="time"
                      required
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <FormInput
                      label="Delivery Fee"
                      name="deliveryFee"
                      value={deliveryFee}
                      onChange={handleCreateRestaurant}
                      type="number"
                      placeholder="₹0"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <FormInput
                      label="Minimum Order"
                      name="minimumOrder"
                      value={minimumOrder}
                      onChange={handleCreateRestaurant}
                      type="number"
                      placeholder="₹0"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <FormInput
                      label="Delivery Time"
                      name="deliveryTime"
                      value={deliveryTime}
                      onChange={handleCreateRestaurant}
                      placeholder="30-40 min"
                      required
                    />
                  </div>
                </div>

                <ImageUpload
                  label="Restaurant Banner"
                  previewImage={restaurantPreview}
                  alt="Restaurant Banner"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setResImage(file);
                      setRestaurantPreview(URL.createObjectURL(file));
                    }
                  }}
                  required
                />

                <ImageUpload
                  label="Restaurant Logo"
                  previewImage={restaurantLogo}
                  alt="Restaurant Logo"
                  circular
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setLogoImage(file);
                      setRestaurantLogo(URL.createObjectURL(file));
                    }
                  }}
                  required
                />

                <div className="row g-2 mt-2">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn profile-primary w-100 rounded-pill fw-semibold"
                      style={{
                        background: colors.orange,
                        color: "#ffffff",
                        border: "none",
                        padding: "11px",
                        fontSize: 12,
                      }}
                    >
                      Create Restaurant
                    </button>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      className="btn w-100 rounded-pill fw-semibold"
                      onClick={() => setPopUp(false)}
                      style={{
                        background: colors.card2,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        padding: "11px",
                        fontSize: 12,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};