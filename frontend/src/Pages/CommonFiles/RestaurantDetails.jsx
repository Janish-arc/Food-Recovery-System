import React, { useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock3,
  MapPin,
  Star,
  Search,
} from "lucide-react";

import Banner from "../../assets/banner1.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleRestaurant } from "../../Redux/RestaurantSlice";
import { GetRestaurantFoods } from "../../Redux/FoodSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { GetCategory } from "../../Redux/CategorySlice";
import { CreateCart } from "../../Redux/CartSlice";
import { BsGeoAltFill } from "react-icons/bs";

export const RestaurantDetails = () => {

    const {restaurant} = useSelector((state) => state.restaurant)
    const {restaurantfood} = useSelector((state) => state.food)
    const {category} = useSelector((state) => state.category)
    const {cart} = useSelector((state) => state.cart)
    const {isAuthenticated} = useSelector((state) => state.user)

    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
//   const menu = [
//     {
//       id: 1,
//       name: "Chicken Biryani",
//       price: 220,
//       rating: 4.8,
//       image: Banner,
//       desc: "Aromatic basmati rice with spicy chicken.",
//     },
//     {
//       id: 2,
//       name: "Paneer Butter Masala",
//       price: 180,
//       rating: 4.6,
//       image: Banner,
//       desc: "Creamy paneer cooked in rich tomato gravy.",
//     },
//     {
//       id: 3,
//       name: "Masala Dosa",
//       price: 120,
//       rating: 4.7,
//       image: Banner,
//       desc: "South Indian crispy dosa served with chutney.",
//     },
//   ];

    useEffect(() => {
        dispatch(GetSingleRestaurant(id))
        dispatch(GetRestaurantFoods(id))
        dispatch(GetCategory())
    }, [dispatch, id])

    const Createcart = (menuItem) => {
        dispatch(CreateCart({
            menuItem,
            quantity: 1,
        })).then(() => navigate("/cart"));
    }

  
    return (
        <>
            <Navbar/>
            {isAuthenticated ? (
            <div className="home"> 
                <div className="container py-4">

                    {/* Search bar */}
                    <div className="input-group my-4">
                        <span className="input-group-text bg-white"><Search size={18} /></span>
                        <input type="text" className="form-control py-2" placeholder="Search for dishes..."/>
                    </div>

                    {/* Banner */}
                    <div className="position-relative">
                        <img src={restaurant?.banner?.url} className="w-100 rounded-4" style={{height: "clamp(180px,30vw,320px)", objectFit: "cover"}}/>
                        <button className="btn btn-light rounded-circle position-absolute" style={{ top: 20, left: 20 }}><ArrowLeft size={20} /></button>
                        <div className="position-absolute d-flex gap-2" style={{ top: 20, right: 20 }}>
                            <button className="btn btn-light rounded-circle"><Heart size={18} /></button>
                            <button className="btn btn-light rounded-circle"> <Share2 size={18} /></button>
                        </div>
                    </div>

                    {/* Category */}
                    <h6 className="mt-4 fw-bold ms-3">Categories</h6>
                    <div className="d-flex gap-2 overflow-x-auto mb-4 p-3 shadow rounded-pill border border-black " style={{ scrollbarWidth: "none" }}>
                        {category?.map((cat) => (
                        <button key={cat._id} className="btn btn-warning rounded-pill text-truncate flex-shrink-0" style={{width: "clamp(80px, 12vw, 100px)", height:"40px"}}>{cat?.name}</button>
                        ))}
                    </div>

                    {/* Restaurant Details */}
                    <div className="shadow rounded-4 bg-white p-4 mt-4">
                        <div className="d-flex justify-content-between gap-2 flex-wrap">
                            <div>
                                <h2 className="fw-bold">{restaurant.name}</h2>
                                <p className="text-muted mb-2">{restaurant.foods ?.slice(0, 3).map((food) => food.name).join(",")}</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-success text-white rounded p-2" style={{ width: 70 }}>
                                {restaurant.rating} ⭐ 
                                </div>
                                <small>{restaurant.totalReviews} Reviews</small>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-1">
                            <span><BsGeoAltFill className="text-danger fs-5"/> {restaurant.address}, {restaurant.city}</span>
                            <span>🕒 {restaurant?.deliveryTime}</span>
                            </div>
                    </div>

                    {/* Offers */}
                    <div className="mt-4">
                        <h4 className="fw-bold mb-3"> Offers</h4>
                        <div className="d-flex gap-3 overflow-auto pb-2" style={{ scrollbarWidth: "none" }}>
                            <div className="border rounded-4 p-3 bg-warning-subtle">🎉 ₹100 OFF</div>
                            <div className="border rounded-4 p-3 bg-danger-subtle">🍔 Buy 1 Get 1</div>
                            <div className="border rounded-4 p-3 bg-success-subtle">🚚 Free Delivery</div>
                        </div>
                    </div>

                    {/* Foods */}
                    <h3 className="fw-bold mb-1"> Recommended</h3>
                    {restaurantfood.map((food) => (
                    <div key={food._id} className="shadow-sm rounded-4 p-3 mb-3">
                        <div className="row align-items-center">
                            <div className="col-12 col-sm-4 col-lg-2 text-center">
                                <img src={food?.image?.url} className="rounded-4 mb-2 me-2 " style={{width:"90%", height: "150px", objectFit: "cover",}}/>
                            </div>
                            <div className="col-12 col-sm-8 col-lg-10">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex gap-2 ">
                                        <h5 className="fw-bold">{food?.name}</h5><span> ({food?.category?.name})</span> 
                                    </div>
                                    <h6 className="text-success fs-4 me-2"> ₹ {food?.price} </h6>
                                </div>
                                <div className="d-flex justify-content-between align-items-end mt-3">
                                    <div className="flex-grow-1 pe-3">
                                        <div className="mb-2">⭐ {food?.rating}</div>
                                        <small className="text-secondary">{food?.description}</small>
                                    </div>
                                    <button className="btn btn-warning rounded-pill px-4 fw-semibold shadow-sm" style={{minWidth: "130px",height: "45px"}} onClick={() => Createcart(food._id)}><i className="bi bi-cart-plus me-2"></i>Add</button>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                    ))}

                    <div className="position-fixed bottom-0 mb-4 start-50 translate-middle-x shadow-lg bg-warning rounded-pill px-4 py-3 d-flex justify-content-between align-items-center" style={{width: "min(550px,95%)", zIndex: 999,}}>
                        <div>
                            <h6 className="mb-0 fw-bold">{cart?.items?.length} Items</h6>
                            ₹ {cart?.subtotal}

                        </div>
                        <button className="btn btn-dark rounded-pill" onClick={() => navigate("/cart")}> View Cart → </button>
                    </div>
                </div>
            </div>
            ) : (
            <>
                <div className="home">
                    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                        <div className="p-5 shadow bg-white rounded d-flex flex-column align-items-center">
                            <h4>Please Login to access</h4>
                            <button className="btn btn-primary rounded mt-3" onClick={() => navigate('/login')}>LOGIN</button>
                        </div>
                    </div>
                </div>
            </>    
            )
            }
            <Footer/>
        </>
    );
};


    