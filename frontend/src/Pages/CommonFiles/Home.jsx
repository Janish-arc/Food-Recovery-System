import React, { useEffect } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { GetCategory } from '../../Redux/CategorySlice'
import { GetRestaurant } from '../../Redux/RestaurantSlice'
import { ImageSlider } from './ImageSlider';
import { GetAllFoods } from '../../Redux/FoodSlice'

export const Home = () => {

    const {user, isAuthenticated} = useSelector((state) => state.user)
    const {category} = useSelector((state) => state.category)
    const {food} = useSelector((state) => state.food)
    const {restaurants} = useSelector((state) => state.restaurant)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    const sortedRestaurants = [...restaurants].sort((a, b) => b.rating - a.rating);
    const sortedFoods = Array.isArray(food) ? [...food].sort((a, b) => b.rating - a.rating): [];
    const latestRestaurants = [...restaurants].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
        dispatch(GetCategory())
    }, [dispatch])

    useEffect(() => {
        dispatch(GetRestaurant())
    }, [dispatch])

    useEffect(() => {
        dispatch(GetAllFoods())
    }, [dispatch])

    useEffect(() => {
    if (location.state?.scrollTo) {
        const section = document.getElementById(location.state.scrollTo);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }
    }, [location]);

  return (
    <>
        <Navbar/>
        <div className='home pb-4'>
            <div className='container-fluid' style={{objectFit:"contain"}}>
                    <ImageSlider/>
                </div> 
            <div className='container-fluid pt-4'>

                {/* Category Section */}
                <div className='mt-4 container'  id="categories">
                    {isAuthenticated && 
                    <h4 className='fw-bold fs-3'>{user?.name}, Find Your Favourite . . </h4>
                    }
                    <div className='d-flex gap-4 my-3 overflow-x-auto' style={{scrollbarWidth: "none"}}>
                        {category?.map((item) => (
                            <div  key={item._id} className='text-center' onClick={() => navigate(`/category/${item._id}`)}>                   
                                <img src={item?.image?.url} alt={item.name} className='rounded-circle' style={{width: "clamp(70px, 18vw, 120px)", height: "clamp(70px, 18vw, 120px)", objectFit: "cover"}}/>
                                <h6 className='mt-2 text-truncate'>{item.name}</h6>
                            </div>
                        ))}
                    </div>
                    <hr />
                </div>

                {/* Restaurant Section */}
                <div className='container' id="restaurants">
                <div className="row g-4 ">
                    <h4 className="fw-bold fs-4">Recommended for You</h4>
                    {restaurants?.map((item) => (
                        <div className="col-6 col-md-4 col-lg-3 overflow-x-auto" style={{scrollbarWidth: "none"}} key={item._id} onClick={() => navigate(`/restaurantdetails/${item._id}`)}>
                            <div className="h-100 food">
                                <img src={item.banner.url} alt={item.name} className="img-fluid shadow w-100" style={{height: "clamp(150px, 18vw, 230px)", objectFit: "cover", borderRadius: "15px"}}/>
                                <h6 className="fw-bold mt-2 ms-2 text-truncate">{item.name}</h6>
                                <div className="d-flex align-items-center gap-3 ms-2">
                                    <h6 className="fw-semibold mb-0">⭐ {item.rating} ({item.totalReviews} reviews)</h6>
                                    <h6 className="text-muted mb-0">{item.deliveryTime}</h6>
                                </div>
                                <h6 className="text-muted mt-2 ms-2 text-truncate"><small>{item.foods ?.slice(0, 3).map((food) => food.name).join(",")}</small></h6>
                            </div>
                        </div>
                    ))}
                </div>
                <hr />
                </div>

                {/* Top Rated Restaurants */}
                <div className='container' id="Top-restaurants">
                <div className='row g-4 '>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className='fw-bold fs-4'>Customer Favourites</h4>
                        <button className="btn btn-outline-primary rounded-pill" onClick={() => navigate("/all/restaurants")}>See All</button>
                    </div>
                    {sortedRestaurants?.map((item) => (
                        <div className="col-6 col-md-4 col-lg-3 overflow-x-auto" style={{scrollbarWidth: "none"}} key={item._id} onClick={() => navigate(`/restaurantdetails/${item._id}`)}>
                            <div className="h-100 food">
                                <img src={item.banner.url} alt={item.name} className="img-fluid shadow w-100" style={{height: "clamp(150px, 18vw, 230px)", objectFit: "cover", borderRadius: "15px"}}/>
                                <h6 className="fw-bold mt-2 ms-2 text-truncate">{item.name}</h6>
                                <div className="d-flex align-items-center gap-3 ms-2">
                                    <h6 className="fw-semibold mb-0">⭐ {item.rating} ({item.totalReviews} reviews)</h6>
                                    <h6 className="text-muted mb-0">{item.deliveryTime}</h6>
                                </div>
                                <h6 className="text-muted mt-2 ms-2 text-truncate">{item.foods ?.slice(0, 3).map((food) => food.name).join(",")}</h6>
                            </div>
                        </div>
                    ))}
                </div>
                <hr />
                </div>

                {/* Popular Dishes */}
                <div className='container ' id="popular">
                <div className="row g-4 mb-2 ">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className='fw-bold fs-4'>Popular dishes</h4>
                        <button className="btn btn-outline-primary rounded-pill" onClick={() => navigate("/all/foods")}>See All</button>
                    </div>
                    {sortedFoods?.map((item) => (
                        <div className="col-6 col-md-4 col-lg-3 overflow-x-auto" style={{scrollbarWidth: "none"}} key={item._id} onClick={() => navigate(`/fooddetails/${item._id}`)}>
                            <div className="h-100 food shadow overflow-x-auto" style={{scrollbarWidth: "none"}}>
                                <img src={item.image.url} alt={item.name} className="img-fluid w-100 " style={{height: "clamp(150px, 18vw, 180px)", objectFit: "cover", borderRadius:"10px 10px 0px 0px"}}/>
                                <h6 className='fw-bold  text-truncate mt-2 ms-3'>{item.name}</h6>
                                <div className="d-flex justify-content-between align-items-center ms-3">
                                    <h6 className='fw-semibold'>⭐ {item.rating} ({item.totalReviews} reviews)</h6>
                                    <h6 className='pe-3'>₹{item.price}</h6>
                                </div>
                                <div className='d-flex justify-content-end m-2'>
                                    <button className="btn btn-warning w-50 btn-sm"> Add to Cart</button>
                                </div>
                         
                            </div>
                        </div>
                    ))}
                </div>
                <hr className='mt-4'/>
                </div>

                {/* Todays Offer */}
                <div className="container mt-4"  id="offer">
                    <h4 className="fw-bold mb-3">🔥 Today's Offers</h4>

                    <div className="row g-3">
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="offer-card p-3 h-100 text-center">
                                <h6 className="fw-bold mb-2">🎉 ₹100 OFF</h6>
                                <p className="mb-3 small text-muted">
                                    On your first order above ₹499
                                </p>
                                <button className="btn btn-warning btn-sm rounded-pill px-3">
                                    Order Now
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="offer-card p-3 h-100 text-center">
                                <h6 className="fw-bold mb-2">🍔 Buy 1 Get 1</h6>
                                <p className="mb-3 small text-muted">
                                    Available on selected restaurants
                                </p>
                                <button className="btn btn-warning btn-sm rounded-pill px-3">
                                    Explore
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="offer-card p-3 h-100 text-center">
                                <h6 className="fw-bold mb-2">🚚 Free Delivery</h6>
                                <p className="mb-3 small text-muted">
                                    Orders above ₹299
                                </p>
                                <button className="btn btn-warning btn-sm rounded-pill px-3">
                                    Grab Offer
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr />

                </div>
                
                {/* New */}
                <div className="container mt-5" id="new">
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="fw-bold">🆕 New on Recupy</h3>
                    <button className="btn btn-outline-primary rounded-pill">See More</button>
                </div>
                <div className="row g-4 mt-1">
                    {latestRestaurants?.map((item) => (
                        <div className="col-6 col-md-4 col-lg-3 overflow-x-auto" style={{scrollbarWidth: "none"}} key={item._id} onClick={() => navigate(`/restaurantdetails/${item._id}`)}>
                            <div className="h-100 food">
                                <img src={item.banner.url} alt={item.name} className="img-fluid shadow w-100" style={{height: "clamp(150px, 18vw, 230px)", objectFit: "cover", borderRadius: "15px"}}/>
                                <h6 className="fw-bold fs-5 mt-2 ms-2 text-truncate">{item.name}</h6>
                                <div className="d-flex align-items-center gap-3 ms-2">
                                    <h6 className="fw-semibold mb-0">⭐ {item.rating} ({item.totalReviews} reviews)</h6>
                                    <h6 className="text-muted mb-0">{item.deliveryTime}</h6>
                                </div>
                                <h6 className="text-muted mt-2 ms-2 text-truncate">{item.foods ?.slice(0, 3).map((food) => food.name).join(",")}</h6>
                            </div>
                        </div>
                    ))}
                </div>
                 <hr />
                </div>
               


                {/* Choose Recupy */}
                <div className="container my-5">
                <h3 className="fw-bold text-center mb-3">Why Choose Recupy?</h3>
                <div className="row g-4 ">
                    <div className="col-6 col-md-3 ">
                        <div className="feature-card text-center p-4">
                            <div className="feature-icon">🚀</div>
                            <h6 className="mt-3">Fast Delivery</h6>
                            <p className="text-muted">Get food delivered in minutes.</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 ">
                        <div className="feature-card text-center p-4">
                            <div className="feature-icon">🥗</div>
                            <h6 className="mt-3">Fresh Food</h6>
                            <p className="text-muted">Prepared fresh every day.</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 ">
                        <div className="feature-card text-center p-4">
                            <div className="feature-icon">⭐</div>
                            <h6 className="mt-3">Top Restaurants</h6>
                            <p className="text-muted">Thousands of trusted partners.</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 ">
                        <div className="feature-card text-center p-4">
                            <div className="feature-icon">💳</div>
                                <h6 className="mt-3">Secure Payments</h6>
                                <p className="text-muted">100% safe online transactions</p>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>

        <Footer/>
    </>
    
  )
}