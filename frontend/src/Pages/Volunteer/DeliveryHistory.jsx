import React, { useState, useEffect } from 'react'
import { Navbar } from '../../Components/Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { Footer } from '../../Components/Footer'
import { Pagination } from '../../Components/Pagination'
import { MyDelivery } from '../../Redux/FoodSlice'

export const DeliveryHistory = () => {

    const {mydelivery} = useSelector((state) => state.food)
    const [selectedFood, setSelectedFood] = useState()
    const [pop, setPop] = useState(false)
    const dispatch = useDispatch()
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredFoods = mydelivery
    .filter((item) => item.status === "Delivered")
    .filter(
      (item) =>
        categoryFilter === "all" ||
        item.category === categoryFilter
    )
    .filter(
      (item) =>
        (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.donorId?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.ngoId?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.pickUpAddress || "").toLowerCase().includes(search.toLowerCase())
    );
    const itemsPerPage = 10;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentFoods = filteredFoods.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);  

    const getUrgencyColor = (expiryDate) => {
        const diffInHours = (new Date(expiryDate) - new Date())/1000*60*60
        if(diffInHours <=2 ) return "text-danger"
        if(diffInHours <=24) return "text-warning"
        else return "text-success"
    }

    useEffect(() => {
      dispatch(MyDelivery())
    }, [dispatch])
  return (
    <div>
        <Navbar/>

        <div className='container table-responsive mt-5' style={{scrollbarWidth:"none"}}>
          <h3 className='text-center'><strong>📚HISTORY</strong></h3>
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

            <table className="table mt-4 shadow rounded">
            <thead className='black-header'>
                <tr>
                <th>Image</th>
                <th>Food Name</th>
                <th>Donor</th>
                <th>NGO</th>
                <th>Quantity</th>
                <th>Delivered Date</th>
                <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {currentFoods.length > 0 ? (
                currentFoods.map((item) => (
                    
                    <tr key={item._id} className="align-middle">
                        <td>
                        <img
                            className="rounded-circle"
                            src={item.image?.url}
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            alt={item.name}
                        />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.donorId?.name}</td>
                        <td>{item.ngoId?.name}</td>
                        <td>{item.quantity}</td>
                        <td>{new Date(item.deliveredDate).toLocaleDateString()}</td>
                        <td><button className='btn button' onClick={(e) => {e.stopPropagation(); setSelectedFood(item); setPop(true)}}>View Details</button></td>
                    </tr> 
                    ))
                ) : (
                <tr>
                    <td colSpan="9" className="text-center py-3">
                    <h5>📦 No delivered food found.</h5>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
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
                      <p className="fw-bold mb-0">{selectedFood.pickUpAddress}</p>
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                          onClick={() =>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFood.pickUpAddress)}`,"_blank")}>
                        📍 Open in Maps
                      </button>
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
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() =>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFood.ngoId?.address)}`,"_blank")}>
                        📍 Open in Maps
                      </button>
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

                    <div className="col-6">
                      <div className="border rounded p-2">
                        <h6 className="text-muted">Quantity</h6>
                        <p className="fw-bold mb-0">{selectedFood.quantity}</p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded p-2">
                        <h6 className="text-muted">Category</h6>
                        <p className="fw-bold mb-0">{selectedFood.category}</p>
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
                        <h6 className="text-muted">Expiry Date</h6>
                        <p className={`fw-bold mb-0 ${getUrgencyColor(selectedFood.expiryDate)}`}>{new Date(selectedFood.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 col-12 pe-2">
                  {selectedFood.status === "Assigned" && (
                    <button
                      className="btn button col-6"
                      onClick={() => {PickedUp(selectedFood._id); setPop(false)}}
                    >
                      Out for Delivery
                    </button>
                  )}

                  {selectedFood.status === "Out for Delivery" && (
                    <button
                      className="btn button col-6"
                      onClick={() => {Delivered(selectedFood._id); setPop(false)}}
                    >
                      Delivered
                    </button>
                  )}

                  <button
                    className="btn btn-danger col-12"
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
