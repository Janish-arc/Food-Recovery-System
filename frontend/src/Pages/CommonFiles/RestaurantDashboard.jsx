import React, { useEffect, useState } from "react";
import {Package,IndianRupee,Star,Clock,Salad,PlusCircle,ClipboardList,Settings, ChefHat} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Components/Footer";
import { Navbar } from "../../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { GetRestaurantOrder } from "../../Redux/OrderSlice";
import { GetMenuOfRestaurant } from "../../Redux/FoodSlice";
import { GetMyRestaurant } from "../../Redux/RestaurantSlice";
import { GetCategory } from "../../Redux/CategorySlice";

export const RestaurantDashboard = () => {
  const {order} = useSelector((state) => state.order)
  const {resFood} = useSelector((state) => state.food)
  const {myrestaurant} = useSelector((state) => state.restaurant)
  const {category: allCategory} = useSelector((state) => state.category)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [pop, setPop] = useState(false)
  const pendingOrders = order.filter((item) => item.orderStatus === "Placed").length
  const totalRevenue = order.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const recentOrders = order.slice(0,5)
  const [preview, setPreview] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600")
  const [foodData, setFoodData] = useState({
      name:"", category:"", description:"", price:"", preparedTime:""
  })
  const {name, category, description, price, preparedTime} = foodData
  const [image, setImage] = useState(preview)

  useEffect(() => {
    dispatch(GetRestaurantOrder())
    dispatch(GetMenuOfRestaurant())
    dispatch(GetMyRestaurant())
    dispatch(GetCategory())
  }, [dispatch])

  const handleCreateFood = async (e) => {
          e.preventDefault();
          const myform = new FormData();
          myform.set("name", name);
          myform.set("description", description);
          myform.set("category", category);
          myform.set("price", price);
          myform.set("preparedTime", preparedTime);
          if (image) {
              myform.set("image", image);
          }
          const result = await dispatch(CreateFood(myform));
          if (result.meta.requestStatus === "fulfilled") {
              setPop(false);
              toast.success("Food created successfully");
          }
      };
  
      const createFood = (e) => {
          setFoodData({
              ...foodData,
              [e.target.name]: e.target.value,
          });
      };

  return (
    <div className="home">
    <Navbar/>
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🍽 Restaurant Dashboard</h2>

      {/* Stats */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <Package size={28} color="#0d6efd" />
              <h3 className="mt-2">{order?.length}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <Clock size={28} color="#ffc107" />
              <h3 className="mt-2">{pendingOrders}</h3>
              <p className="text-muted mb-0">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <Salad size={28} color="#198754" />
              <h3 className="mt-2">{resFood?.length}</h3>
              <p className="text-muted mb-0">Menu Items</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <IndianRupee size={28} color="#dc3545" />
              <h3 className="mt-2">₹{totalRevenue}</h3>
              <p className="text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <h5 className="mb-3">Quick Actions</h5>
          <div className="d-flex flex-wrap gap-3">
            <button className="btn btn-primary rounded-pill" onClick={() => setPop(true)}>
              <PlusCircle size={16} className="me-2" />Add Food
            </button>
            <button className="btn btn-success rounded-pill" onClick={() => navigate("/restaurant/menu")}>
              <Salad size={16} className="me-2" /> Manage Menu
            </button>
            <button className="btn btn-warning rounded-pill" onClick={() => navigate("/restaurant/orders")}>
              <ClipboardList size={16} className="me-2" /> View Orders
            </button>
            <button className="btn btn-dark rounded-pill" onClick={() => navigate("/restaurant/profile")}>
              <ChefHat size={16} className="me-2" /> Restaurant Profile
            </button>
          </div>
        </div>
      </div>

      {/* Summary + Rating */}
      <div className="row mt-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Restaurant Summary</h5>
              <hr />
              <p>⭐ Average Rating</p>
              <h2 className="text-warning">{myrestaurant.rating}</h2>
              <small className="text-muted">Based on customer reviews</small>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Recent Orders</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders?.map((orders) => (
                      <tr key={orders._id}>
                        <td>#{orders._id.slice(0,5)}</td>
                        <td>{orders?.user?.name}</td>
                        <td>₹{orders?.totalAmount}</td>
                        <td>
                          <span className="badge bg-primary">{orders?.orderStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pop && (
                <div className='position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center px-3' style={{zIndex:1000, backgroundColor:"rgba(0,0,0,0.5)"}}>
                <div className="bg-white rounded shadow-lg p-4 overflow-y-auto w-100" style={{maxWidth:"550px", maxHeight:"80vh", scrollbarWidth:"none"}}>
                    <h2 className='text-center'>Add Food</h2>
                    <form onSubmit={handleCreateFood}>
                    <div className='d-flex flex-column gap-4'>
                        <div>
                            <h6>Food Name</h6>
                            <input className="form-control" type="text" placeholder="Enter Food Name"
                            name='name' value={name} onChange={createFood}/>
                        </div>
                        <div>
                            <h6>Category</h6>
                            <select name="category" className="form-select" value={category} onChange={createFood}>
                                <option>Select Category</option>
                                {allCategory.map((item) => (
                                    <option key={item._id} value={item._id} >{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h6>Food Description</h6>
                            <input className="form-control" type="text" placeholder="Enter Food description"
                            name='description' value={description} onChange={createFood}/>
                        </div>
                        <div>
                            <h6>Price</h6>
                            <input className="form-control" type="Number" placeholder="Enter Price"
                            name='price' value={price} onChange={createFood}/>
                        </div>
                        <div>
                            <h6>Prepared Time</h6>
                            <input className="form-control" type="text" placeholder="Enter Prepared Time"
                            name='preparedTime' value={preparedTime} onChange={createFood}/>
                        </div>
                        <div className='mb-4'>
                            <h6>Food Image</h6>
                            <div className='d-flex align-items-center gap-2'>
                                <div>
                                    <img src={preview} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"70px", width:"70px" }}/>
                                </div>
                                <div>
                                    <input className="form-control" type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];
                                    if (file) {
                                    setImage(file);
                                    setPreview(URL.createObjectURL(file));
                                    }
                                }}/>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary w-50" type="Submit">Add Food</button>
                            <button className="btn btn-danger w-50" onClick={() => setPop(false)}>Cancel</button>
                        </div> 
                    </div>
                    </form>   
                </div>
                </div>
            )}
      </div>
      <Footer/>
    </div>
  );
};