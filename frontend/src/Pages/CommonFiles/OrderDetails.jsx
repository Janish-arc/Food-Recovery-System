import React, { useEffect } from "react";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetSingleOrder } from "../../Redux/OrderSlice";
import {BsCheckCircleFill, BsClockHistory, BsGeoAlt, BsTelephone, BsCalendarDate, BsCashStack, BsShop, BsTruck} from "react-icons/bs";

export const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleOrder, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(GetSingleOrder(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="home">
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border text-danger" role="status"></div>
            </div>
        </div>
        <Footer />
      </>
    );
  }

  const status = singleOrder?.orderStatus;

  return (
    <>
      <Navbar />
      <div className="home">
      <div className="container py-4" style={{ minHeight: "80vh" }}>
     
        {/* Header */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <div>
                <h2 className="fw-bold mb-1">Order Details</h2>
                <p className="text-secondary mb-0">Order ID :{" "}{singleOrder?._id}</p>
              </div>

              <div className="mt-3 mt-md-0">
                <span className={`badge fs-6 px-3 py-2 rounded-pill
                  ${status === "Delivered"
                      ? "bg-success"
                      : status === "Cancelled"
                      ? "bg-danger"
                      : status === "Out For Delivery"
                      ? "bg-primary"
                      : "bg-warning text-dark"
                  }`}>{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4">Order Progress</h4>
            <div className="row text-center">

              {/* Order Placed */}
              <div className="col">
                <BsCheckCircleFill size={30} className="text-success mb-2"/>
                <p className="fw-semibold mb-0">Placed</p>
              </div>

              {/* Accepted */}
              <div className="col">
                <BsClockHistory size={30} className={status !== "Cancelled" ? "text-success mb-2" : "text-secondary mb-2"}/>
                <p className="fw-semibold mb-0">Accepted</p>
              </div>

              {/* Preparing */}
              <div className="col">
                <BsShop size={30} className={status === "Preparing" || status === "Out For Delivery" || status === "Delivered" ? "text-success mb-2" : "text-secondary mb-2"}/>
                <p className="fw-semibold mb-0">Preparing</p>
              </div>

              {/* Delivery */}
              <div className="col">
                <BsTruck size={30} className={status === "Out For Delivery" || status === "Delivered" ? "text-success mb-2" : "text-secondary mb-2"}/>
                <p className="fw-semibold mb-0">Delivery</p>
              </div>

              {/* Delivered */}
              <div className="col">
                <BsCheckCircleFill size={30} className={status === "Delivered"? "text-success mb-2" : "text-secondary mb-2"}/>
                <p className="fw-semibold mb-0">Delivered</p>
              </div>
            </div>
          </div>
        </div>
                
        {/* Restaurant & Delivery Address */}
        <div className="row">
          {/* Restaurant */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-4">Restaurant</h4>
                <div className="d-flex align-items-center">
                  <img src={singleOrder?.restaurant?.banner?.url} alt={singleOrder?.restaurant?.restaurantName} className="rounded-4 me-3" style={{width: "90px", height: "90px", objectFit: "cover"}}/>
                  <div>
                    <h5 className="fw-bold mb-1"> {singleOrder?.restaurant?.name}</h5>
                    <p className="text-secondary mb-2">{singleOrder?.restaurant?.address}</p>
                    <div className="d-flex align-items-center">
                      <BsTelephone className="me-2 text-danger" />
                      <span>+91 {singleOrder?.restaurant?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-4">Delivery Address</h4>
                <div className="d-flex">
                  <BsGeoAlt size={28} className="text-danger me-3 mt-1"/>
                  <div>
                    <h6 className="fw-bold mb-2"> {singleOrder?.user?.name} </h6>
                    <p className="text-secondary mb-1"> {singleOrder?.deliveryAddress}</p>
                    <p className="text-secondary mb-1"> {singleOrder?.user?.state}</p>
                    <p className="text-secondary mb-1"> {singleOrder?.user?.pincode} </p>
                    <p className="mb-0">Phone : +91 {" "}{singleOrder?.user?.phoneNo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4">Ordered Items</h4>
            {singleOrder?.items?.map((item) => (
                <div key={item._id} className="d-flex align-items-center justify-content-between flex-wrap border-bottom py-3">
                  <div className="d-flex align-items-center">
                    <img src={item?.image?.url} alt={item?.name} className="rounded-4 me-3" style={{width: "90px", height: "90px", objectFit: "cover"}}/>
                    <div>
                      <h5 className="fw-bold mb-1">{item?.name}</h5>
                      <p className="text-secondary mb-1">Quantity : {" "}{item?.quantity}</p>
                      <p className="mb-0">₹ {item?.price}</p>
                    </div>
                  </div>

                  <div className="mt-3 mt-md-0">
                    <h5 className="fw-bold text-danger">₹ {item?.price * item?.quantity}</h5>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
                
        {/* Bill Summary */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4">Bill Summary</h4>
            <div className="d-flex justify-content-between mb-3">
              <span>Item Total</span>
              <span>₹ {singleOrder?.subtotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>GST and Other Charges</span>
              <span>₹ {singleOrder?.deliveryFee + singleOrder?.tax}</span>
            </div>
            {singleOrder?.discount > 0 && 
            <div className="d-flex justify-content-between mb-3">
              <span>Discount</span>
              <span>₹ {singleOrder?.discount}</span>
            </div>
            }
            <hr />

            <div className="d-flex justify-content-between">
              <h5 className="fw-bold"> Grand Total</h5>
              <h5 className="fw-bold text-danger"> ₹ {singleOrder?.totalAmount}</h5>
            </div>
          </div>
        </div>

        {/* Payment & Order Info */}
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-4"> Payment Details</h4>
                <div className="d-flex align-items-center mb-3">
                  <BsCashStack size={24} className="text-success me-3"/>
                  <div>
                    <h6 className="fw-bold mb-1">Payment Method</h6>
                    <p className="mb-0 text-secondary"> {singleOrder?.paymentMethod}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <BsCheckCircleFill size={24} className={`me-3 ${singleOrder?.paymentStatus === "Paid" ? "text-success" : "text-warning"}`}/>
                  <div>
                    <h6 className="fw-bold mb-1">Payment Status</h6>
                    <p className="mb-0 text-secondary">{singleOrder?.paymentStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h4 className="fw-bold mb-4">Order Information</h4>
                <div className="d-flex align-items-center mb-3">
                  <BsCalendarDate size={24} className="text-danger me-3"/>
                  <div>
                    <h6 className="fw-bold mb-1">Ordered On</h6>
                    <p className="mb-0 text-secondary">{new Date(singleOrder?.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <BsTruck size={24} className="text-primary me-3"/>
                  <div>
                    <h6 className="fw-bold mb-1">Current Status</h6>
                    <p className="mb-0 text-secondary">{singleOrder?.orderStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-3 justify-content-end">
              <button className="btn btn-outline-dark rounded-pill px-4">Contact Restaurant</button>
              <button className="btn btn-danger rounded-pill px-4">Reorder</button>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};