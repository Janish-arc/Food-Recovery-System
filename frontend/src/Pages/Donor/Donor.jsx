import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { DonateFood, GetDonorFoods, removeError, removeSuccess } from '../../Redux/FoodSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { Footer } from '../../Components/Footer'
import { Pagination } from '../../Components/Pagination'

export const Donor = () => {

  const {user, isAuthenticated} = useSelector((state) => state.user)
  const {food, error, success} = useSelector((state) => state.food)
  const [pop, setPop] = useState(false)
  const [popUp, setPopUp] = useState(false)
  const [selectedFood, setSelectedFood] = useState()
  const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/2515/2515183.png")
  const [foods, setFood] = useState({
    name:"", quantity:"", description:"", expiryDate:"", pickUpAddress:"", organization:""
  })
  const {name, quantity, description, expiryDate, pickUpAddress, organization} = foods
  const [category, setCategory] = useState("Veg")
  const [image, setImage] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFoods = food
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

  const handleChange = (e) => {
    setFood({...foods,[e.target.name]:e.target.value})
  }

  const donateNow = (e) => {
    e.preventDefault();

    if(!name || !category || !quantity || !description || !expiryDate || !pickUpAddress){
      toast.error("Please fill all the required fields", {
        position: "top-center"
      })
      return
    }

    const myform = new FormData();

    myform.set("name", name);
    myform.set("quantity", quantity);
    myform.set("description", description);
    myform.set("expiryDate", expiryDate);
    myform.set("pickUpAddress", pickUpAddress);
    myform.set("image", image);
    myform.set("category", category);
    myform.set("organization", organization)

    dispatch(DonateFood(myform))
  }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const unExpiredFoods = food.filter(
      item => new Date(item.expiryDate) >= today
    );

  useEffect(() => {
    if(error){
      toast.error(error)
      dispatch(removeError())
    }
  },[dispatch, error])

    useEffect(() => {
    if(success){
      toast.success("Food Posted successfully") 
      setFood({
        name:"",  
        quantity:"",
        description:"",
        expiryDate:"",
        pickUpAddress:"",
        organization:""
      })
      setCategory("Veg")
      setImage(null)
      setPreview("https://cdn-icons-png.flaticon.com/512/2515/2515183.png")
      setPop(false)
      dispatch(GetDonorFoods())
      dispatch(removeSuccess())
    }
  },[dispatch, success])

  useEffect(() => {
    if(user?._id){
    dispatch(GetDonorFoods());
  }
  },[dispatch, user?._id])

  useEffect(() => {
  if (location.state?.popUp) {
    setPop(true);
  }
}, [location.state]);

  return (
    <div>
      <Navbar/>

      {isAuthenticated ? (
      <div className="col-md-9 col-lg-10 p-4 container">
        <div className='d-flex flex-column align-items-center'>
          <h2>Welcome {user?.name} 👋</h2>
          <p>Help reduce food waste and feed those in need.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="row g-3 my-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-center p-3">
                <h6>Total Donations</h6>
                {food?.length > 0 ? (
                  <h3>{food.filter(item => item.donorId === user._id).length}</h3>
                ) : (
                  <h3>0</h3>
                )}
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-center p-3">
              <h6>Available</h6>
              <h3>{food.filter(item => item.status === "Available").length}</h3>           
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-center p-3">
              <h6>Out for Delivery</h6>
              <h3>{food.filter(item => item.status === "Out for Delivery").length}</h3>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card text-center p-3">
              <h6>Delivered</h6>
              <h3>{food.filter(item => item.status === "Delivered").length}</h3>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="my-5">
          <h5 className='text-center mb-3'>⚡ Quick Actions</h5>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <button className="btn btn-success" onClick={() => setPop(true)}>
              ➕ Donate Food
            </button>

            <button className="btn btn-primary" onClick={() => navigate("/mydonations")}>
              📦 View Donations
            </button>

            <button className="btn btn-dark" onClick={() => navigate("/myprofile")}>
              🙍 My Profile
            </button>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="p-3">
          <h5 className = "text-center">📜 Recent Donations</h5>
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div className="input-group" style={{ maxWidth: "400px" }}>
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search food, organization, volunteer..."
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

          <div className="table-responsive rounded shadow">
            <table className="table ">
              <thead className='black-header text-center'>
                <tr>
                  <th>Image</th>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Volunteer</th>
                  <th>Volunteer Contact</th>
                  <th>Expiry</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentFoods.length > 0 ? (
                currentFoods.map((donor) => 
                
                <tr key={donor._id} className="align-middle text-center" onClick={(e) => {e.stopPropagation(); setSelectedFood(donor); setPopUp(true)}}>
                  <td style={{width:"100px"}}><img src={donor?.image?.url} style={{width:"70px", height:"70px", objectFit:"cover", borderRadius:"50%"}}/></td>
                  <td ><strong>{donor.name}</strong></td>
                  <td>{donor?.quantity}</td>
                  <td>{donor?.status}</td>
                  <td>{donor?.volunteerId?.name || <span className="text-muted">Not Assigned</span>}</td>
                  <td>{donor?.volunteerId?.phoneNo || <span className="text-muted">Not Assigned</span>}</td>
                  <td>{new Date(donor?.expiryDate).toLocaleDateString()}</td>
                  <td><button className="btn btn-primary">View</button></td>
                </tr>
                )) : (
               <tr>
                <td colSpan="9" className="text-center py-3">
                  <h5>No donations yet</h5>
                </td>
              </tr>)}
              </tbody>
            </table>
          </div>  
        </div>
      </div>
      ):(
        <div className='vh-100 d-flex flex-column align-items-center gap-2' style={{marginTop:"15%"}}>
          <div className='d-flex flex-column align-items-center shadow p-5 rounded'>
            <h2>Please Login to Access</h2>
            <button className='btn button' onClick={() => navigate("/login")}>LOGIN</button>
          </div>
        </div>
      )}

      {pop && 
     <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
        <div className="card shadow p-4 overflow-y-auto" style={{height:"600px", width: "500px", borderRadius: "12px", scrollbarWidth:"none"}}>
          <h4 className="text-center mb-4">Add Donation</h4>

          <form onSubmit={donateNow}>
            <div className="mb-3">
              <label className="form-label">Food Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter food name"
                name='name'
                value={name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Food Category</label>
              <select className='form-select' name='category' value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Veg">Veg Foods</option>
                <option value="NonVeg">Non-veg Foods</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter food Quantity"
                name='quantity'
                value={quantity}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Food Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter food description"
                name='description'
                value={description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Organization Name"
                name='organization'
                value={organization}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Pick-up Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Pick-Up Address"
                name='pickUpAddress'
                value={pickUpAddress}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                name="expiryDate"
                value={expiryDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className='mb-4'>
                <div className='d-flex align-items-center gap-2'>
                  <div>
                    <img src={preview} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"70px", width:"70px" }}/>
                  </div>
                  <div><input className="form-control" type="file" accept="image/*"  onChange={(e) => {const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}/>
                  </div>
                </div>
              </div>
            </div>
            <div className='d-flex gap-2'>
              <button type="submit" className="btn btn-success w-100">Submit</button>
              <button className="btn btn-secondary w-100" onClick={() => setPop(false)}>Cancel</button>
            </div>
            
          </form>
        </div>
      </div>
      }

      {popUp && selectedFood &&(
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
                  <h5 className='text-center'>Volunteer Information</h5>
                  <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Volunteer Name</h6>
                    <p className="fw-bold mb-0">{selectedFood?.volunteerId?.name}</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border rounded p-2">
                    <h6 className="text-muted">Contact Number</h6>
                    <p className="fw-bold mb-0">📞+91 {selectedFood?.volunteerId?.phoneNo}</p>
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

              <div>
                <button
                  className="btn btn-danger w-100"
                  onClick={() => setPopUp(false)}
                >
                  ↩️ Back
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
