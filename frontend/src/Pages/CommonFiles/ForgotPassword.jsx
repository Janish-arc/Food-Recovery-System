import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ForgotPassword } from "../../Redux/UserSlice"; // Change according to your file
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import toast from "react-hot-toast";

export const ForgotPasswordPage = () => {

    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.user);
    const [email, setEmail] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(ForgotPassword({ email }));
    };

    useEffect(() => {
        if (success) {
            toast.success("");
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error]);

    return (
        <>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%" }}>
                    <h2 className="text-center mb-4"> Forgot Password </h2>
                    <p className="text-center text-muted mb-4"> Enter your registered email address to receive a password reset link. </p>
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>

                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {
                                loading ?
                                    "Sending..." :
                                    "Send Reset Link"
                            }
                        </button>

                    </form>

                    <div className="text-center mt-3" >
                        <Link to="/login" style={{textDecoration:"none"}}>
                            Back to Login
                        </Link>
                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
};