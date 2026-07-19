import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { ChevronLeft, Search } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GetSingleCategoryFood } from '../../Redux/FoodSlice'
import { CreateCart } from '../../Redux/CartSlice'
import toast from 'react-hot-toast'

export const Category = () => {

    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {categoryFoods, loading} = useSelector((state) => state.food)
    const {success} = useSelector((state) => state.cart)
    const [sort, setSort] = useState("")
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("All")

    useEffect(() => {
        dispatch(GetSingleCategoryFood({id, sort}))
    }, [dispatch, id, sort])

    const createCart = (id) => {
        dispatch(CreateCart({
            menuItem: id, 
            quantity: 1
        }))
        if(success){
            toast.success("Food added to cart")
        }
    }

    const filteredfoods = categoryFoods.filter((item) => {
      if(filter === "Low"){
        return item?.price <= 200
      }
      if(filter === "Medium"){
        return item?.price >= 200 && item?.price <= 500
      }
      if(filter === "Costly"){
        return item?.price >= 500
      }
      if(filter === "rating"){
        return item?.rating > 4
      }
      return true;
    })

    return (
  <div className='home'>
    <Navbar />
    <div className="container py-4" style={{ minHeight: "85vh" }}>
      
      {/* Header */}
      <div className="mb-4">
        {categoryFoods.length > 0 && 
        <div className="border-0 rounded-4 shadow-sm mb-4 overflow-hidden">
          <div  className='position-relative'>
            <img src={categoryFoods?.[0]?.category?.image?.url} className="w-100 category-banner"/>
            <button className="btn btn-dark btn-sm rounded-pill mb-3  position-absolute top-0 start-0 m-3 text-white" onClick={() => navigate(-1)}>
                  <ChevronLeft size={18}/> Back
              </button>
          </div>
          <div className="p-3 d-flex align-items-center gap-1">
              <h2 className="fw-bold m-0">
                  {categoryFoods?.[0]?.category?.name}
              </h2>
              <p className="text-secondary fw-bold m-0 pt-1">
                  ({categoryFoods.length} Foods Available)
              </p>
          </div>
        </div>}
      </div>

      {categoryFoods.length > 0 && 
      <div>
      {/* Search & Sort */}
      <div className="row g-3 mb-4">
        <div className="col-8">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control" placeholder="Search food..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          </div>
        </div>

        <div className="col-4">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="priceLow">Price : Low to High </option>
            <option value="priceHigh">Price : High to Low</option>
            <option value="name">A - Z</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => setFilter("All")}><small>All</small></button>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => setFilter("Low")}><small>Under ₹200</small></button>
        <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => setFilter("Medium")}> ₹200 - ₹500</button>
        <button className="btn btn-outline-dark btn-sm rounded-pill" onClick={() => setFilter("Costly")}>Above ₹500</button>
        <button className="btn btn-outline-warning btn-sm rounded-pill" onClick={() => setFilter("rating")}>Rating 4+</button>
      </div>
      </div>}

      
      {/* Foods */}
      <div className="row g-4">
        {loading ? (
        <div className="col-12 text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
        </div>
        ) : filteredfoods?.length > 0 ? (
        filteredfoods ?.filter((food) => food?.name ?.toLowerCase().includes(search.toLowerCase())).map((food) => (
            <div className="col-6 col-lg-4 col-xl-3 food" key={food._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden" onClick={() => navigate(`/fooddetails/${food._id}`)}
                style={{transition: "0.3s", cursor: "pointer"}}>

                {/* Food Image */}
                <div className="position-relative">
                  <img src={food?.image?.url} alt={food?.name} className="card-img-top" style={{height: "220px", objectFit: "cover"}}/>
                  <span className={`badge position-absolute top-0 start-0 m-3 ${food?.category?.name === "Vegeterian" ? "bg-success" : "bg-danger"}`}>
                    {food?.category?.name}
                  </span>
                  <div className='position-absolute top-0 end-0 m-3'><h6 className="text-dark bg-white px-1 rounded fw-medium mb-0">₹{food?.price}</h6></div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="fw-bold mb-0">{food?.name}</h5>
                    <span className="badge bg-success text-white">⭐ {food?.rating || 4.5}</span>
                  </div>
                  <div className='d-flex justify-content-between align-items-center gap-2'>
                    <small className="mb-0 text-truncate">{food?.restaurant?.name}</small>
                    <button className="btn btn-danger btn-sm rounded-2 flex-shrink-0" onClick={()=> createCart(food._id)}><small>Add To Cart</small></button>
                  </div>
                  {/* <div className="mt-auto d-grid gap-2 d-flex justify-content-around">
                    <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => navigate(`/fooddetails/${food._id}`)}><small>View Details</small></button>
                    
                  </div> */}
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="col-12">
          <div className="d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: "350px" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="No Foods" style={{ width: "120px",opacity: 0.8}}/>
            <h3 className="fw-bold mt-4"> No Foods Found </h3>
            <p className="text-secondary">We couldn't find any foods matching your search.</p>
            <button className="btn btn-danger rounded-pill px-4" onClick={() => navigate("/")}>Back To Home</button>
          </div>
        </div>
      )}
      </div>
    </div>
    <Footer />
  </div>
);
}
