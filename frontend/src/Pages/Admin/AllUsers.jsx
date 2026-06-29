import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteUser, GetAllUsers } from '../../Redux/UserSlice'
import { Navbar } from '../../Components/Navbar'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '../../Components/Pagination'
import { Footer } from '../../Components/Footer'

export const AllUsers = () => {
    const {users, success, isAuthenticated} = useSelector((state) => state.user)
    const [roleFilter, setRoleFilter] = useState("all")
    const [search, setSearch] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const filteredUsers = users
    ?.filter((user) =>
        roleFilter === "all" || user.role === roleFilter
    )
    ?.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const lastIndex = (itemsPerPage * currentPage)
    const firstIndex = (lastIndex - itemsPerPage)
    const currentUsers = filteredUsers.slice(firstIndex, lastIndex) 
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    useEffect(() => {
        dispatch(GetAllUsers())
    }, [dispatch])

    const deleteUser = async(id) => {
        if(success){
            await dispatch(DeleteUser(id))
            dispatch(GetAllUsers())
            toast.success("User deleted successfully")
        }
    }

    

  return (
    <div>
        <Navbar/>
        <div className='container'>
            
                <h2 className='text-center mt-4 fw-bold'>User Management</h2>
                <div className='d-flex gap-3 align-items-center'>
                <div className='input-group d-flex align-items-center gap-2 border rounded'>
                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                    <input type='text' className='form-control border-0' style={{height:"38px"}} placeholder='Search Users' value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>    
                <div className="d-flex justify-content-end my-3">
                    <select
                        className="form-select w-auto"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Users</option>
                        <option value="donor">Donors</option>
                        <option value="ngo">NGOs</option>
                        <option value="volunteer">Volunteers</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
                </div>
                {isAuthenticated && currentUsers.length > 0 ? (
                <div className='table-responsive my-4 shadow rounded'>
                    <table className='table'>
                        <thead className='black-header text-center'>
                            <tr>
                                <th>User Id</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone No</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers?.length > 0 && 
                            currentUsers?.map((item) => (
                            <tr key={item?._id} className='align-middle text-center'>
                                <td>#{(item._id).slice(-5)}</td>
                                <td><img src={item.image?.url} style={{width:"70px", height:"70px", borderRadius:"50%", objectFit:"cover"}}/></td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phoneNo}</td>
                                <td>{item.role === "donor" ? "Donor" : item.role ===  "ngo" ? "Ngo" : item.role ===  "volunteer" ? "Volunteer" : item.role ===  "admin" ? "Admin" : item.role}</td>
                                <td>{item.createdAt ? (new Date(item.createdAt).toLocaleDateString()) : <div>-</div>}</td>
                                <td>
                                {item.role !== "admin" ? (
                                    <div className="d-flex justify-content-center gap-2">
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(item._id)}>Delete User</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/profile/${item._id}`)}>View Profile</button>
                                    </div>
                                ) : (
                                    <span className="text-muted">-</span>
                                )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='my-5 text-center shadow py-4 rounded'>
                    <h2>No Users Available right now</h2>
                </div>
            )}
        </div>
        {currentUsers.length > 0 && 
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
        }
        <Footer/>
    </div>
  )
}
