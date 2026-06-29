import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteUser, GetAllUsers } from '../../Redux/UserSlice'
import { GetAllFoods } from '../../Redux/FoodSlice'
import { Pagination } from '../../Components/Pagination'

export const DonorUsers = () => {

    const {users, isAuthenticated} = useSelector((state) => state.user)
    const {food} = useSelector((state) => state.food)
    const dispatch = useDispatch()

    const filteredUsers = users?.filter((user) => user?.role === "donor")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const lastIndex = (itemsPerPage * currentPage)
    const firstIndex = (lastIndex - itemsPerPage)
    const currentUsers = filteredUsers.slice(firstIndex, lastIndex) 
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    useEffect(() => {
        dispatch(GetAllUsers())
        dispatch(GetAllFoods())
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
            {isAuthenticated && currentUsers.length > 0 ? (
            <>
                <div className='mt-5 text-center'>
                    <h2 className='fw-bold'>Donor Management</h2>    
                    <p className='text-muted'>View, search, and manage all registered donors.</p>
                </div>
                <div className='table-responsive mt-4 mb-5 shadow rounded'>
                    <table className='table'>
                        <thead className='black-header text-center'>
                            <tr>
                                <th>User Id</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Organization</th>
                                <th>Phone No</th>
                                <th>Donations</th>
                                <th>Available Foods</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers?.length > 0 &&
                            currentUsers.map((item) => {
                            const donorFoods = food.filter( (foodItem) => foodItem.donorId?._id === item._id ); 
                            const availableFoods = donorFoods.filter( (foodItem) => foodItem.status === "Available" ); 
                            const organization = donorFoods.length > 0 ? donorFoods[0].organization : "N/A";
                            

                            return (
                                <tr key={item._id} className="align-middle text-center">
                                <td>#{item._id.slice(-5)}</td>
                                <td><img src={item.image?.url} alt={item.name} style={{width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover"}}/></td>
                                <td>{item.name}</td>
                                <td>{organization}</td>
                                <td>{item.phoneNo}</td>
                                <td>{donorFoods.length}</td>
                                <td>{availableFoods.length}</td>
                                <td><button className="btn btn-danger" onClick={() => deleteUser(item._id)}>Delete User</button></td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
            ) : (
                <div className='my-5 text-center shadow py-4 rounded'>
                    <h2>No Ngos Available right now</h2>
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
