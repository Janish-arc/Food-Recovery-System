import React, { useEffect } from 'react'
import Home1 from '../../assets/Home1.png'
import Home2 from '../../assets/Home2.png'
import Home3 from '../../assets/Home3.png'
import Home4 from '../../assets/Home4.png'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { FaUtensils, FaTruck, FaHeart } from "react-icons/fa";
import { FaBuildingNgo } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const Home = () => {

    const {user, isAuthenticated} = useSelector((state) => state.user)
    const navigate = useNavigate()

    useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "donor") {
        navigate("/donor");
      } else if (user?.role === "ngo") {
        navigate("/ngo");
      } else if (user?.role === "volunteer") {
        navigate("/volunteer");
      } else if (user?.role === "admin") {
        navigate("/admin")
      }
    }
  }, [isAuthenticated, user, navigate]); 

  return (
    <>
        <Navbar/>

        <div className="container-fluid py-5 px-5 home">

            {/* Hero Section */}
            <div className="text-center mb-5">
                <h2 className="fw-bold">Reduce Food Waste, Feed More People</h2>
                <p className="text-muted">
                Connect Donors, NGOs, and Volunteers to rescue surplus food and deliver it to those in need.
                </p>
            </div>

            {/* Cards Section */}
            <div className="row g-4">

                <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow border-0 text-center p-3">
                    <img
                    src={Home1} alt="Donate Food" className="img-fluid mb-3"
                    />
                    <h5 className="fw-bold text-success">Donate Surplus Food</h5>
                    <p className="text-muted">
                    Turn excess food into hope. Share safe and nutritious food with those who need it instead of letting it go to waste.
                    </p>
                </div>
                </div>

                <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow border-0 text-center p-3">
                    <img
                    src={Home2} alt="Feed More Lives" className="img-fluid mb-3"
                    />
                    <h5 className="fw-bold text-danger">Feed More Lives</h5>
                    <p className="text-muted">
                    Every donation helps provide meals to families, children, andindividuals facing food insecurity.
                    </p>
                </div>
                </div>

                <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow border-0 text-center p-3">
                    <img
                    src={Home3} alt="Efficient Delivery" className="mb-3"
                    />
                    <h5 className="fw-bold" style={{color:"#1967b4"}}>Efficient Delivery</h5>
                    <p className="text-muted">
                    Volunteers and NGOs work together to ensure donated food reaches the right people quickly and safely.
                    </p>
                </div>
                </div>

                <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow border-0 text-center p-3">
                    <img
                    src={Home4} alt="Reduce Food Waste" className="img-fluid mb-3"
                    />
                    <h5 className="fw-bold text-success">Reduce Food Waste</h5>
                    <p className="text-muted">
                    Reduce environmental impact by preventing edible food from being wasted and putting it to good use.
                    </p>
                </div>
                </div>

            </div>

            {/* How it Works */}
            <div className='d-flex flex-column align-items-center text-center mt-5'>
                <h3 className='text-danger'><b>How it Works!</b></h3>
                <div className='shadow-lg p-4 w-50 rounded-pill card mt-2' style={{backgroundColor:"#1DB954"}}>
                    <div className='d-flex gap-2 justify-content-center text-white'>
                        <div className='bg-black px-1 rounded'><FaUtensils size={20}/></div>
                        <h5>Post Food</h5>
                    </div>
                    <i className="bi bi-arrow-down text-black"  style={{fontSize:"25px", fontWeight:700}}></i>
                    <div className='d-flex gap-2 justify-content-center text-white'>
                        <div className='bg-black px-1 rounded'><FaBuildingNgo size={20}/></div>
                        <h5>NGO Accepts</h5>
                    </div>
                    <i className="bi bi-arrow-down text-black"  style={{fontSize:"25px", fontWeight:700}}></i>
                    <div className='d-flex gap-2 justify-content-center text-white'>
                        <div className='bg-black px-1 rounded'><FaTruck  size={20}/></div>
                        <h5>Volunteer Picks Up</h5>
                    </div>
                    <i className="bi bi-arrow-down text-black" style={{fontSize:"25px", fontWeight:700}}></i>
                    <div className='d-flex gap-2 justify-content-center text-white'>
                        <div className='bg-black px-1 rounded'><FaHeart  size={20}/></div>
                        <h5>Delivered</h5>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className='d-flex justify-content-center'>
                <div className="row text-center mt-5 text-white rounded-pill py-3 w-75 shadow-lg cards" style={{backgroundColor:"#1DB954"}}>
                    <div className="col-md-3">
                        <h2>500+</h2>
                        <p>Meals Donated</p>
                    </div>

                    <div className="col-md-3">
                        <h2>200+</h2>
                        <p>Active Donors</p>
                    </div>

                    <div className="col-md-3">
                        <h2>50+</h2>
                        <p>NGO Partners</p>
                    </div>

                    <div className="col-md-3">
                        <h2>100+</h2>
                        <p>Volunteers</p>
                    </div>
                </div>
            </div>

            {/* Our Mission */}
            <div className='mt-5 pt-4'>
                <div className='text-center'>
                    <h3><b>JOIN OUR MISSION</b></h3>
                    <h6 className='text-secondary'>Every meal shared brings hope. Join our growing community of donors, NGOs, and volunteers working together to build a hunger-free future.</h6>
                </div>
                <div  className="row g-4 mt-2">
                    <div className="col-lg-4 col-md-6 ">
                        <div className="card h-100 shadow border-0 text-center p-3" style={{backgroundColor:"#1DB954"}}>
                            <h4><b>DONOR</b></h4>
                            <p>Turn surplus food into hope. Donate excess food safely and help feed those in need.</p>
                            <button className='btn button ms-auto' style={{width:"100px"}} onClick={() => navigate("/login")}>Join Now</button>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card h-100 shadow border-0 text-center p-3" style={{backgroundColor:"#1DB954"}}>
                            <h4><b>NGO</b></h4>
                            <p>Partner with us to collect and distribute food efficiently to communities that need it most.</p>
                            <button className='btn button ms-auto' style={{width:"100px"}} onClick={() => navigate("/login")}>Join Now</button>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card h-100 shadow border-0 text-center p-3" style={{backgroundColor:"#1DB954"}}>
                            <h4><b>VOLUNTEER</b></h4>
                            <p>Be the bridge between donors and recipients. Help deliver food and create a positive impact.</p>
                            <button className='btn button ms-auto' style={{width:"100px"}} onClick={() => navigate("/login")}>Join Now</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <Footer/>
    </>
    
  )
}