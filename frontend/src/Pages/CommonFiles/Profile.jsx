import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { GetAllFoods } from '../../Redux/FoodSlice'
import {
    Eye, EyeOff, Mail, Phone, MapPin, Calendar, ShieldCheck,
    Users, Truck, Salad, Settings, Lock, LogOut, Edit2,
    Package, Heart, Star, IndianRupee, ClipboardList,
    CheckCircle2, Clock, Bike, XCircle, ChefHat 
} from 'lucide-react'
import { GetAllUsers, GetSingleUser, logout, MyProfile, removeError, removeSuccess, UpdateProfile } from '../../Redux/UserSlice'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { GetMyOrder } from '../../Redux/OrderSlice'
import { CreateRestaurant } from '../../Redux/RestaurantSlice'

// Status -> icon/color config, kept in the same spirit as the My Orders page
const STATUS_META = {
    pending:   { label: 'Pending',   color: '#b45309', bg: '#fef3c7', icon: Clock },
    confirmed: { label: 'Confirmed', color: '#1d4ed8', bg: '#dbeafe', icon: CheckCircle2 },
    preparing: { label: 'Preparing', color: '#7c3aed', bg: '#ede9fe', icon: Package },
    out:       { label: 'Out for delivery', color: '#0369a1', bg: '#e0f2fe', icon: Bike },
    delivered: { label: 'Delivered', color: '#15803d', bg: '#dcfce7', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2', icon: XCircle },
}

const getStatusMeta = (status) => STATUS_META[status?.toLowerCase()] || {
    label: status || 'Processing', color: '#475569', bg: '#f1f5f9', icon: Truck
}

export const Profile = () => {

    const {user, users, error, success, singleuser} = useSelector((state) => state.user)
    const {food, mydelivery} = useSelector((state) => state.food)
    const {order} = useSelector((state) => state.order)
    const {success: restaurantSuccess} = useSelector((state) => state.restaurant)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const profileData = id ? singleuser : user;
    const [pop, setPop] = useState(false)
    const [popUp, setPopUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
    const [restaurantPreview, setRestaurantPreview] = useState("https://png.pngtree.com/png-clipart/20250601/original/pngtree-classic-restaurant-logo-with-cutlery-and-plate-png-image_21108177.png");
    const [restaurantLogo, setRestaurantLogo] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
    const [userdata, setUser] = useState({
        name:"", email:"", password:"", phoneNo:"", state:"", address:"", country:"", pincode:""
    })
    const [restaurant, setRestaurant] = useState({
        name:"", description:"", email:"", phone:"", state:"", address:"", city:"", pincode:"", location:"", openingTime:"", closingTime:"", deliveryFee:"", minimumOrder:"", deliveryTime:""
    })
    const {name, email, password, phoneNo, address, state: userState, country, pincode} = userdata
    const {name: restaurantName, description, email: restaurantEmail, phone, state: restaurantState, address: restaurantAddress, city, pincode: restaurantPincode, location, openingTime, closingTime, deliveryFee, minimumOrder, deliveryTime} = restaurant
    const [image, setImage] = useState(preview)
    const [resImage, setResImage] = useState(null)
    const [logoImage, setLogoImage] = useState(null)

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
            state: user?.state || "",
            country: user?.country || "",
            pincode: user?.pincode || ""
        });
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
    myform.set("phoneNo", phoneNo);
    myform.set("address", address);
    myform.set("state", userState);
    myform.set("country", country);
    myform.set("pincode", pincode);
    if(image){
        myform.set("image", image);
    }
      dispatch(UpdateProfile(myform));
      setPop(false)
    };

    const handleChange = (e) => {
        const updatedData = {
        ...userdata,
        [e.target.name]: e.target.value,
    };
    setUser(updatedData);
    }

    const createRestaurant = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("name", restaurantName);
    myform.set("description", description);
    myform.set("email", restaurantEmail);
    myform.set("phone", phone);
    myform.set("address", restaurantAddress);
    myform.set("city", city);
    myform.set("state", restaurantState);
    myform.set("pincode", restaurantPincode);
    myform.set("location", location);
    myform.set("openingTime", openingTime);
    myform.set("closingTime", closingTime);
    myform.set("deliveryFee", deliveryFee);
    myform.set("minimumOrder", minimumOrder);
    myform.set("deliveryTime", deliveryTime);
    if (resImage) {
        myform.set("banner", resImage);
    }
    if (logoImage) {
        myform.set("logo", logoImage);
    }
    dispatch(CreateRestaurant(myform));
    if (restaurantSuccess) {
        setPopUp(false);
    }
    };

    const handleCreateRestaurant = (e) => {
        setRestaurant({
            ...restaurant,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (restaurantSuccess) {
            dispatch(MyProfile())
            setPopUp(false);
            dispatch(removeSuccess());
        }
    }, [restaurantSuccess, dispatch]);

    useEffect(() => {
        dispatch(GetAllFoods())
        if(error){
            toast.error(error, {position: 'top-center', autoClose: 3000})
            dispatch(removeError())
        }
    }, [dispatch, error])

    useEffect(() => {
        dispatch(MyProfile())
        if (user?.role === "admin"){
            dispatch(GetAllUsers())
        }
        if (user?.role === "customer") {
            dispatch(GetMyOrder());
        }
    }, [dispatch])

    const recentOrders = [...(order || [])]
        .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        .slice(0, 4)

    const customerUsers = users.filter((user) => user.role === "customer")
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
    <div>
        <Navbar/>

        <div className="px-3 px-md-4 py-4 home">
            <h2 className='text-center mb-3'><strong>🙍 MY ACCOUNT</strong></h2>
            <div className='shadow card border-0' style={{ borderRadius: 16, overflow: 'hidden' }}>

                {/* ── Hero Header ── */}
                <div className="d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 text-center text-md-start"
                    style={{ background: '#6c63ff', padding: '1.75rem 1.5rem' }}>

                    {/* Avatar */}
                    <div style={{
                        width: 104, height: 104, borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.4)',
                        background: '#4f46e5', overflow: 'hidden', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, fontWeight: 500, color: 'white',
                    }}>
                        {profileData?.image?.url
                        ? <img src={profileData.image.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : getInitials(profileData?.name)}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                            <h3 className="mb-0" style={{ fontWeight: 600, color: 'white' }}>{profileData?.name}</h3>
                            {profileData?.role &&
                            <span className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1"
                                style={{ background: 'rgba(255,255,255,0.18)', color: 'white', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                                <ShieldCheck size={13}/> {profileData?.role}
                            </span>}
                        </div>

                        <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-md-start gap-2 gap-sm-3 mt-2">
                            <span className="d-inline-flex align-items-center gap-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                                <Mail size={14}/> {profileData?.email}
                            </span>
                            <span className="d-inline-flex align-items-center gap-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                                <Phone size={14}/> +91 {profileData?.phoneNo}
                            </span>
                            {profileData?.address &&
                            <span className="d-inline-flex align-items-center gap-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                                <MapPin size={14}/> {profileData.address}
                            </span>}
                        </div>
                    </div>

                    {/* Edit button */}
                    <button
                        className='btn btn-light rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2 flex-shrink-0'
                        onClick={() => setPop(true)}
                    >
                        <Edit2 size={15}/> Edit profile
                    </button>
                </div>

                {/* ── Content ── */}
                <div className="p-3 p-md-4" style={{ background: '#f8fafc' }}>
                    <div className='row g-3'>

                        {/* Profile details card */}
                        <div className='col-12 col-lg-7'>
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                                <div className="card-body">
                                    <h6 className="text-uppercase text-muted mb-3" style={{ letterSpacing: 0.8, fontSize: 13, fontWeight: 700 }}>
                                        Profile details
                                    </h6>

                                    {[
                                        { label: 'Name',    value: profileData?.name,    icon: Users },
                                        { label: 'Joined',  value: profileData?.createdAt ? new Date(profileData?.createdAt).toLocaleDateString() : '—', icon: Calendar },
                                        { label: 'Address', value: profileData?.address, icon: MapPin },
                                        { label: 'State',   value: profileData?.state,   icon: MapPin },
                                        { label: 'Country',  value: profileData?.country, icon: MapPin },
                                        { label: 'Pincode', value: profileData?.pincode, icon: MapPin },
                                    ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="d-flex align-items-center py-2"
                                        style={{ borderBottom: '1px solid #eef1f5' }}>
                                        <span className="d-inline-flex align-items-center gap-2 text-muted" style={{ width: '38%', flexShrink: 0, fontSize: 14 }}>
                                            <Icon size={14}/> {label}
                                        </span>
                                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 14, wordBreak: 'break-word' }}>
                                            {value || '—'}
                                        </span>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Role-based card */}
                        <div className='col-12 col-lg-5'>
                            {profileData?.role === "admin" &&
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                                <div className="card-body">
                                    <h6 className="text-uppercase text-muted mb-3" style={{ letterSpacing: 0.8, fontSize: 13, fontWeight: 700 }}>
                                        Admin overview
                                    </h6>

                                    <div className="rounded-3 p-3 mb-3 text-white" style={{ background: '#6c63ff' }}>
                                        <div className="fw-semibold mb-1">Platform summary</div>
                                        <small style={{ opacity: 0.85 }}>Monitor users, orders and food listings.</small>
                                    </div>

                                    <div className="row g-2">
                                        <div className="col-6">
                                            <div className="border rounded-3 text-center p-3 h-100">
                                                <Users size={18} className="mb-1" style={{ color: '#6c63ff' }}/>
                                                <h5 className="mb-0 fw-bold">{customerUsers?.length}</h5>
                                                <small className="text-muted">Total Customers</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="border rounded-3 text-center p-3 h-100">
                                                <Salad size={18} className="mb-1" style={{ color: '#6c63ff' }}/>
                                                <h5 className="mb-0 fw-bold">{food?.length}</h5>
                                                <small className="text-muted">Total foods available</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="border rounded-3 text-center p-3 h-100">
                                                <Package size={18} className="mb-1" style={{ color: '#6c63ff' }}/>
                                                <h5 className="mb-0 fw-bold">{order?.length || 0}</h5>
                                                <small className="text-muted">Total orders</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="border rounded-3 text-center p-3 h-100">
                                                <Clock size={18} className="mb-1" style={{ color: '#6c63ff' }}/>
                                                <h5 className="mb-0 fw-bold">
                                                    {order?.filter(o => ['pending', 'processing', 'placed'].includes(o?.status?.toLowerCase())).length || 0}
                                                </h5>
                                                <small className="text-muted">Pending orders</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }

                            {profileData?.role === "customer" &&
                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                                <div className="card-body">
                                    <h6 className="text-uppercase text-muted mb-3" style={{ letterSpacing: 0.8, fontSize: 13, fontWeight: 700 }}>
                                        Quick actions
                                    </h6>
                                    <div className="d-flex flex-column gap-2">
                                        <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => setPop(true)}>
                                            <Edit2 size={15}/> Edit profile
                                        </button>
                                        <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2">
                                            <MapPin size={15}/> Manage addresses
                                        </button>
                                        <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2">
                                            <Lock size={15}/> Change password
                                        </button>
                                        <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => setPopUp(true)}>
                                            <ChefHat size={15}/> Become a Restaurant
                                        </button>
                                        <button className="btn btn-outline-danger rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => logoutUser()}>
                                            <LogOut size={15}/> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                            }

                            {profileData?.role === "restaurant" &&
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                            <div className="card-body">
                                <h6 className="text-uppercase text-muted mb-3" style={{ letterSpacing: 0.8, fontSize: 13, fontWeight: 700 }}>Restaurant Dashboard</h6>

                                <div className="d-flex flex-column gap-2">
                                    <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/restaurant/dashboard")}>
                                        <ChefHat size={15}/> Restaurant Dashboard
                                    </button>
                                    <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/restaurant/menu")}>
                                        <Salad size={15}/> Manage Menu
                                    </button>
                                    <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/restaurant/orders")}>
                                        <Package size={15}/> Orders
                                    </button>
                                    <button className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => navigate("/restaurant/reviews")}>
                                        <Star size={15}/> Reviews
                                    </button>
                                    <button className="btn btn-outline-danger rounded-pill d-flex align-items-center justify-content-center gap-2" onClick={() => logoutUser()}>
                                        <LogOut size={15}/> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                        }
                        </div>

                        {/* Stats row — customers only, matches existing stat cards */}
                        {profileData?.role === "customer" &&
                        <div className="col-12">
                            <h6 className="text-uppercase text-muted mt-2 mb-2" style={{ letterSpacing: 0.8, fontSize: 13, fontWeight: 700 }}>
                                Statistics
                            </h6>
                            <div className="row g-2 g-md-3">
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 12 }}>
                                        <div className="card-body py-3">
                                            <Package size={20} style={{ color: '#6c63ff' }}/>
                                            <h5 className="fw-bold mt-1 mb-0">{order?.length || 0}</h5>
                                            <small className="text-muted">Orders</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 12 }}>
                                        <div className="card-body py-3">
                                            <Heart size={20} style={{ color: '#e0245e' }}/>
                                            <h5 className="fw-bold mt-1 mb-0">18</h5>
                                            <small className="text-muted">Favorites</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 12 }}>
                                        <div className="card-body py-3">
                                            <Star size={20} style={{ color: '#f4b400' }}/>
                                            <h5 className="fw-bold mt-1 mb-0">8</h5>
                                            <small className="text-muted">Reviews</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm text-center h-100" style={{ borderRadius: 12 }}>
                                        <div className="card-body py-3">
                                            <IndianRupee size={20} style={{ color: '#15803d' }}/>
                                            <h5 className="fw-bold mt-1 mb-0">₹{order?.reduce((sum, orderItem) => sum + orderItem.totalAmount,0)}</h5>
                                            <small className="text-muted">Spent</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }

                        {/* Recent orders */}
                        {profileData?.role === "customer" &&
                        <div className="col-12">
                            <div className="card border-0 shadow-sm mt-1" style={{ borderRadius: 12 }}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6 className="text-uppercase text-muted mb-0" style={{ fontSize: 15, fontWeight: 700 }}>Recent orders</ h6>
                                        {recentOrders.length > 0 &&
                                        <div className="text-decoration-none" style={{ fontSize: 15, fontWeight: 600, color: '#6c63ff', cursor: "pointer" }} onClick={() => navigate("/myorder")}>View all</div>}
                                    </div>

                                    {recentOrders.length === 0
                                    ? <div className="text-center text-muted py-4">
                                        <ClipboardList size={28} className="mb-2"/>
                                        <div style={{ fontSize: 14 }}>No orders yet</div>
                                    </div>
                                    : <div className="d-flex flex-column gap-2">
                                        {recentOrders.map((o) => {
                                            const meta = getStatusMeta(o?.orderStatus)
                                            const StatusIcon = meta.icon
                                            const itemCount = o?.orderItems?.length ?? o?.items?.length ?? o?.foodItems?.length
                                            const amount = o?.totalAmount ?? o?.totalPrice ?? o?.amount
                                            return (
                                            <div key={o?._id} className="d-flex align-items-center justify-content-between gap-2 p-2 p-md-3 rounded-3"
                                                style={{ background: '#f8fafc' }}>
                                                <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                                                    <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                                                        style={{ width: 36, height: 36, borderRadius: '50%', background: meta.bg, color: meta.color }}>
                                                        <StatusIcon size={16}/>
                                                    </div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div className="fw-semibold" style={{ fontSize: 14 }}>
                                                            Order #{o?._id?.slice(-6) || '—'}
                                                        </div>
                                                        <small className="text-muted">
                                                            {o?.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                                                            {itemCount ? ` · ${itemCount} item${itemCount > 1 ? 's' : ''}` : ''}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="text-end flex-shrink-0">
                                                    <span className="d-inline-block rounded-pill px-2 py-1 mb-1"
                                                        style={{ background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 700 }}>
                                                        {meta.label}
                                                    </span>
                                                    {amount != null && <div className="fw-bold" style={{ fontSize: 14 }}>₹{amount}</div>}
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </div>}
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>

        {pop &&
        <div className='position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center px-3'
        style={{zIndex:1000, backgroundColor:"rgba(0,0,0,0.5)"}}>
            <div className="bg-white rounded shadow-lg p-4 overflow-y-auto w-100" style={{maxWidth:"550px", maxHeight:"90vh", scrollbarWidth:"none"}}>
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
                    <div >
                    <h6>State</h6>
                    <input className="form-control" type="text" placeholder="Enter your State"
                    name="state" value={userdata.state} onChange={handleChange}/>
                    </div>
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

        {popUp &&
        <div className='position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center px-3'
        style={{zIndex:1000, backgroundColor:"rgba(0,0,0,0.5)"}}>
            <div className="bg-white rounded shadow-lg p-4 overflow-y-auto w-100" style={{maxWidth:"550px", maxHeight:"90vh", scrollbarWidth:"none"}}>
                <h2 className='text-center'>Become a Restaurant</h2>
                <form onSubmit={createRestaurant}>
                    <div className='d-flex flex-column gap-4'>
                    <div>
                    <h6>Name</h6>
                    <input className="form-control" type="text" placeholder='Enter Restaurant Name' 
                    name='name' value={restaurantName} onChange={handleCreateRestaurant}/>
                    </div>
                    <div>
                    <h6>Description</h6>
                    <input className="form-control" type="text" placeholder='Enter restaurant description' 
                    name='description' value={description} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Email</h6>
                    <input className="form-control" type="text" placeholder='Enter your email' 
                    name='email' value={restaurantEmail} onChange={handleCreateRestaurant}/>
                    </div>
                    <div>
                    <h6>Phone No.</h6>
                    <input className='form-control' type="number" placeholder='Enter your Contact Number'
                    name='phone' value={phone} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Address</h6>
                    <input className="form-control" type="text" placeholder='Enter Restaurant Address' 
                    name='address' value={restaurantAddress} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>City</h6>
                    <input className="form-control" type="text" placeholder='Enter City' 
                    name='city' value={city} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>State</h6>
                    <input className="form-control" type="text" placeholder='Enter State' 
                    name='state' value={restaurantState} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Pincode</h6>
                    <input className="form-control" type="Number" placeholder='Enter Pincode' 
                    name='pincode' value={restaurantPincode} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Location</h6>
                    <input className="form-control" type="text" placeholder='Enter nearby Location' 
                    name='location' value={location} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Opening Time</h6>
                    <input className="form-control" type="text" placeholder='Enter Opening Time' 
                    name='openingTime' value={openingTime} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Closing Time</h6>
                    <input className="form-control" type="text" placeholder='Enter Closing Time' 
                    name='closingTime' value={closingTime} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Delivery Fee</h6>
                    <input className="form-control" type="text" placeholder='Enter Delivery Fee' 
                    name='deliveryFee' value={deliveryFee} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Miinimum Order</h6>
                    <input className="form-control" type="text" placeholder='Enter Minimum Order' 
                    name='minimumOrder' value={minimumOrder} onChange={handleCreateRestaurant}/>
                    </div>
                    <div >
                    <h6>Delivery Time</h6>
                    <input className="form-control" type="text" placeholder='Enter Delivery Time' 
                    name='deliveryTime' value={deliveryTime} onChange={handleCreateRestaurant}/>
                    </div>
                    <div>
                    <h6>Restaurant Banner</h6>
                    <div className='mb-4'>
                        <div className='d-flex align-items-center gap-2'>
                        <div>
                            <img src={restaurantPreview} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"70px", width:"70px" }}/>
                        </div>
                        <div><input className="form-control" type="file" accept="image/*"  onChange={(e) => {const file = e.target.files[0];
                            if (file) {
                            setResImage(file);
                            setRestaurantPreview(URL.createObjectURL(file));
                            }
                        }}/>
                        </div>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <h6>Restaurant Logo </h6>
                        <div className='d-flex align-items-center gap-2'>
                        <div>
                            <img src={restaurantLogo} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"70px", width:"70px" }}/>
                        </div>
                        <div><input className="form-control" type="file" accept="image/*"  onChange={(e) => {const file = e.target.files[0];
                            if (file) {
                            setLogoImage(file);
                            setRestaurantLogo(URL.createObjectURL(file));
                            }
                        }}/>
                        </div>
                        </div>
                    </div>
                    <div className='d-flex gap-2'>
                        <button type='submit' className="btn w-50 rounded-pill" style={{backgroundColor:"#217fea", color:"white"}}>Create</button>
                        <button className='w-50 btn btn-danger rounded-pill' onClick={() => setPopUp(false)}>Cancel</button>
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