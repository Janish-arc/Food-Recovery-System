import React, { useEffect } from "react";
import {ArrowLeft, Trash2, Minus, Plus, ShoppingBag,} from "lucide-react";
import EmptyCart from "../../assets/cart.webp";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { DeleteCart, GetCart, UpdateCart } from "../../Redux/CartSlice";
import { useNavigate } from "react-router-dom";

export const Cart = () => {

    const {cart} = useSelector((state) => state.cart)
    const {user} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const subtotal = cart?.subtotal || 0;

    useEffect(() => {
        dispatch(GetCart())
    }, [dispatch])

    const UpdatecartAdd = (id, quantity) => {
        dispatch(UpdateCart({
            id,
            datas:{
                quantity: quantity + 1
            } 
        }))
    }

    const UpdatecartSub = (id, quantity) => {
        dispatch(UpdateCart({
            id,
            datas:{
                quantity: quantity - 1
            } 
        }))
    }

    const Deletecart = async (id) => {
        await dispatch(DeleteCart(id))
        dispatch(GetCart())
    }

    console.log(cart?.items?.length)

  return (
    <div>
        <Navbar/>
        <div className="home">
        <div className="container py-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
                <button className="btn rounded-circle border border-white" style={{fontSize:"25px"}}><i className="bi bi-arrow-left-circle" onClick={() => navigate(`/`)}></i></button>
                <div>
                    <h5 className="fw-bold mb-0"> My Cart </h5>
                    <small className="text-secondary">{cart?.items?.length || 0} Items</small>
                </div>
            </div>
            <ShoppingBag size={25} />
        </div>        

        {/* Calculations  */}
        {cart?.items?.length > 0 && 
        <div className="card shadow border-0 rounded-4 mb-5">
            <div className="card-body">
                <h5 className="fw-bold mb-4">Bill Details</h5>
                <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span className="fw-medium">₹ {cart?.subtotal}</span>
                </div>
                {cart.discount > 0 && 
                <div className="d-flex justify-content-between mb-2">
                    <span>Discount</span>
                    <span className="fw-medium">₹ {cart?.discount}</span>
                </div>
                }
                <div className="d-flex justify-content-between mb-2">
                    <span>GST & Other Charges</span>
                    <span className="fw-medium">₹ {cart?.deliveryFee + cart?.tax}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">Grand Total</h5>
                    <h5 className="fw-bold text-success">₹ {cart?.total}</h5>
                </div>
            </div>
        </div>
        }

        {/* Delivery Address */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="fw-bold mb-1">📍 Deliver To</h6>
                        <small className="text-secondary mb-0">{user?.address}</small>
                    </div>
                    <button className="btn btn-outline-warning btn-sm rounded-pill">Change</button>
                </div>
            </div>
        </div>

        {/* Coupon */}
        <div className="card shadow-sm border-0 rounded-4 mb-5">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="fw-bold mb-1">🎁 Apply Coupon</h6>
                        <small className="text-secondary">Save more on your order</small>
                    </div>
                    <button className="btn btn-warning btn-sm rounded-pill">Apply</button>
                </div>
            </div>
        </div>

        {cart?.items?.length === 0 ? (
        <div className="text-center py-5">
            <img src={EmptyCart} style={{width: window.innerWidth >= 768 ? "600px" : "300px", borderRadius:"10px",}}/>
            <h2 className="fw-bold mt-4">Your Cart is Empty</h2>
            <p className="text-secondary">Looks like you haven't added anything yet.</p>
            <button className="btn btn-warning rounded-pill px-4" onClick={() => navigate("/")}>Browse Restaurants</button>
        </div>
        ) : (
        <>
        {cart?.items?.map((item) => (
            <div key={item._id} className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        {/* Image */}
                        <div className="col-4 col-md-3">
                            <img src={item?.menuItem?.image?.url} className="img-fluid rounded-4" style={{height: "clamp(100px,15vw,150px)", width: "100%", objectFit: "cover",}}/>
                        </div>

                        {/* Details */}
                        <div className="col-8 col-md-9">
                        <div className="d-flex justify-content-between">
                            <div>
                                <h6 className="fw-bold">{item?.menuItem?.name}</h6>
                                <small className="text-secondary">{item?.menuItem?.description}</small>
                                <h6 className="mt-2">⭐ {item?.menuItem?.rating}</h6>
                                <h6 className="text-success">₹ {item?.menuItem?.price}</h6>
                            </div>

                        {/* Delete */}
                        <button className="btn" onClick={() => Deletecart(item._id)}><Trash2 size={18} color="red"/></button>
                        </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="d-flex align-items-center border rounded-pill overflow-hidden">
                                    <button className="btn"><Minus size={16} onClick={() => UpdatecartSub(item._id, item?.quantity)}/></button>
                                    <span className="px-3 fw-bold">{item?.quantity}</span>
                                    <button className="btn"><Plus size={16} onClick={() => UpdatecartAdd(item._id, item?.quantity)}/></button>
                                </div>
                                <div>
                                    <h5 className="fw-bold text-warning">₹ {item?.menuItem?.price * item?.quantity}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        </>
        )
        }

        <div className="position-fixed bottom-0 start-50 translate-middle-x bg-warning shadow-lg rounded-pill px-4 py-3 mb-3" style={{width:"min(600px,95%)",zIndex:999,}}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="fw-bold mb-0">{cart?.items?.length} Items</h6>
                    ₹ {cart?.total}
                </div>
            <button className="btn btn-dark btn-sm rounded-pill px-4" onClick={() => navigate("/checkout")}>Proceed →</button>
            </div>
        </div>
        </div>
        </div>
        <Footer/>
    </div>
)
}