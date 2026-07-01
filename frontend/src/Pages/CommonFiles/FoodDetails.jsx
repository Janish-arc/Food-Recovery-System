import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { AcceptsFood, GetSingleFood } from '../../Redux/FoodSlice'
import {
  FaBox,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInfoCircle
} from "react-icons/fa";
import toast from 'react-hot-toast';

export const FoodDetails = () => {

  const { singlefood, success } = useSelector((state) => state.food)
  const { users } = useSelector((state) => state.user)

  const { id } = useParams()
  const dispatch = useDispatch()

  const FoodAccept = (id) => {
    if(success){
        toast.success("Food Accepted")
    }
    dispatch(AcceptsFood(id))
  }

  useEffect(() => {
    dispatch(GetSingleFood(id))
  }, [dispatch, id])

  return (
    <div className="container py-5">
      <h4 className='text-center fw-bold'>Food Details</h4>
      <hr />
      <div className="card border-0 shadow-lg overflow-hidden">
        <div className="row g-0">

          <div className="col-12 col-md-6 col-lg-6 d-flex align-items-center justify-content-center bg-light p-4">
            <img
              src={singlefood?.image?.url}
              alt={singlefood?.name}
              className="img-fluid shadow rounded-4 food-details-img"
            />
          </div>

          <div className="col-12 col-md-6">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex flex-sm-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
                <h2 className="fw-bold mb-0 fs-3 fs-md-2">{singlefood?.name}</h2>
                <span className="badge bg-success fs-6 px-3 py-2 me-5">{singlefood?.status}</span>
              </div>
              <hr />
              
              <h4 className="mb-3 text-success"> 🍽 Food Information</h4>
              <div className="row m-0">
                <div className="col-12 col-sm-6 mb-3">
                  <p className="mb-2">
                    <FaBox className="me-2 text-primary" />
                    <strong>Category:</strong> {singlefood?.category}
                  </p>
                </div>

                <div className="col-12 col-sm-6 mb-3">
                  <p className="mb-2">
                    <FaBox className="me-2 text-warning" />
                    <strong>Quantity:</strong> {singlefood?.quantity}
                  </p>
                </div>

                <div className="col-12 col-sm-6 mb-3">
                  <p className="mb-2">
                    <FaCalendarAlt className="me-2 text-danger" />
                    <strong>Expiry:</strong>{" "}
                    {singlefood?.expiryDate &&
                      new Date(singlefood.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <hr />

              <h4 className="mb-3 text-primary fs-5">
                👤 Donor Information
              </h4>

              <p className="mb-2">
                <strong>Organization:</strong> {singlefood?.organization}
              </p>

              <p className="mb-2">
                📞 {singlefood?.donorId?.phoneNo}
              </p>

              <p className="mb-2 text-break">
                <FaEnvelope className="me-2 text-danger" />
                {singlefood?.donorId?.email}
              </p>
              <hr />

              <div className="alert alert-light border mb-3 text-break">
                <FaMapMarkerAlt className="me-2 text-danger" /> {singlefood?.pickUpAddress}
              </div>

              <h4 className="mb-3 text-info">
                ℹ Description
              </h4>
              <div className="bg-light p-3 rounded text-break">
                <FaInfoCircle className="me-2 text-info" />
                {singlefood?.description}
              </div>

              {users?.role === "ngo" && singlefood.status === "Available" && 
              <div className="mt-4">
                <button className="btn btn-success btn-lg" onClick={() => FoodAccept(singlefood._id)}>
                  Accept Food
                </button>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}