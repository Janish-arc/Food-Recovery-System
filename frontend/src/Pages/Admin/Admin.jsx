import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllUsers } from '../../Redux/UserSlice'
import { GetAllFoods } from '../../Redux/FoodSlice'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { useNavigate } from 'react-router-dom'

export const Admin = () => {
    const {users, user} = useSelector((state) => state.user)
    const {food} = useSelector((state) => state.food)
    const dispatch = useDispatch()
    const [pop, setPop] = useState(false)
    const [selectedFood, setSelectedFood] = useState()
    const navigate = useNavigate()

    const foodList = Array.isArray(food) ? food : [];
    
    const availableFoods = food.filter(
    item => item.status === "Available"
    ).length;

    const acceptedFoods = food.filter(
    item => item.status === "Accepted"
    ).length;

    const outForDeliveryFoods = food.filter(
    item => item.status === "Out for Delivery"
    ).length;

    const deliveredFoods = food.filter(
    item => item.status === "Delivered"
    ).length;

    const expiredFoods = food.filter(
    item => new Date(item.expiryDate) < new Date() &&
    item.status !== "Delivered"
    ).length;

    const sortedFood = food.slice(0,5);

  const data = [
  { name: "Available", value: availableFoods },
  { name: "Accepted", value: acceptedFoods },
  { name: "Out for Delivery", value: outForDeliveryFoods },
  { name: "Delivered", value: deliveredFoods },
  { name: "Expired", value: expiredFoods },
];

const COLORS = [
  "#28a745",
  "#ffc107",
  "#fd7e14",
  "#0d6efd",
  "#dc3545",
];

//   const availableUrgentFoods = urgentFoods.filter((food) => food.status !== "Delivered");


    useEffect(() => {
        dispatch(GetAllUsers())
    }, [dispatch])

    useEffect(() => {
        dispatch(GetAllFoods())
    }, [dispatch])

  return (
    <div>
        <Navbar/>
            <div className='container mt-5'>
                <div
                className="card border-0 shadow mb-4"
                style={{
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    color: "white"
                }}
                >
                <div className="card-body d-flex flex-column align-items-center">
                    <h2>Welcome Admin {user?.name}👋</h2>
                    <p className="mb-0">
                    Monitor donations, users and food distribution across the platform.
                    </p>
                </div>
                </div>

                <div className='d-flex gap-2 shadow ps-2 pe-3 rounded'>
                <div className="card col-lg-5 my-4">

                    <h2 className='text-center mt-5'>Dashboard Overview ⭐</h2>
                    <p className="text-center text-muted mb-4 mx-3">Monitor users, donations, food availability and delivery activities across the platform.</p>
                    <div className="card-body">
                        <div className="row g-2">

                            <div className="col-6">
                                <div className="card text-center py-2 bg-primary-subtle" onClick={() => navigate("/allUsers")}>
                                    <small>Total Users</small>
                                    <h5 className="mb-0">{users.length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-primary-subtle" onClick={() => navigate("/alldonors")}>
                                    <small>Donors</small>
                                    <h5 className="mb-0">{users.filter(x=>x.role==="donor").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-primary-subtle" onClick={() => navigate("/allngos")}>
                                    <small>NGOs</small>
                                    <h5 className="mb-0">{users.filter(x=>x.role==="ngo").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-primary-subtle" onClick={() => navigate("/allvolunteers")}>
                                    <small>Volunteers</small>
                                    <h5 className="mb-0">{users.filter(x=>x.role==="volunteer").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-success-subtle" onClick={() => navigate("/allfoods")}>
                                    <small>Donations</small>
                                    <h5 className="mb-0">{food.length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-success-subtle" onClick={() => navigate("/allfoods?status=Available")}>
                                    <small>Available</small>
                                    <h5 className="mb-0">{food.filter(x=>x.status==="Available").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-info-subtle" onClick={() => navigate("/allfoods?status=Delivered")}>
                                    <small>Delivered</small>
                                    <h5 className="mb-0">{food.filter(x=>x.status==="Delivered").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-info-subtle" onClick={() => navigate("/allfoods?status=Accepted")}>
                                    <small>Accepted</small>
                                    <h5 className="mb-0">{food.filter(x=>x.status==="Accepted").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-warning-subtle" onClick={() => navigate("/allfoods?status=Out for Delivery")}>
                                    <small>Out For Delivery</small>
                                    <h5 className="mb-0">{food.filter(x=>x.status==="Out for Delivery").length}</h5>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="card text-center py-2 bg-danger-subtle"onClick={() => navigate("/allfoods?status=Expired")}>
                                    <small>Expired</small>
                                    <h5 className="mb-0">{expiredFoods}</h5>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="card col-lg-7 shadow my-4">
                    <div className="card-body">
                        <h5 className="text-center mb-3">Food Distribution Status</h5>
                        <ResponsiveContainer width="100%" height={450}>
                        <PieChart>
                            <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={200}
                            label={false}
                            >
                            {data.map((entry, index) => (
                                <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                </div>

                <h3 className='text-center mt-5'>Recent Donations</h3>
                <div className='table-responsive my-4 shadow rounded'>
                    <table className='table'>
                        <thead className='black-header text-center'>
                            <tr>
                                <th>Image</th>
                                <th>Food</th>
                                <th>Donor</th>
                                <th>NGO</th>
                                <th>Volunteer</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedFood.map((item) => (
                            <tr key={item?._id} className='align-middle text-center'>
                                <td><img src={item.image?.url} style={{width:"70px", height:"70px", borderRadius:"50%", objectFit:"cover"}}/></td>
                                <td>{item.name}</td>
                                <td>{item.donorId?.name}</td>
                                <td>{item.ngoId?.name || <small className='text-muted'>Not Accepted</small>}</td>
                                <td>{item.volunteerId?.name || <small className='text-muted'>Not Assigned</small>}</td>
                                <td className='align-middle'><h6 className={`badge ${item.status === "Delivered" ? "bg-danger" : item.status === "Available" ? "bg-success" : "bg-warning"}`} style={{fontSize:"15px"}}>{item.status}</h6></td>
                                <td><button className='btn button' onClick={() => {setSelectedFood(item); setPop(true)}}>View Details</button></td>
                            </tr>
                            ))}
                        </tbody>
                        
                    </table>

                </div>
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
                  Review the order details
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
                  className="btn btn-danger w-100"
                  onClick={() => setPop(false)}
                >
                  ↩️ Back
                </button>
              </div>
            </div>
          </div>
        )}
        <Footer/>
    </div>
  )
}
