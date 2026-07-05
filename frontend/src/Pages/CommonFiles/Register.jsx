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
    <div className='vh-100 d-flex flex-column align-items-center justify-content-center'>
      <div className='shadow-lg px-5 py-4 rounded overflow-y-auto' style={{width:"500px", height:"600px", scrollbarWidth:"none"}}>
        <h4 className='text-center'><b>Create Account</b></h4>
      <form onSubmit={registerNow}>
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
        <div className='position-relative'>
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
          <h6>State</h6>
          <input className="form-control" type="text" placeholder='Enter your State' 
          name='state' value={state} onChange={handleChange}/>
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
          <button type='submit' className="btn w-100 rounded-pill" style={{backgroundColor:"#217fea", color:"white"}}>Sign In</button>
        </div>
      </div>
      </form>
      <div className='d-flex mt-3 justify-content-center gap-2'>
        <p>Already have an account?</p>
        <Link to={"/login"} style={{textDecoration:"none"}}>Login</Link>
      </div>
      </div>
    </div>
  )
}
