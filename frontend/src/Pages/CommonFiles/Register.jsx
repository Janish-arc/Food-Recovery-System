import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { removeError, removeSuccess, UserRegistration } from '../../Redux/UserSlice'

export const Register = () => {
const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
  const [showPassword, setShowPassword] = useState(false)
  const {error, success} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({
    name:"", email:"", password:"", phoneNo:"", state:"", address:"", country:"", pincode:""
  })
  const {name, email, password, phoneNo, address, state, country, pincode} = user
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    setUser({...user, [e.target.name]:e.target.value})
  }

  const registerNow = (e) => {
  e.preventDefault();

  if (!name || !email || !password || !address || !phoneNo || !image || !state || !country || !pincode) {
    toast.error("Please fill out all the fields required", {
      position: "top-center",
    });
    return;
  }

  const myform = new FormData();

  myform.set("name", name);
  myform.set("email", email);
  myform.set("password", password);
  myform.set("phoneNo", phoneNo);
  myform.set("image", image);
  myform.set("address", address);
  myform.set("state", state);
  myform.set("country", country);
  myform.set("pincode", pincode);

  dispatch(UserRegistration(myform));
};

  useEffect(() => {
    if(error) {
      toast.error(error, {position: 'top-center', autoClose: 3000})
      dispatch(removeError())
    }
  }, [dispatch, error])

  useEffect(() => {
    if(success){
      toast.success(navigate('/login'))
      dispatch(removeSuccess())
    }
  }, [dispatch, success, navigate])

  return (
    <div className='row vh-100 align-items-center justify-content-center register'>
      <div className='d-none d-md-block col-md-5'>
        
      </div>
      {/* <div className='col-12 col-md-5 px-5 py-4 rounded overflow-y-auto'>
        <h3 className='text-center mb-4'><b>Create Account</b></h3>
      <form onSubmit={registerNow}>
        <div className='d-flex flex-column gap-4'>
        <div className='row g-4'>
          <div className='col-md-6'>
            <h6>Name</h6>
            <input className="form-control" type="text" placeholder='Enter your Name' 
            name='name' value={name} onChange={handleChange}/>
          </div>
          <div className='col-md-6'>
            <h6>Phone No.</h6>
            <input className='form-control' type="tel" placeholder='Enter your Contact Number'
            name='phoneNo' value={phoneNo} onChange={handleChange}/>
          </div>
        </div>
        <div className='row g-4'>
          <div className='col-md-6'>
            <h6>Email</h6>
            <input className="form-control" type="text" placeholder='Enter your email' 
            name='email' value={email} onChange={handleChange}/>
          </div>
          <div className='position-relative col-md-6'>
            <h6>Password</h6>
            <div>
              <input className='form-control' type={showPassword ? "text" : "password"} placeholder='Enter your password'
            name='password' value={password} onChange={handleChange}/>
            <span
                onClick={() => setShowPassword(!showPassword)}
                  style={{
                  position: "absolute",
                  right: "15px",
                  top: "68%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                  }}
                >
                {showPassword ? <Eye size={19}/> : <EyeOff size={19}/>}
              </span>
            </div>
          </div>
        </div>
        
         <div >
          <h6>Address</h6>
          <textarea className="form-control" type="text" placeholder='Enter your Address' rows="2"
          name='address' value={address} onChange={handleChange}/>
        </div>
        <div className='row g-4'>
          <div className='col-md-6'>
            <h6>State</h6>
            <input className="form-control" type="text" placeholder='Enter your State' 
            name='state' value={state} onChange={handleChange}/>
          </div>
          <div className='col-md-6'>
            <h6>Country</h6>
            <input className="form-control" type="text" placeholder='Enter your Country' 
            name='country' value={country} onChange={handleChange}/>
          </div>
        </div>
          <div>
            <h6>Pincode</h6>
            <input className="form-control" type="text" placeholder='Enter your Pincode' 
            name='pincode' value={pincode} onChange={handleChange}/>
          </div>
          <div>
            <div className='mb-4'>
              <div className='d-flex align-items-center gap-2'>
                <div>
                  <img src={preview} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"60px", width:"60px", flexShrink: 0 }}/>
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

        <button type='submit' className="btn w-100 rounded-pill" style={{backgroundColor:"#217fea", color:"white"}}>Create Account</button>
      </div>
      </form>
      <div className='d-flex mt-3 justify-content-center gap-2'>
        <p>Already have an account?</p>
        <Link to={"/login"} style={{textDecoration:"none"}}>Login</Link>
      </div>
      </div> */}

      <div className="col-12 col-md-5 px-3 px-md-4 py-2 py-md-4 rounded register-form">
        <h3 className="text-center">
          <b>Create Account</b>
        </h3>

        <form onSubmit={registerNow}>
          {/* Name + Phone */}
          <div className="row gx-3 gy-3 mb-2">
            <div className="col-12 col-md-6">
              <h6>Name</h6>
              <input
                className="form-control"
                type="text"
                placeholder="Enter your Name"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <h6>Phone No.</h6>
              <input
                className="form-control"
                type="tel"
                placeholder="Enter your Contact Number"
                name="phoneNo"
                value={phoneNo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email + Password */}
          <div className="row gx-3 gy-3 mb-2">
            <div className="col-12 col-md-6">
              <h6>Email</h6>
              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6 position-relative">
              <h6>Password</h6>
              <input
                className="form-control pe-5"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={handleChange}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "67%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="mb-2">
            <h6>Address</h6>
            <textarea
              className="form-control"
              placeholder="Enter your Address"
              rows="2"
              name="address"
              value={address}
              onChange={handleChange}
            />
          </div>

          {/* State + Country */}
          <div className="row gx-3 gy-3 mb-2">
            <div className="col-12 col-md-6">
              <h6>State</h6>
              <input
                className="form-control"
                type="text"
                placeholder="Enter your State"
                name="state"
                value={state}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <h6>Country</h6>
              <input
                className="form-control"
                type="text"
                placeholder="Enter your Country"
                name="country"
                value={country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pincode */}
          <div className="mb-2">
            <h6>Pincode</h6>
            <input
              className="form-control"
              type="text"
              inputMode="numeric"
              placeholder="Enter your Pincode"
              name="pincode"
              value={pincode}
              onChange={handleChange}
            />
          </div>

          {/* Profile Picture */}
          <div className="mb-4 mt-3">
            <h6>Profile Picture</h6>
            <div className="d-flex align-items-center gap-3">
              <img
                src={preview}
                alt="Profile preview"
                className="rounded-circle shadow"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  flexShrink: 0
                }}
              />

              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn w-100 rounded-pill mt-4"
            style={{
              backgroundColor: "#217fea",
              color: "white"
            }}
          >
            Create Account
          </button>
        </form>

        {/* Login */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <p className="mb-0">Already have an account?</p>
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
