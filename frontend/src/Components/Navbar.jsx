import React, { useState } from 'react'
import logo from '../assets/image.avif'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logout } from '../Redux/UserSlice'


export const Navbar = () => {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isAuthenticated, user} = useSelector((state) => state.user)
  const logoutUser = async() => {
      try {
          await axios.post("/api/v1/user/logout", {}, { withCredentials: true })
          dispatch(logout())
          navigate('/')
      } catch (error){
          console.log(error)
      }
  }

  return (
    <>
      {open && (
        <div className="w-25 shadow px-3 py-3 position-fixed bg-white overflow-y auto"  style={{zIndex: 2, top: 0, left: 0, height: "100vh", overflowY: "auto", scrollbarWidth:"none"}}>
          <div className='d-flex'>
            <h4 className="fw-bold"><img src={logo} style={{width:"30px"}}/> RecuPy</h4>
            <div className="ms-auto me-4" style={{fontSize:"20px"}} type="button" onClick={() => setOpen(false)}><i className="bi bi-x-circle-fill"></i></div>
          </div>

          <div >

            {/* Navigation */}
            <h6 className="text-muted mb-3 mt-4">Navigation</h6>

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
            
              {isAuthenticated && user.role==="donor" &&
              <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/donor")}>📊 Dashboard</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => { navigate("/donor", {state: {popUp: true}})}}>🍽️ Donate Food</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/mydonations")}>📋 My Donations</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>📚 Donation History</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/myprofile")}>🙍 Profile</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>⚙️ Settings</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={logoutUser}>🔓 Logout</li> 
              </div>}

              {isAuthenticated && user.role==="ngo" &&
              <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/ngo")}>📊 Dashboard</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/ngo/acceptedfood")}>📦 Accepted Foods</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>🙋 Volunteers</li>
              <li className="list-group-item" style={{cursor:"pointer"}}  onClick={() => navigate("/myprofile")}>🙍 Profile</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>⚙️ Settings</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={logoutUser}>🔓 Logout</li> 
              </div>}

              {isAuthenticated && user.role==="volunteer" &&
              <div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/volunteer")}>📊 Dashboard</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/volunteer/mydeliveries")}>📦 My Deliveries</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/mydeliveredhistory")}>📚Delivery History</li>
              <li className="list-group-item" style={{cursor:"pointer"}}  onClick={() => navigate("/myprofile")}>🙍 Profile</li>
              <li className="list-group-item" style={{cursor:"pointer"}}>⚙️ Settings</li>
              <li className="list-group-item" style={{cursor:"pointer"}} onClick={logoutUser}>🔓 Logout</li> 
              </div>}

              {isAuthenticated && user.role === "admin" &&
<div className='d-flex flex-column gap-2 shadow-sm py-2 ps-3 rounded'>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/admin")}>📊 Dashboard</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allusers")}>👥 User Management</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/alldonors")}>🍴 Donor Management</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allngos")}>🏢 NGO Management</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allvolunteers")}>🚚 Volunteer Management</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/allfoods")}>🍱 Food Management</li>
    <li className="list-group-item" style={{cursor:"pointer"}}>📈 Reports</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={() => navigate("/myprofile")}>🙍 Profile</li>
    <li className="list-group-item" style={{cursor:"pointer"}}>⚙️ Settings</li>
    <li className="list-group-item" style={{cursor:"pointer"}} onClick={logoutUser}>🔓 Logout</li>
</div>
}

            {/* Roles */}
            <h6 className="text-muted mb-3 mt-4">Get Started</h6>

            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5>👨‍🍳 Donor</h5>
                <p className="mb-0">
                  Donate surplus food and help feed those in need.
                </p>
              </div>
            </div>

            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5>🏢 NGO</h5>
                <p className="mb-0">
                  Collect and distribute food to communities.
                </p>
              </div>
            </div>

            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5>🚚 Volunteer</h5>
                <p className="mb-0">
                  Help transport food from donors to recipients.
                </p>
              </div>
            </div>
            {!isAuthenticated &&     
            <button className="btn btn-success w-100 mt-2" onClick={() => {navigate("/login")}}>
              ➡️ Get Started
            </button>
            }
          </div>
        </div>
      )}

      <div className='d-flex shadow align-items-center px-3 sticky-top bg-white' style={{height:"60px", zIndex:'1'}}>
        <div onClick={() => setOpen(true)}><i className="bi bi-list shadow rounded me-3 px-1" style={{fontSize:"30px", fontWeight:"700"}}></i></div>
        <div className='d-flex gap-2'>
            <img src={logo} className='rounded-circle' style={{width: "40px", height:"40px", objectFit: "cover"}}/>
            <h3><b>RECUPY</b></h3>  
        </div>
        {isAuthenticated && 
        <div className='d-flex gap-3 ms-auto mt-2'>
          {user?.role === "donor" && 
          <h6 className='btn button rounded-pill' onClick={() => navigate("/mydonations")}>MY DONATIONS</h6>
          }
          {user?.role === "ngo" && 
          <h6 className='btn button rounded-pill' onClick={() => navigate("/ngo")}>NGO DASHBOARD</h6>
          }
          {user?.role === "volunteer" && 
          <h6 className='btn button rounded-pill' onClick={() => navigate("/volunteer")}>VOLUNTEER TASKS</h6>
          }
          <h6 className='btn button rounded-pill' onClick={() => navigate("/myprofile")}>PROFILE</h6>
          <h6 className='btn button rounded-pill bg-danger' onClick={logoutUser}>LOGOUT</h6>
        </div>
        }
        {!isAuthenticated && 
        <div className='d-flex gap-3 ms-auto mt-2'>
            <h6 className='btn button' onClick={() => navigate("/login")}>LOGIN</h6>
            <h6 className='btn button' onClick={() => navigate("/register")}>REGISTER</h6>   
        </div>
        }
      </div>

      {/* <div
        className="d-flex align-items-center px-4 shadow-sm sticky-top bg-white"
        style={{ height: "70px", zIndex: 1 }}
      >

        <div
          onClick={() => setOpen(true)}
          className="p-2 rounded-circle"
          style={{
            cursor: "pointer",
            backgroundColor: "#f8f9fa",
          }}
        >
          <i className="bi bi-list fs-3"></i>
        </div>

        <div className="d-flex align-items-center gap-2 ms-3">
          <img
            src={logo}
            className="rounded-circle border"
            style={{
              width: "45px",
              height: "45px",
              objectFit: "cover",
            }}
          />

          <div>
            <h4 className="fw-bold text-success mb-0">RecuPy</h4>
            <small className="text-muted">Food Recovery System</small>
          </div>
        </div>

        <div className="ms-auto d-flex gap-2">
          {isAuthenticated ? (
            <>
              <button
                className="btn btn-outline-success rounded-pill"
                onClick={() => navigate("/mydonations")}
              >
                My Donations
              </button>

              <button
                className="btn btn-outline-primary rounded-pill"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>

              <button
                className="btn btn-danger rounded-pill"
                onClick={logoutUser}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-success rounded-pill"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="btn btn-success rounded-pill"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div> */}

    </>
  )
}
