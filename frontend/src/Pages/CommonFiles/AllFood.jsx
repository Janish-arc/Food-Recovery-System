import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFoods } from "../../Redux/FoodSlice";
import { useNavigate } from "react-router-dom";
import {Search,Star,X,ChevronLeft,ChevronRight,Flame} from "lucide-react";
import { GetRestaurant } from "../../Redux/RestaurantSlice";
import { CreateCart } from "../../Redux/CartSlice";
import toast from "react-hot-toast";

export const AllFood = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { food } = useSelector((state) => state.food);
    const { restaurants } = useSelector((state) => state.restaurant)
    const { success } = useSelector((state) => state.cart)
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const foodsPerPage = 8;
    useEffect(() => {
        dispatch(GetAllFoods());
    }, [dispatch]);

    useEffect(() => {
        if (food) {
            setIsLoading(false);
        }
    }, [food]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sort]);

    const filteredFoods = useMemo(() => {
        let data = [...(food || [])];
        if (search.trim()) {
            data = data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()));
        }
        switch (sort) {
            case "rating":
                data.sort((a, b) => b.rating - a.rating);
                break;
            case "priceLow":
                data.sort((a, b) => a.price - b.price);
                break;
            case "priceHigh":
                data.sort((a, b) => b.price - a.price);
                break;
            case "new":
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "az":
                data.sort((a, b) =>a.name.localeCompare(b.name));
                break;
            default:
                break;
        }
        return data;
    }, [food, search, sort]);

    const lastFood = currentPage * foodsPerPage;
    const firstFood = lastFood - foodsPerPage;
    const currentFoods = filteredFoods.slice(firstFood,lastFood);
    const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);
    const hasActiveFilters = search.trim() || sort !== "default";

    const AddToCart = (id) => {
        dispatch(CreateCart({
          menuItem: id,
          quantity: 1
        }))
        if(success){
          toast.success("Food added to Cart successfully")
        }
      };

    useEffect(() => {
        dispatch(GetRestaurant())
    }, [dispatch])

    return (
    <div className="home">
        <Navbar />

        <div className="container mt-4 mb-4">
            <div className="rounded-4 p-4 shadow-sm"
                style={{background:"linear-gradient(135deg,#fff7ed,#ffffff)",border: "1px solid #f3e3d4"}}>

                {/* Top */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold mb-1" style={{fontFamily: "Fraunces"}}>🍽 Foods</h2>
                        <p className="text-secondary mb-0">Discover delicious foods you want.</p>
                    </div>

                    <div className="d-flex gap-2">
                        <div className="bg-white rounded-3 shadow-sm px-3 py-2 text-center" style={{minWidth:"95px"}}>
                            <h6 className="fw-bold text-danger mb-0">{restaurants.length}</h6>
                            <small className="text-secondary">Restaurants</small>
                        </div>
                        <div className="bg-white rounded-3 shadow-sm px-3 py-2 text-center" style={{minWidth:"95px"}}>
                            <h6 className="fw-bold text-warning mb-0">⭐ 4.8</h6>
                            <small className="text-secondary">Avg Rating</small>
                        </div>
                    </div>
                </div>
                <hr className="my-4"/>

                {/* Search */}
                <div className="d-flex align-items-center gap-2">
                    <div className="position-relative flex-grow-1">
                        <Search size={18} className="position-absolute text-secondary" style={{left:"16px",top:"50%",transform:"translateY(-50%)"}}/>
                        <input className="form-control border-0 shadow rounded-pill ps-5 pe-5" placeholder="Search foods..." 
                                style={{height:"44px"}} value={search} onChange={(e)=>setSearch(e.target.value)}/>
                        {
                            search &&
                            <button className="btn btn-light rounded-circle position-absolute p-0" style={{right:"10px",top:"50%",transform:"translateY(-50%)",width:"26px",height:"26px"}} onClick={()=>setSearch("")}>
                                <X size={13}/>
                            </button>
                        }
                    </div>

                    <select className="form-select rounded-pill shadow" style={{width:"180px",height:"44px"}} value={sort} onChange={(e)=>setSort(e.target.value)}>
                        <option value="default">Default</option>
                        <option value="rating">⭐ Top Rated</option>
                        <option value="new">🆕 Newest</option>
                        <option value="az">🔤 A-Z</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-0" style={{fontFamily:"Fraunces"}}>Foods</h3>
                    <small className="text-secondary">
                        {
                            isLoading ? "Loading foods..." : `Showing ${filteredFoods.length} foods`
                        }
                    </small>
                </div>
                {
                    hasActiveFilters &&
                    <button className="btn btn-outline-danger rounded-pill" onClick={()=>{setSearch(""); setSort("default");}}> Clear Filters </button>
                }
            </div>

            {/* Food Cards */}
            <div className="row g-4">
            {
            isLoading ?
            (
                [...Array(8)].map((_,index)=>(
                    <div className="col-6 col-lg-3" key={index}>
                        <div className="card border-0 shadow-sm">
                            <div className="placeholder-glow" style={{height:"220px"}}>
                                <div className="placeholder w-100 h-100 rounded-top"></div>
                            </div>
                            <div className="card-body">
                                <span className="placeholder col-8 mb-2"></span>
                                <span className="placeholder col-6"></span>
                            </div>
                        </div>
                    </div>
                ))
            ) : currentFoods.length>0 ? (
                currentFoods.map((item)=>(
                    
                <div className="col-6 col-lg-3" key={item._id}>
                    
                    <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{borderRadius:"18px",cursor:"pointer",transition:"0.3s"}} onClick={()=>navigate(`/fooddetails/${item._id}`)}>
                        <div className="position-relative">
                            <img src={item.image.url} className="card-img-top" alt={item.name} style={{height:"230px",objectFit:"cover"}}/>
                            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">⭐ {item.rating}</span>
                            <span className="badge bg-success position-absolute top-0 end-0 m-2">₹{item.price}</span>
                        </div>

                        <div className="card-body d-flex flex-column">
                            <h5 className="fw-bold text-truncate">{item.name}</h5>
                            <p className="text-secondary small mb-2">🏪 {item?.restaurant?.name}</p>
                            
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                            <small className="text-muted">⭐ {item.totalReviews} Reviews</small>
                            <button className="btn btn-success btn-sm rounded-pill px-3" onClick={(e)=>{e.stopPropagation(); AddToCart(item._id)}}>+ Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))) : (
                <div className="col-12">
                    <div className="text-center py-5">
                    <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width:"90px",height:"90px"}}>🍔</div>
                    <h3 className="fw-bold">No Foods Found</h3>
                    <p className="text-secondary">Try another search.</p>
                    {hasActiveFilters &&
                    <button className="btn btn-outline-danger rounded-pill" onClick={()=>{setSearch(""), setSort("default")}}>Clear Filters</button>
                    }
                    </div>
                </div>
            )}
            </div>
            
            {
                !isLoading && totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-5">
                        <nav>
                            <ul className="pagination shadow-sm">
                                <li className={`page-item ${currentPage===1?"disabled":""}`}>
                                    <button className="page-link border-0" onClick={()=>setCurrentPage(prev=>prev-1)}>
                                        <ChevronLeft size={18}/>
                                    </button>
                                </li>
                                {
                                    [...Array(totalPages)].map((_,index)=>(
                                        <li key={index} className={`page-item ${currentPage===index+1 ? "active" : ""}`}>
                                            <button className="page-link border-0" onClick={()=>setCurrentPage(index+1)}>
                                                {index+1}
                                            </button>
                                        </li>
                                    ))
                                }
                                <li className={`page-item ${currentPage===totalPages?"disabled":""}`}>
                                    <button className="page-link border-0" onClick={()=> setCurrentPage(prev=>prev+1)}>
                                        <ChevronRight size={18}/>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )
            }
        </div>

        <Footer/>
    </div>
    )
}