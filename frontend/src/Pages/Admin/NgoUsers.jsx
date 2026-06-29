import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteUser, GetAllUsers } from '../../Redux/UserSlice'
import { GetAllFoods } from '../../Redux/FoodSlice'
import { Pagination } from '../../Components/Pagination'

export const NgoUsers = () => {

    const {users, isAuthenticated} = useSelector((state) => state.user)
    const { food } = useSelector((state) => state.food)
    const dispatch = useDispatch()

    const filteredUsers = users?.filter((user) => user?.role === "ngo")
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
                    <h2 className='fw-bold'>Ngo Management</h2>  
                    <p className='text-muted'>Manage NGOs and monitor their activities.</p>
                </div>
                <div className='table-responsive my-4 shadow rounded'>
                    <table className='table'>
                        <thead className='black-header text-center'>
                            <tr>
                                <th>User Id</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone No</th>
                                <th>Total Accepted</th>
                                <th>Total Delivered</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                        {currentUsers?.length > 0 &&
                            currentUsers.map((item) => {
                            const acceptedFood = food.filter(
                                (foodItem) =>
                                foodItem.status !== "Available" && foodItem.status !== "Delivered" &&
                                foodItem.ngoId?._id === item._id
                            );

                            const deliveredFood = food.filter(
                                (foodItem) =>
                                foodItem.status === "Delivered" &&
                                foodItem.ngoId?._id === item._id
                            );

                            return (
                                <tr key={item._id} className="align-middle text-center">
                                <td>#{item._id.slice(-5)}</td>

                                <td>
                                    <img
                                    src={item.image?.url}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                    alt={item.name}
                                    />
                                </td>

                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phoneNo}</td>

                                <td>{acceptedFood.length}</td>
                                <td>{deliveredFood.length}</td>

                                <td>
                                    <button
                                    className="btn btn-danger"
                                    onClick={() => deleteUser(item._id)}
                                    >
                                    Delete User
                                    </button>
                                </td>
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
