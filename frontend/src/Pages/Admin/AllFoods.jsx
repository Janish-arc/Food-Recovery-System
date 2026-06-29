import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteFood, GetAllFoods } from '../../Redux/FoodSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pagination } from '../../Components/Pagination'
import Swal from "sweetalert2";

export const AllFoods = () => {

  const {isAuthenticated} = useSelector((state) => state.user)
  const {food} = useSelector((state) => state.food)
  const [searchParams] = useSearchParams();
  const defaultStatus = searchParams.get("status") || "all";
  const [statusFilter, setStatusFilter] = useState(defaultStatus)
  const [search, setSearch] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const filteredFoods = food.filter((item) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "Expired") {
        return new Date(item.expiryDate) < new Date() && item.status !== "Delivered";
    }
    return item.status === statusFilter;
    })
    .filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.organization.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentFoods = filteredFoods.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  
  useEffect(() => {
    dispatch(GetAllFoods())
  }, [dispatch])

  const deleteFood = async (id) => {
    const result = await Swal.fire({
      title: "Delete Food?",
      text: "This action cannot be undone.",
      icon: "warning",
      width: "450px",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
        await dispatch(DeleteFood(id));
        dispatch(GetAllFoods())

        Swal.fire({
            title: "Deleted!",
            text: "Food has been deleted.",
            icon: "success"
        });
    }
  }

  return (
    <div>
        <Navbar/>
        <div className='container'>
            <h2 className='text-center mt-4 fw-bold'>Food Management</h2>
            <div className='d-flex gap-3 align-items-center'>
            <div className='input-group d-flex align-items-center gap-2 border rounded'>
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type='text' className='form-control border-0' style={{height:"38px"}} placeholder='Search Users' value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div> 
            <div className="d-flex justify-content-end my-3">
                <select
                    className="form-select w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Foods</option>
                    <option value="Available">Available</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>
            </div>
            {isAuthenticated && filteredFoods.length > 0 ? (
            <div className='table-responsive my-4 shadow rounded'>
                <table className='table'>
                    <thead className='black-header text-center'>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Donor</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Expiry</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFoods?.length > 0 && 
                        currentFoods?.map((item) => (
                        <tr key={item?._id} className='align-middle text-center'>
                            <td><img src={item.image?.url} style={{width:"70px", height:"70px", borderRadius:"50%", objectFit:"cover"}}/></td>
                            <td>{item.name}</td>
                            <td>{item.donorId?.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.category}</td>
                            <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                            <td>{item.status}</td>
                            <td className="text-center">
                            {item.role !== "admin" ? (
                                <div className="d-flex justify-content-center gap-2">
                                <button className="btn btn-danger btn-sm"onClick={() => deleteFood(item._id)}>Delete</button>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/fooddetails/${item._id}`)}>View Details</button>
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
                    <h2>No Foods Available right now</h2>
                </div>
            )}
        </div>
        {currentFoods.length > 0 && 
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
        }
        <Footer/>
    </div>
  )
}
