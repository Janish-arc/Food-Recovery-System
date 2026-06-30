import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { GetAcceptedFood, AssignedFood, MyDelivery } from '../../Redux/FoodSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../Components/Footer'
import { Pagination } from '../../Components/Pagination'

export const Volunteer = () => {
  const {isAuthenticated, user} = useSelector((state) => state.user)
  const {food, success, mydelivery} = useSelector((state) => state.food)
  const [pop, setPop] = useState(false)
  const [selectedFood, setSelectedFood] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const deliveries = Array.isArray(mydelivery) ? mydelivery : [];
  const foodlist = Array.isArray(food) ? food : [];
  const filteredFoods = foodlist
    .filter((item) => !item.volunteerId)
    .filter(
      (item) =>
        categoryFilter === "all" ||
        item.category === categoryFilter
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.organization.toLowerCase().includes(search.toLowerCase()) ||
        item.pickUpAddress.toLowerCase().includes(search.toLowerCase()) ||
        item.ngoId?.name?.toLowerCase().includes(search.toLowerCase())
    );
  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentFoods = filteredFoods.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);  

  const AvailableDeliveries = foodlist.filter((item) => item.status === "Accepted" && !item.volunteerId).length
  const ActiveDeliveries = deliveries.filter((item) => (item?.status === "Assigned" || item?.status === "Out for Delivery") && item?.volunteerId === user?._id).length
  const CompletedDeliveries = deliveries.filter((item) => item.status === "Delivered" && item?.volunteerId === user?._id).length
  const DeliveredFoodQuantity = deliveries.filter((item) => (
    item.status === "Delivered" &&
    item.volunteerId === user._id
  )).reduce((total, deliveries) => total + deliveries.quantity, 0 )

  const PickUpDelivery = async (id) => {
  const result = await dispatch(AssignedFood(id));

    if (result.payload?.success) {
      toast.success("Order taken successfully");

      dispatch(GetAcceptedFood());
      dispatch(MyDelivery()); // 👈 add this
    }
  };

  const getActivityText = (item) => {
    switch(item.status){
      case "Assigned": return `📦Accepted ${item.name} delivery`
      case "Out for Delivery": return `🚚Pickedup ${item.name}`
      case "Delivered": return `✅ Delivered ${item.name} to ${item.ngoId?.name}`
    }
  }

  const recentActivity = [...mydelivery || []]
  .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0,5)


  useEffect(() => {
    dispatch(GetAcceptedFood())
    dispatch(MyDelivery())
  }, [dispatch])

  return (
    <div>
        <Navbar/>
        
        {isAuthenticated ? (
          <div className="col-md-9 col-lg-10 mt-4 mb-5 container overflow-y-auto" style={{scrollbarWidth: "none"}}>
            <div className='d-flex flex-column align-items-center'>
              <h2>Welcome {user?.name} 👋</h2>
              <p>Help reduce food waste and feed those in need.</p>
            </div>
            
            <div className="row g-3 my-3">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow text-center p-3 border-0">
                  <h6>Available Deliveries</h6>
                  <h3>{AvailableDeliveries}</h3>           
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow text-center p-3 border-0" onClick={() => navigate("/volunteer/mydeliveries")}>
                  <h6>My Active Deliveries</h6>
                  <h3>{ActiveDeliveries}</h3>           
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow text-center p-3 border-0" onClick={() => navigate("/mydeliveredhistory")}>
                  <h6>Completed Deliveries</h6>
                  <h3>{CompletedDeliveries}</h3>           
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow text-center p-3 border-0">
                  <h6>Meals Delivered</h6>
                  <h3>{DeliveredFoodQuantity}</h3>           
                </div>
              </div>

            </div>

            <div className="card shadow mt-4">
              <div className="card-body">
                <h3 className='mb-3'>📋Recent Delivery Update</h3>

                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div key={item._id} className='d-flex justify-content-between'>
                      <span>{getActivityText(item)}</span>
                      <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  ))
                ):(
                <p className="text-muted mb-0">
                  No recent activities available.
                </p>
                )}

              </div>
            </div>

            <div>
              <h2 className='text-center mt-5 mb-3'>Available Deliveries</h2>

              <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
                <div className="input-group" style={{ maxWidth: "400px" }}>
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search food, donor, NGO, address..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div>
                  <select className="form-select" value={categoryFilter} onChange={(e) => {setCategoryFilter(e.target.value); setCurrentPage(1);}}>
                    <option value="all">All Categories</option>
                    <option value="Veg">🥗 Veg</option>
                    <option value="NonVeg">🍗 NonVeg</option>
                    <option value="Snacks">🍪 Snacks</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive" style={{scrollbarWidth:"none"}}>
              <table className="table mt-3 shadow rounded">
                <thead className='black-header text-center'>
                  <tr>
                    <th>Image</th>
                    <th>Food</th>
                    <th>Organization Name</th>
                    <th>Pick Up Address</th>
                    <th>Delivery Address</th>
                    <th>Status</th>
                    <th>Expiry</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFoods.length > 0 ? (
                  currentFoods.map((item) => 
                    <tr key={item._id} className="align-middle text-center">
                      <td><img className='rounded-circle' src={item.image?.url} style={{width:"80px", height:"80px", objectFit:"cover"}}/></td>
                      <td>{item.name}</td>
                      <td>{item.organization}</td>
                      <td className='text-truncate'>{item.pickUpAddress}</td>
                      <td className='text-truncate'>{item?.ngoId?.address}</td>
                      <td>{item.status}</td>
                      <td>{new Date(item?.expiryDate).toLocaleDateString()}</td>
                      <td>{item?.donorId?.phoneNo}</td>
                      <td><button className='btn btn-primary' onClick={(e) => {e.stopPropagation(); setSelectedFood(item); setPop(true)}}>Take Delivery</button></td>
                    </tr>
                  )):(
                    <tr>
                      <td colSpan="9" className="text-center py-3">
                        <h5>📦 No food orders available right now. Check back later for new orders.</h5>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div> 
          ) : (
          <div className='vh-100 d-flex flex-column align-items-center gap-2' style={{marginTop:"15%"}}>
            <div className='d-flex flex-column align-items-center shadow p-5 rounded'>
              <h2>Please Login to Access</h2>
              <button className='btn btn-primary' onClick={() => navigate("/login")}>LOGIN</button>
            </div>
          </div>
          )
        }

        {pop && selectedFood &&(
          <div
            className="position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9999,
            }}
          >
            <div
              className="bg-white rounded shadow-lg p-4 overflow-y-auto"
              style={{ width: "500px", maxWidth: "90%", height:"600px", scrollbarWidth:"none" }}
            >
              <div className="text-center mb-4">
                <h3>🍱 Order Details</h3>
                <p className="text-muted mb-0">
                  Review the order details before taking delivery.
                </p>
              </div>

              <div className="row g-3 mb-4 ms-2">
                
                <div className="row g-3 shadow pb-3 rounded">
                  <h5 className='text-center'>Donor Information</h5>
                  <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Donor Name</h6>
                    <p className="fw-bold mb-0">{selectedFood.donorId?.name}</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Contact Number</h6>
                    <p className="fw-bold mb-0">📞+91 {selectedFood.donorId?.phoneNo}</p>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">PickUp Address</h6>
                    <p className="fw-bold mb-0">{selectedFood.pickUpAddress}</p>
                  </div>
                </div>
                </div>

                <div className="row g-3 shadow pb-3 rounded">
                  <h5 className='text-center'>NGO Information</h5>
                  <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">NGO Name</h6>
                    <p className="fw-bold mb-0">{selectedFood.ngoId?.name}</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Contact Number</h6>
                    <p className="fw-bold mb-0">📞+91 {selectedFood.ngoId?.phoneNo}</p>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Delivery Address</h6>
                    <p className="fw-bold mb-0">{selectedFood.ngoId?.address}</p>
                  </div>
                </div>
                </div>

                <div className="row g-3 shadow pb-3 rounded">
                  <h5 className='text-center'>Food Information</h5>
                  <div className="col-12 d-flex">
                    <div className=" rounded py-2 col-3">
                      <img className="rounded ms-2" src={selectedFood?.image?.url} style={{width:"80px", height:"80px", objectFit:"cover"}}/>
                    </div>
                    <div className="border rounded p-2 col-9">
                      <h6 className="text-muted">Food Name</h6>
                      <p className="fw-bold mb-0">{selectedFood.name}</p>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Quantity</h6>
                      <p className="fw-bold mb-0">{selectedFood.quantity}</p>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Category</h6>
                      <p className="fw-bold mb-0">{selectedFood.category}</p>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Expiry Date</h6>
                      <p className="fw-bold mb-0">{new Date(selectedFood?.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Food Description</h6>
                      <p className="fw-bold mb-0">{selectedFood.description}</p>
                    </div>
                  </div>
                </div>

                <div className="row g-3 shadow pb-3 rounded">
                  <h5 className='text-center'>Delivery Information</h5>
                  <div className="col-12">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Order Status</h6>
                      <p className="fw-bold mb-0">{selectedFood.status}</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success w-50"
                  onClick={() => {
                    PickUpDelivery(selectedFood._id);
                    setPop(false);
                  }}
                >
                  ✅ Take Delivery
                </button>

                <button
                  className="btn btn-danger w-50"
                  onClick={() => setPop(false)}
                >
                  ↩️ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
        <Footer/>
    </div>
  )
}
