import React, {useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { removeError, removeSuccess, UserLogin } from '../../Redux/UserSlice'
import toast from 'react-hot-toast'

export const Login = () => {

  const {error, success, user} = useSelector((state) => state.user)
  const [data, setData] = useState()
  const [users, setUser] = useState({email: "", password: ""})
  const {email, password} = users
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setUser({...users, [e.target.name] : e.target.value})
  }

  const loginNow = (e) => {
    e.preventDefault()

    if(!email || !password) {
      toast.error("Email or Password cannot be empty", {
        position: "top-center", autoClose: 3000
      });
      return
    }

    const myform = new FormData();
    myform.set("email", email);
    myform.set("password", password);
    dispatch(UserLogin(myform));
  }

  useEffect(() => {
    if(error){
      toast.error("Invalid Email or Password")
      dispatch(removeError())
    }
  },[dispatch, error])

  useEffect(() => {
    if(success){
      toast.success(navigate('/'))
      dispatch(removeSuccess())
    }
  },[dispatch, success, navigate])

  return (
    <div className='vh-100 d-flex flex-column align-items-center justify-content-center'>
      <div className='col-10 col-md-6 col-lg-4 shadow-lg px-4 py-4 rounded'>
        <h4 className='text-center'><b>LOGIN</b></h4>
      <form onSubmit={loginNow} className='d-flex flex-column gap-4'>
        <div >
          <h6>Email</h6>
          <input className="form-control" type="text" placeholder='Enter your email' name='email' value={email} onChange={handleChange}/>
        </div>
        <div>
          <h6>Password</h6>
          <input className='form-control' type="text" placeholder='Enter your password' name='password' value={password} onChange={handleChange}/>
        </div>
        <div>
          <button className="btn w-100 rounded-pill" style={{backgroundColor:"#217fea", color:"white"}}>LOGIN</button>
        </div>

        <div className='d-flex gap-4 justify-content-around'>
          <small><p>Don't have an account? <Link to={'/register'} style={{textDecoration:"none"}}>Register</Link></p></small>
          <small><Link className="ms-auto" style={{textDecoration:"none"}} to={'/forgotpassword'}>Forgot Password</Link></small>
        </div>
      </form>
      </div>
    </div>
  )
}
