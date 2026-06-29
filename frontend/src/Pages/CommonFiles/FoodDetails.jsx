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
      <div className="card border-0 shadow-lg overflow-hidden">
        <div className="row g-0">

          <div className="col-md-5 d-flex align-items-center justify-content-center bg-light">
            <img
                src={singlefood?.image?.url}
                alt={singlefood?.name}
                className="img-fluid shadow"
                style={{
                width: "500px",
                height: "450px",
                objectFit: "cover",
                borderRadius: "20px",
                margin: "20px"
                }}
            />
            </div>

          <div className="col-md-7">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">{singlefood?.name}</h2>
                <span className="badge bg-success fs-6 px-3 py-2">{singlefood?.status}</span>
              </div>
              <hr />
              
              <h4 className="mb-3 text-success"> 🍽 Food Information</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p>
                    <FaBox className="me-2 text-primary" />
                    <strong>Category:</strong> {singlefood?.category}
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <p>
                    <FaBox className="me-2 text-warning" />
                    <strong>Quantity:</strong> {singlefood?.quantity}
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <p>
                    <FaCalendarAlt className="me-2 text-danger" />
                    <strong>Expiry:</strong>{" "}
                    {singlefood?.expiryDate &&
                      new Date(singlefood.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <hr />

              <h4 className="mb-3 text-primary">
                👤 Donor Information
              </h4>
              <p>
                <strong>Organization:</strong>{" "}
                {singlefood?.organization}
              </p>
              <p>
                📞
                {singlefood?.donorId?.phoneNo}
              </p>
              <p>
                <FaEnvelope className="me-2 text-danger" />
                {singlefood?.donorId?.email}
              </p>
              <hr />

              <h4 className="mb-3 text-warning">
                📍 Pickup Address
              </h4>
              <div className="alert alert-light border">
                <FaMapMarkerAlt className="me-2 text-danger" />
                {singlefood?.pickUpAddress}
              </div>
              <hr />

              <h4 className="mb-3 text-info">
                ℹ Description
              </h4>
              <div className="bg-light p-3 rounded">
                <FaInfoCircle className="me-2 text-info" />
                {singlefood?.description}
              </div>

              {users?.role === "admin" && singlefood.status === "Available" && 
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