import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllFoods } from '../../Redux/FoodSlice'
import { Pagination } from '../../Components/Pagination'

export const NgoFoodHistory = () => {

    const {food} = useSelector((state) => state.food)
    const {user, isAuthenticated} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [selectedFood, setSelectedFood] = useState()
    const [pop, setPop] = useState(false)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const ReceivedFoods = food?.filter((item) => item.status === "Delivered" && item.ngoId._id === user._id)
                          ?.filter((item) => statusFilter === "all" || item.category === statusFilter)
                          .filter((item) => 
                          item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase()) ||
                          item.organization.toLowerCase().includes(search.toLowerCase()));
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentFoods = ReceivedFoods.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(ReceivedFoods.length / itemsPerPage);

    useEffect(() => {
        dispatch(GetAllFoods())
    }, [dispatch])
  return (
    <div>
        <Navbar/>
        <div className="container">
          <h3 className="text-center mt-5">
            <strong>📚 RECEIVED DELIVERIES</strong>
          </h3>
          <div className='d-flex gap-3 align-items-center'>
            <div className='input-group d-flex align-items-center gap-2 border rounded'>
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type='text' className='form-control border-0' style={{height:"38px"}} placeholder='Search Users' value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div> 
            <div className="d-flex justify-content-end my-3">
                  <select
                      className="form-select w-auto"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                  >
                      <option value="all">All Foods</option>
                      <option value="Veg">🥗Veg</option>
                      <option value="Non-veg">🍗Non-veg</option>
                      <option value="Snacks">🍪Snacks</option>
                  </select>
              </div>
            </div>

          {currentFoods.length > 0 ? (
            <>
              
              <div className="table-responsive mt-4 mb-5">
                <table className="table shadow rounded">
                  <thead className="black-header">
                    <tr>
                      <th>Image</th>
                      <th>Food Name</th>
                      <th>Donor</th>
                      <th>Volunteer</th>
                      <th>Quantity</th>
                      <th>Category</th>
                      <th>Received Date</th>
                      <th>Details</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentFoods.map((item) => (
                      <tr key={item._id} className="align-middle">
                        <td>
                          <img
                            src={item.image?.url}
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        </td>

                        <td>{item.name}</td>
                        <td>{item.organization}</td>
                        <td>{item.volunteerId?.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.category}</td>
                        <td>
                          {new Date(item.deliveredDate).toLocaleDateString()}
                        </td>

                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFood(item);
                              setPop(true);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-5">
              <h4>📦 No Foods Delivered to You</h4>
            </div>
          )}
        </div>

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
                    <p className="fw-bold mb-0">{selectedFood.organization}, {selectedFood.pickUpAddress}</p>
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
                  <div className="col-6">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Order Status</h6>
                      <p className="fw-bold mb-0">{selectedFood.status}</p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="border rounded p-2">
                      <h6 className="text-muted">Delivered Date</h6>
                      <p className="fw-bold mb-0">{new Date(selectedFood.deliveredDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => setPop(false)}
                >
                  ↩️ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <Footer/>
    </div>
  )
}
