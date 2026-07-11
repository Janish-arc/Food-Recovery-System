import React, { useState } from 'react'
import logo from '../assets/image.avif'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/UserSlice'
import api from '../api'


export const Navbar = () => {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isAuthenticated, user} = useSelector((state) => state.user)
  const logoutUser = async() => {
      try {
          await api.post("/api/v1/user/logout", {}, { withCredentials: true });
      } catch (err) {
          console.log("Logout API failed:", err);
      }

      dispatch(logout());
      navigate("/");
  }

  return (
    <>
      {open && (
        <div className="shadow px-3 py-3 position-fixed bg-white overflow-y auto navbar"  style={{ top: 0, left: 0, height: "100vh", overflowY: "auto", scrollbarWidth:"none", width: window.innerWidth < 768 ? "300px" : "350px"}}>
          <div className='d-flex justify-content-between position-fixed p-1 shadow pt-2 bg-white' style={{top: 0, left: 0, width: window.innerWidth < 768 ? "300px" : "350px", zIndex: 1500}}>
            <div className='d-flex gap-2'><h4 className="fw-bold"><img src={logo} style={{width:"30px"}}/><span className='pt-2'> RecuPy</span></h4></div>
            <div className="ms-auto me-4" style={{fontSize:"20px"}} type="button" onClick={() => setOpen(false)}><i className="bi bi-x-circle-fill"></i></div>
          </div>

          <div >

            {/* Navigation */}
            <h6 className="text-muted mb-3 mt-5">Navigation</h6>

              {!isAuthenticated &&  
              <div className='d-flex flex-column gap-2 shadow py-2 ps-3 rounded border-1 border-black'>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/")}>🏠 Home</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>ℹ️ About Us</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>🔄 How It Works</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>🤝 Join Our Mission</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>📞 Contact Us</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/login")}>🔐 Login</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/register")}>📝 Register</li>
              </div>}
            
              {isAuthenticated && user.role==="restaurant" &&
              <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/restaurant/dashboard")}>📊 Dashboard</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/restaurant/menu")}>🍔 Menu</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/restaurant/profile")}>🏪 Restaurant Profile</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/restaurant/orders")}>📦 Orders</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/myprofile")}>🙍 Profile</li>
              </div>}

              {isAuthenticated && user.role==="customer" &&
              <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => {navigate("/"); setOpen(false)}}>🏠 Home</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => {navigate("/cart"); setOpen(false)}}>🛒 Cart</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => {navigate("/myorder"); setOpen(false)}}>📦 My Orders</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => {setOpen(false)}}>❤️ Favorites</li>
              <li className="list-group-item" style={{cursor:"pointer"}}  onClick={() => navigate("/myprofile")}>🙍 Profile</li>
              </div>}

              {isAuthenticated && user.role === "admin" &&
              <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/admin")}>📊 Dashboard</li>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allusers")}>👥 Users</li>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/alldonors")}>🏪 Restaurants</li>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allngos")}>🍔 Foods</li>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allvolunteers")}>📦 Orders</li>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allfoods")}>📂 Categories</li>
                  <li className="list-group-item" style={{cursor:"pointer"}}>📈 Reports</li>
                  <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/myprofile")}>🙍 Profile</li>
              </div>
              }

            {/* Roles */}
            <h6 className="text-muted mb-3 mt-4">Discover</h6>
            <div className="rounded-4 text-white p-3 mb-3" style={{background:"linear-gradient(135deg,#ff7e5f,#feb47b)"}}>
                <h5 className="fw-bold">🍔 Hungry?</h5>
                <p className="small mb-3">
                    Explore hundreds of delicious meals and
                    exclusive offers near you.
                </p>
                <button className="btn btn-light btn-sm fw-semibold" onClick={() => {navigate("/"); setOpen(false)}}>Browse Foods →</button>
            </div>

            {!isAuthenticated &&     
            <button className="btn btn-success w-100 mt-2" onClick={() => {navigate("/login")}}>
              ➡️ Get Started
            </button>
            }

            <h6 className="text-muted mt-3 mb-3">Quick Access</h6>
            <div className="list-group border-0">
                <button className="list-group-item list-group-item-action border-0 rounded-3" onClick={()=>navigate("/")}>🍽️ Restaurants</button>
                <button className="list-group-item list-group-item-action border-0 rounded-3">🍕 Categories</button>
                <button className="list-group-item list-group-item-action border-0 rounded-3">🔥 Offers</button>
                <button className="list-group-item list-group-item-action border-0 rounded-3">⭐ Top Rated</button>
            </div>
            <hr/>

            {isAuthenticated && 
            <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
              <li className="list-group-item" style={{cursor:"pointer"}}>⚙️ Settings</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={logoutUser}>🔓 Logout</li> 
            </div>
            }
            <hr />

            <div className="text-center text-muted small pb-2">
                RecuPy v1.0
                <br />
                Made with ❤️
            </div>
          </div>
        </div>
      )}

      <div className='d-flex align-items-center px-3 sticky-top bg-white' style={{height:"60px", zIndex:'1000'}}>
        <div onClick={() => setOpen(true)}><i className="bi bi-list shadow rounded me-3 px-1" style={{fontSize:"30px", fontWeight:"700"}}></i></div>
        <div className='d-flex gap-2 mt-2'>
            <img src={logo} className='rounded-circle' style={{width: "40px", height:"40px", objectFit: "cover"}}/>
            <h3><b>RECUPY</b></h3>  
        </div>

        {!isAuthenticated && 
        <div className='d-flex gap-3 ms-auto mt-2'>
            <h6 className='btn btn-primary'  style={{fontSize: window.innerWidth < 768 ? "13px" : "16px", padding: window.innerWidth < 768 ? "4px 8px" : "8px 16px"}} onClick={() => navigate("/login")}>LOGIN</h6>
            <h6 className='btn btn-primary'  style={{fontSize: window.innerWidth < 768 ? "13px" : "16px", padding: window.innerWidth < 768 ? "4px 8px" : "8px 16px"}} onClick={() => navigate("/register")}>REGISTER</h6>   
        </div>
        }

        {isAuthenticated &&
        <table className="ms-auto">
          <tbody>
            <tr className="d-flex gap-3 fs-6 fw-bold text-primary" >
              <td className="d-none d-md-block" style={{ fontFamily: "'Poppins', sans-serif" , cursor: "pointer"}} onClick={() => navigate("/")}>Home</td>
              {user?.role === "customer" && (
                <div className='d-flex gap-3'>
                  <td style={{ fontFamily: "'Poppins', sans-serif", cursor: "pointer" }} onClick={() => navigate("/cart")}>🛒 Cart</td>
                  <td style={{ fontFamily: "'Poppins', sans-serif", cursor: "pointer" }} onClick={() => navigate("/myorder")}>📦 MyOrders</td>
                </div>
              )}
              {user.role === "restaurant" && 
                <td style={{ fontFamily: "'Poppins', sans-serif" , cursor: "pointer"}} onClick={() => navigate("/myprofile")}>👤{user?.name}</td>
              }
              {user.role === "customer" && 
                <td className="d-none d-md-block" style={{ fontFamily: "'Poppins', sans-serif" , cursor: "pointer"}} onClick={() => navigate("/myprofile")}>👤{user?.name}</td>
              }
              </tr>
          </tbody>
        </table>
        }
      </div>

    </>
  )
}
