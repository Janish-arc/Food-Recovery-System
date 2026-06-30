import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CancelFood, DeliveredFood, GetSingleNgoFood, PickupFood } from '../../Redux/FoodSlice'
import toast from 'react-hot-toast'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { Pagination } from '../../Components/Pagination'

export const NgoAcceptedFoods = () => {

    const {acceptedFood, success} = useSelector((state) => state.food)
    const dispatch = useDispatch()
    const filteredFoods = acceptedFood.filter((food) => food.status !== "Delivered");
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const currentFoods = filteredFoods.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

    const FoodCancel = async(id) => {
      if(success){
        toast.success("Food cancelled successfully")
      }
      await dispatch(CancelFood(id))
      dispatch(GetSingleNgoFood())
    }

    const foodStatus = (status) => {
      switch (status){
        case "Accepted": return 25
        case "Assigned": return 50
        case "Out for Delivery": return 75
        case "Delivered": return 100
      }
    }

     const getUrgencyColor = (expiryDate) => {
          const diffInHours = (new Date(expiryDate) - new Date())/(1000*60*60)
          if(diffInHours <=2 ) return "text-danger"
          if(diffInHours <=24) return "text-warning"
          else return "table-dark"
      }


    useEffect(() => {
        dispatch(GetSingleNgoFood())
    }, [dispatch])

  return (

    <div>
      <Navbar/>
      <div className="container">
      <div className="table-responsive my-5">
        <h3 className="text-center mb-4">
          <b>🍱 ACCEPTED FOODS</b>
        </h3>

        {currentFoods.length > 0 ? (
          <>
            <table className="table table-hover align-middle shadow-sm">
              <thead className="black-header text-center">
                <tr>
                  <th>Image</th>
                  <th>Food</th>
                  <th>Organization</th>
                  <th>Volunteer</th>
                  <th>Location</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Contact</th>
                  {acceptedFood.some((food) => food.status === "Accepted") && (
                    <th>Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {currentFoods.map((donor) => (
                  <tr key={donor._id} className="align-middle text-center">
                    <td style={{ width: "100px" }}>
                      <img
                        src={donor.image?.url}
                        alt={donor.name}
                        className="shadow-sm border"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <div className="fw-bold">{donor.name}</div>
                        <small className="text-muted">
                          ({donor.category})
                        </small>
                      </div>

                      <div
                        className="progress mt-2"
                        style={{ height: "4px" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${foodStatus(donor.status)}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td>{donor.organization}</td>

                    <td>
                      <div className="fw-semibold">
                        {donor.volunteerId?.name || (
                          <span className="text-muted">
                            Not Assigned
                          </span>
                        )}
                      </div>
                      <small className="text-muted">
                        {donor.volunteerId?.phoneNo}
                      </small>
                    </td>

                    <td style={{ maxWidth: "220px" }}>
                      {donor.pickUpAddress}
                    </td>

                    <td>{donor.quantity}</td>

                    <td
                      className={
                        donor.status === "Delivered"
                          ? "text-success fw-bold"
                          : donor.status === "Assigned"
                          ? "text-primary fw-bold"
                          : "text-warning fw-bold"
                      }
                    >
                      {donor.status}
                    </td>

                    <td className={getUrgencyColor(donor.expiryDate)}>
                      {new Date(donor.expiryDate).toLocaleDateString()}
                    </td>

                    <td>{donor.donorId?.phoneNo}</td>

                    {donor.status === "Accepted" && (
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => FoodCancel(donor._id)}
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <div className="my-5 mx-4 text-center py-5 rounded shadow">
            <h4>No Accepted Foods Found</h4>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </div>
    
  )
}
