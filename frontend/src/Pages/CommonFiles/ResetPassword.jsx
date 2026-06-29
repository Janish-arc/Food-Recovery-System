import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ResetPassword } from "../../Redux/UserSlice"; // Change according to your file
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import toast from "react-hot-toast";

export const ResetPasswordPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { token } = useParams();
    const { loading, success, error } = useSelector((state) => state.user);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            ResetPassword({
                token,
                password,
                confirmPassword
            })
        );
    };

    useEffect(() => {
        if (success) {
            toast.success("");
            navigate("/login");
        }

        if (error) {
            toast.error(error);
        }
    }, [success, error]);

    return (
        <>
            <Navbar />
            <div
                className="container d-flex justify-content-center align-items-center"
                style={{ minHeight: "80vh" }}
            >

                <div
                    className="card shadow p-4"
                    style={{ maxWidth: "450px", width: "100%" }}
                >

                    <h2 className="text-center mb-4">
                        Reset Password
                    </h2>

                    <form onSubmit={submitHandler}>

                        <div className="mb-3">

                            <label className="form-label">
                                New Password
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                        </div>

                        <button
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {
                                loading ?
                                    "Updating..." :
                                    "Update Password"
                            }
                        </button>

                    </form>

                </div>

            </div>

            <Footer />
        </>
    );
};