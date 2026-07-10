import React, { useEffect } from "react";
import {Package,IndianRupee,Star,Clock,Salad,PlusCircle,ClipboardList,Settings, ChefHat} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Components/Footer";
import { Navbar } from "../../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { GetRestaurantOrder } from "../../Redux/OrderSlice";
import { GetMenuOfRestaurant } from "../../Redux/FoodSlice";
import { GetMyRestaurant } from "../../Redux/RestaurantSlice";

export const RestaurantDashboard = () => {
  const {order} = useSelector((state) => state.order)
  const {resFood} = useSelector((state) => state.food)
  const {myrestaurant} = useSelector((state) => state.restaurant)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const pendingOrders = order.filter((item) => item.orderStatus === "Placed").length
  const totalRevenue = order.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const recentOrders = order.slice(0,5)

  useEffect(() => {
    dispatch(GetRestaurantOrder())
    dispatch(GetMenuOfRestaurant())
    dispatch(GetMyRestaurant())
  }, [dispatch])

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
            <button className="btn btn-primary rounded-pill">
              <PlusCircle size={16} className="me-2" />Add Food
            </button>
            <button className="btn btn-success rounded-pill" onClick={() => navigate("/restaurant/menu")}>
              <Salad size={16} className="me-2" /> Manage Menu
            </button>
            <button className="btn btn-warning rounded-pill" onClick={() => navigate("/restaurant/orders")}>
              <ClipboardList size={16} className="me-2" /> View Orders
            </button>
            <button className="btn btn-dark rounded-pill" onClick={() => navigate(`/res/profile/${myrestaurant._id}`)}>
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
      </div>
      <Footer/>
    </div>
  );
};