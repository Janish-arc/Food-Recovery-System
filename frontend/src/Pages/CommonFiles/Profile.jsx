import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { GetAllFoods } from '../../Redux/FoodSlice'
import { Eye, EyeOff } from 'lucide-react'
import { GetSingleUser, removeError, removeSuccess, UpdateProfile } from '../../Redux/UserSlice'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

export const Profile = () => {

    const {user, users, error, success, singleuser} = useSelector((state) => state.user)
    const {food, mydelivery} = useSelector((state) => state.food)
    const dispatch = useDispatch()
    const {id} = useParams()
    const profileData = id ? singleuser : user;

    const [pop, setPop] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
    const [userdata, setUser] = useState({
        name:"", email:"", password:"", phoneNo:"", role:"", address:"", country:"", pincode:""
      })
    const {name, email, password, phoneNo, address, country, pincode} = userdata
    const [role, setRole] = useState("donor")
    const [image, setImage] = useState(preview)

    useEffect(() => {
        if(id){
            dispatch(GetSingleUser(id))
        }
    }, [dispatch, id])

    useEffect(() => {
    if(user){
        setUser({
            name: user?.name || "",
            email: user?.email || "",
            phoneNo: user?.phoneNo || "",
            address: user?.address || "",
            country: user?.country || "",
            pincode: user?.pincode || ""
        });

        setRole(user.role || "");
        setPreview(
            user.image?.url ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        );
    }
    }, [user]);

    const getInitials = (name = '') =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

    const updateNow = (e) => {
    e.preventDefault();
    const myform = new FormData();
    
    myform.set("name", name);
    myform.set("email", email);
    myform.set("role", role);
    myform.set("phoneNo", phoneNo);
    myform.set("address", address);
    myform.set("country", country);
    myform.set("pincode", pincode);
    if(image){
        myform.set("image", image);
    }
      dispatch(UpdateProfile(myform));
      setPop(false)
    };

    const handleChange = (e) => {
        setUser({...userdata, [e.target.name]:e.target.value})
    }

    useEffect(() => {
        if(error){
            toast.error(error, {position: 'top-center', autoClose: 3000})
            dispatch(removeError())
        }
    }, [dispatch, error])
    
    useEffect(() => {
        dispatch(GetAllFoods())
    }, [dispatch])

  

  return (
    <div>
        <Navbar/>
    
        <div className="px-4 py-4">
        <h2 className='text-center mb-3'><strong>🙍MY ACCOUNT</strong></h2>
        <div className='shadow card' style={{ borderRadius: 12, overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
            
            {/* ── Hero Header ── */}
            <div style={{
            background: '#6c63ff', padding: '2rem',
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
            }}>
            {/* Avatar */}
            <div style={{
                width: 100, height: 100, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.4)',
                background: '#4f46e5', overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 500, color: 'white',
            }}>
                {profileData?.image?.url
                ? <img src={profileData.image.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : getInitials(profileData?.name)}
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Welcome back,</p>
                <h3 style={{ fontWeight: 500, color: 'white', marginBottom: 4 }}>{profileData?.name}</h3>
                <span className='rounded-pill' style={{
                fontSize: 15, background: 'rgba(255,255,255,0.18)', color: 'white',
                padding: '3px 12px'
                }}>
                {profileData?.role === "donor" ? "Donor" :  profileData?.role === "ngo" ? "Ngo" : profileData?.role === "volunteer" ? "Volunteer" : profileData?.role === "admin" ? "Admin" : ""}
                </span>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop:8 }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.83)'}}><b>Email: </b> {profileData?.email}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.83)'}}><b>Phone No:</b> +91 {profileData?.phoneNo}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.83)'}}><b>Address: </b>{profileData?.address}</span>
                </div>
            </div>

            {/* Edit button */}
            <button className='btn btn-dark' onClick={() => setPop(true)}>Edit profile</button>
            </div>

            {/* ── Content ── */}
            <div style={{ background: '#fff', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Profile details */}
            <div>
                <h3 style={{fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: '0.75rem' }}>
                Profile details
                </h3>

                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '1rem' }}>
                    {[
                        { label: 'Name',    value: profileData?.name },
                        { label: 'Role',    value: profileData?.role === "donor" ? "Donor" :  profileData?.role === "ngo" ? "Ngo" : profileData?.role === "volunteer" ? "Volunteer" : profileData?.role === "admin" ? "Admin" : ""},
                        { label: 'Joined',  value: profileData?.createdAt ? new Date(profileData?.createdAt).toLocaleDateString() : '—' },
                        { label: 'Address', value: profileData?.address },
                        { label: 'Country', value: profileData?.country },
                        { label: 'Pincode', value: profileData?.pincode },
                    ].map(({ label, value }) => (
                        <div key={label} style={{display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid #e2e8f0',}}>
                        <span style={{ width: '35%', color: '#6b7280', flexShrink: 0 }}>
                            {label}
                        </span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {value || '—'}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Donation overview */}
                {profileData?.role === "donor" && 
                <div>
                    <h4 style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Donation overview
                    </h4>

                    {/* Total bar */}
                    <div style={{
                    background: '#6c63ff', borderRadius: 8, padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem',
                    }}>
                    <div>
                        <h4 style={{ color: 'rgba(255,255,255,0.8)' }}>Total donations</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>All time contributions</p>
                    </div>
                    <p style={{ fontSize: 26, fontWeight: 500, color: 'white' }}>{(food.filter((item) => item.donorId?._id === profileData._id)).length}</p>
                    </div>

                    {/* Breakdown grid */}
                    <div className='col-12 d-flex gap-2 pe-4'>
                        <div className='col-3 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Available</p>
                            <p className="mt-0" style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item?.status === "Available" && item?.donorId?._id === profileData._id)).length}</p>
                        </div>
                        <div className='col-3 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"20px", fontWeight:600}}>Accepted</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Accepted" && item?.donorId?._id === profileData._id)).length}</p>
                        </div>
                        <div className='col-3 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"20px", fontWeight:600}}>Out for Delivery</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Out for Delivery" && item?.donorId?._id === profileData._id)).length}</p>
                        </div>
                        <div className='col-3 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"20px", fontWeight:600}}>Delivered</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Delivered" && item?.donorId?._id === profileData._id)).length}</p>
                        </div>
                    </div>
                </div>
                }

                {profileData?.role === "ngo" && 
                <div>
                    <h4 style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    My Orders overview
                    </h4>

                    {/* Total bar */}
                    <div style={{
                    background: '#6c63ff', borderRadius: 8, padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem',
                    }}>
                    <div>
                        <h4 style={{ color: 'rgba(255,255,255,0.8)' }}>Total Orders</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>All time contributions</p>
                    </div>
                    <p style={{ fontSize: 26, fontWeight: 500, color: 'white' }}>{(food.filter((item) => item?.ngoId?._id === user?._id)).length}</p>
                    </div>

                    {/* Breakdown grid */}
                    <div className='col-12 d-flex gap-2 pe-4'>
                        <div className='col-4 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Accepted Orders</p>
                            <p className="mt-0" style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Accepted")).length}</p>
                        </div>
                        <div className='col-4 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Received Orders</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Delivered" && item?.ngoId._id === user._id)).length}</p>
                        </div>
                        <div className='col-4 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Received Meals</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Delivered" && item?.ngoId?._id === user._id)).reduce((total, food) => total + food.quantity, 0)}</p>
                        </div>
                    </div>
                </div>
                }

                {profileData?.role === "volunteer" && 
                <div>
                    <h4 style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    My Orders overview
                    </h4>

                    {/* Total bar */}
                    <div style={{
                    background: '#6c63ff', borderRadius: 8, padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem',
                    }}>
                    <div>
                        <h4 style={{ color: 'rgba(255,255,255,0.8)' }}>Total Deliveries</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>All time contributions</p>
                    </div>
                    <p style={{ fontSize: 26, fontWeight: 500, color: 'white' }}>{(food.filter((item) => item.status === "Delivered" && item?.volunteerId?._id === user._id)).length}</p>
                    </div>

                    {/* Breakdown grid */}
                    <div className='col-12 d-flex gap-2 pe-4'>
                        <div className='col-4 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Available Deliveries</p>
                            <p className="mt-0" style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Accepted")).length}</p>
                        </div>
                        <div className='col-4 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Active Deliveries</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => (item.status === "Assigned" || item.status === "Out for Delivery") && item?.volunteerId._id === user._id)).length}</p>
                        </div>
                        <div className='col-4 shadow rounded d-flex flex-column align-items-center'>
                            <p style={{fontSize:"17px", fontWeight:600}}>Meals Delivered</p>
                            <p style={{fontSize:"20px", fontWeight:600}}>{(food.filter((item) => item.status === "Delivered" && item?.volunteerId?._id === user._id)).reduce((total, food) => total + food.quantity, 0)}</p>
                        </div>
                    </div>
                </div>
                }

                {profileData?.role === "admin" &&
                <div>
                    <h4
                        style={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            marginBottom: "0.75rem"
                        }}
                    >
                        Admin Overview
                    </h4>

                    <div
                        style={{
                            background: "#6c63ff",
                            borderRadius: 8,
                            padding: "1rem 1.25rem",
                            color: "white",
                            marginBottom: "1rem"
                        }}
                    >
                        <h4>Platform Summary</h4>
                        <p>Monitor users, donations and food distribution.</p>
                    </div>

                    <div className="row g-2">

                        <div className="col-6">
                            <div className="card shadow-sm text-center p-3">
                                <h6>Total Users</h6>
                                <h4>{users?.length}</h4>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="card shadow-sm text-center p-3">
                                <h6>Total Donations</h6>
                                <h4>{food.length}</h4>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="card shadow-sm text-center p-3">
                                <h6>Total NGOs</h6>
                                <h4>{users.filter(u => u?.role === "ngo").length}</h4>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="card shadow-sm text-center p-3">
                                <h6>Total Volunteers</h6>
                                <h4>{users.filter(u => u?.role === "volunteer").length}</h4>
                            </div>
                        </div>

                    </div>
                </div>
                }

            </div>
        </div>
        </div>

        {pop &&
        <div className='position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center' 
        style={{zIndex:1000, backgroundColor:"rgba(0,0,0,0.5)"}}>
            <div className="bg-white rounded shadow-lg p-4 overflow-y-auto" style={{width:"500px", height:"600px", scrollbarWidth:"none"}}>
                <h2 className='text-center'>Edit Profile</h2>
                <form onSubmit={updateNow}>
                    <div className='d-flex flex-column gap-4'>
                    <div>
                    <h6>Name</h6>
                    <input className="form-control" type="text" placeholder='Enter your Name' 
                    name='name' value={name} onChange={handleChange}/>
                    </div>
                    <div >
                    <h6>Email</h6>
                    <input className="form-control" type="text" placeholder='Enter your email' 
                    name='email' value={email} onChange={handleChange}/>
                    </div>
                    <div>
                        <h6>Role</h6>
                        <select className='form-control form-select' name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)} style={{cursor:"pointer"}}>
                            <option value="donor">Donor</option>
                            <option value="ngo">NGO</option>
                            <option value="volunteer">Volunteer</option>
                        </select>
                    </div>
                    <div>
                    <h6>Phone No.</h6>
                    <input className='form-control' type="number" placeholder='Enter your Contact Number'
                    name='phoneNo' value={phoneNo} onChange={handleChange}/>
                    </div>
                    <div >
                    <h6>Address</h6>
                    <input className="form-control" type="text" placeholder='Enter your Address' 
                    name='address' value={address} onChange={handleChange}/>
                    </div>
                    <div >
                    <h6>Country</h6>
                    <input className="form-control" type="text" placeholder='Enter your Country' 
                    name='country' value={country} onChange={handleChange}/>
                    </div>
                    <div >
                    <h6>Pincode</h6>
                    <input className="form-control" type="Number" placeholder='Enter your Pincode' 
                    name='pincode' value={pincode} onChange={handleChange}/>
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
                    <div className='d-flex gap-2'>
                        <button type='submit' className="btn w-50 rounded-pill" style={{backgroundColor:"#217fea", color:"white"}}>Update</button>
                        <button className='w-50 btn btn-danger rounded-pill' onClick={() => setPop(false)}>Cancel</button>
                    </div>
                    </div>
                </div>
                </form>
                
            </div>
        </div>
        }
      <Footer/>
    </div>
  )
}
