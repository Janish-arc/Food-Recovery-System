import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptsFood, GetAllFoods, GetSingleFood } from '../../Redux/FoodSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Footer } from '../../Components/Footer'
import { Pagination } from '../../Components/Pagination'

export const Ngo = () => {

  const {user, volunteer, isAuthenticated} = useSelector((state) => state.user)
  const {food, success} = useSelector((state) => state.food)
  const [selectedFood, setSelectedFood] = useState("")
  const [pop, setPop] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [volunteers, setVolunteers] = useState([])
  const foodList = Array.isArray(food) ? food : [];
  const availableFoods = foodList.filter((item) => item.status === "Available");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentFoods = availableFoods.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(availableFoods.length / itemsPerPage);

  const urgentFoods = foodList.filter((foods) => {
    const now = new Date()
    const expiry = new Date(foods.expiryDate)
    const diffhours = (expiry - now)/ (1000 * 60 * 60)
    return diffhours > 0 && diffhours <= 24
  })

  const availableUrgentFoods = urgentFoods.filter(
  (food) => food.status === "Available"
  );

  const mealsdistributed = foodList.filter((foods) => (
    foods.status === "Delivered" && 
    foods.ngoId._id === user._id
  )).reduce((total, food) => total + food.quantity, 0)

  const ngoDeliveredorders = foodList.filter((foods) => (
  foods.status === "Accepted" && 
  foods.ngoId._id === user._id
  )).length

  const receivedFoods = foodList.filter(item => item.status === "Delivered" && item.ngoId._id === user._id)

  const donors = new Set(foodList.map((foods) => foods.donorId?._id)).size;
  const volunteersAvailable = new Set(foodList.map((foods) => foods.volunteerId?._id)).size;

  const FoodAccept = async(id) => {
    if(success){
      toast.success("Food Accepted successfully")
    }
    await dispatch(AcceptsFood(id))
    dispatch(GetAllFoods())
  }

  const getUrgencyColor = (expiryDate) => {
          const diffInHours = (new Date(expiryDate) - new Date())/1000*60*60
          if(diffInHours <=2 ) return "table-danger"
          if(diffInHours <=24) return "table-warning"
          else return "table-white"
      }

  useEffect(() => {
    dispatch(GetAllFoods())
  },[dispatch, success])


  return (
    <div>
        <Navbar/>
        {isAuthenticated ? (
        <div className="container-fluid container-lg mt-4 mb-5 px-3 px-md-4" style={{ overflowY: "auto", scrollbarWidth: "none" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold fs-2 fs-md-1">Welcome {user?.name} 👋</h2>
            <p className="text-muted px-3">Help reduce food waste and feed those in need.</p>
          </div> 

          <div className="row my-1 g-3"> 
            <div className="col-12 col-lg-8">
            <div className=" h-100">
                <h3 className="text-center mb-4">🌍 Impact So Far</h3>

                <div className="row text-center px-2 g-3">
                  <div className="col-6 col-md-3">
                    <div className="card shadow text-center p-3 border-0">
                      <h2 className="fw-bold text-success">{mealsdistributed}</h2>
                      <p>Meals Distributed</p>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="card shadow text-center p-3 border-0">
                      <h2 className="fw-bold text-warning">{receivedFoods.length}</h2>
                      <p>Total Donations Recieved</p>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="card shadow text-center p-3 border-0">
                      <h2 className="fw-bold text-primary">{donors}</h2>
                      <p>Donors Connected</p>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="card shadow text-center p-3 border-0">
                      <h2 className="fw-bold text-danger">{volunteersAvailable}</h2>
                      <p>Volunteers Active</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>

            <div className="col-12 col-lg-4"> 
            <div className="card shadow border-0 h-100 p-3">
              <h3 className='text-center'>📈 Food Insights</h3>
              <div className="row mt-3" style={{fontSize:"17px", fontWeight:"600"}}>
              <div className="col-9">
                <div className='mb-1'>🥗Veg Foods Received</div>
                <div className='mb-1'>🍗Non-Veg Foods Received</div>
                <div>🍪Snacks Received</div>
              </div>
              <div className="col-3 text-end">
                <div>{receivedFoods.filter((item) => item.category === "Veg").length}</div>
                <div>{receivedFoods.filter((item) => item.category === "NonVeg").length}</div>
                <div>{receivedFoods.filter((item) => item.category === "Snacks").length}</div>
              </div>
              </div>
            </div>  
            </div>
          </div>

          <div className="text-center mt-5 px-2">
            <h2>🤝Our Mission</h2>
            <p>To reduce food waste and ensure surplus food reaches people in need through efficient coordination between donors and volunteers.</p>
          </div>

          <div className="row g-3 mb-3">
          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow text-center p-3 h-100 border-0">
              <h6>Available Foods</h6>
              <h3>{foodList.filter(item => item.status === "Available").length}</h3>           
            </div>
          </div>

          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow text-center p-3 h-100 border-0" onClick={() => navigate("/ngo/acceptedfood")}>
              <h6>Accepted Foods</h6>
              <h3>
              {
                foodList.filter(
                  item =>
                    item.status !== "Available" &&
                    item.status !== "Delivered" &&
                    item.ngoId._id === user?._id
                ).length
              }
              </h3>         
            </div>
          </div>

          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow text-center p-3 h-100 border-0">
              <h6>Foods In Transit</h6>
              <h3>{foodList.filter(item => item.status === "Out for Delivery" && item.ngoId._id === user._id).length}</h3>
            </div>
          </div>

          <div className="col-6 col-md-6 col-lg-3">
            <div className="card shadow text-center p-3 h-100 border-0" onClick={() => navigate("/receivedfoodhistory")}>
              <h6>Received Foods</h6>
              <h3>{receivedFoods.length}</h3>
            </div>
          </div>
          </div>

          {availableUrgentFoods.length > 0 && (
            <>
            <div className="d-flex flex-column align-items-center mt-5 mb-2">
              <h5>⚠ Urgent Donations</h5>
              <p>
                {urgentFoods.length} food {urgentFoods.length > 1 ? (<>items are</>):(<>item is</>)} expiring within the next 24 hours.
              </p>
            </div>
        
            <div className="card border-danger mb-4">
              <div className="card-header bg-danger text-white">
                ⚠ Expiring Within 24 Hours
              </div>

              <div className='table-responsive'>
              <table className="table table-sm ">
                <tbody>
                  {urgentFoods
                    .filter((food) => food.status === "Available")
                    .map((food) => (
                      <tr key={food._id} onClick={() => navigate(`/fooddetails/${food._id}`)} style={{ cursor: "pointer" }}>
                        <td className='ps-3'>{food.name}</td>
                        <td >{new Date(food.expiryDate).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button className="btn btn-primary me-4" onClick={(e) => {e.stopPropagation(); setSelectedFood(food); setPop(true);}}>Accept</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>
            </div>
            </>
          )}

          <div className="table-responsive mt-5">
            <h3 className='text-center'><b>TODAY'S FOOD REQUEST</b></h3>
            <table className="table mt-3 shadow rounded">
              <thead className='black-header'>
                <tr>
                  <th>Image</th>
                  <th>Food</th>
                  <th>Donor</th>
                  <th>Location</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentFoods.length > 0 ? (
                currentFoods.map((item) => 
                
                <tr key={item._id} className={`align-middle ${getUrgencyColor(item.expiryDate)}`} onClick={() => navigate(`/fooddetails/${item._id}`)}>
                  <td style={{width:"100px"}}><img src={item?.image?.url} style={{width:"70px", height:"70px", objectFit:"cover", borderRadius:"50%"}}/></td>
                  <td ><strong>{item.name}</strong></td>
                  <td>{item.organization}</td>
                  <td>{item.pickUpAddress}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.status}</td>
                  <td>{new Date(item?.expiryDate).toLocaleDateString()}</td>
                  <td>{item?.donorId?.phoneNo}</td>
                  <td><button className='btn btn-primary' onClick={(e) =>{e.stopPropagation(); setSelectedFood(item); setPop(true)}}>Accept</button></td>
                  
                </tr>
                )) : (
               <tr>
                <td colSpan="9" className="text-center py-3">
                  <h5>📦 No food requests available right now. Check back later for new donations.</h5>
                </td>
              </tr>)}
              </tbody>
            </table>
          </div>

        </div>
        ):(
          <div className='vh-100 d-flex flex-column align-items-center gap-2' style={{marginTop:"15%"}}>
            <div className='d-flex flex-column align-items-center shadow p-5 rounded'>
              <h2>Please Login to Access</h2>
              <button className='btn btn-primary' onClick={() => navigate("/login")}>LOGIN</button>
            </div>
          </div>
        )}

        {pop && selectedFood && (
          <div
            className="position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9999,
            }}
          >
            <div
              className="bg-white rounded shadow-lg p-4"
              style={{width:"95%", maxWidth:"520px"}}
            >
              <div className="text-center mb-4">
                <h3>🍱 Accept Food Donation?</h3>
                <p className="text-muted mb-0">
                  Review the donation details before accepting.
                </p>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Quantity</h6>
                    <p className="fw-bold mb-0">{selectedFood.quantity}</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Food</h6>
                    <p className="fw-bold mb-0">{selectedFood.name}</p>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Food Description</h6>
                    <p className="fw-bold mb-0">{selectedFood.description}</p>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Donor</h6>
                    <p className="fw-bold mb-0">{selectedFood.organization}</p>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Pickup Address</h6>
                    <p className="fw-bold mb-0">{selectedFood.pickUpAddress}</p>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Expiry Date</h6>
                    <p className="fw-bold mb-0">
                      {new Date(selectedFood.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                <button
                  className="btn btn-success w-50"
                  onClick={() => {
                    FoodAccept(selectedFood._id);
                    setPop(false);
                  }}
                >
                  ✅ Accept
                </button>
                </div>

                <div className="col-12 col-md-6">
                <button
                  className="btn btn-danger w-50"
                  onClick={() => setPop(false)}
                >
                  ↩️ Cancel
                </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
        <Footer/>
    </div>
  )
}
