import React, { useEffect, useState } from "react";
import { Save, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleRestaurant, UpdateRestaurant } from "../../Redux/RestaurantSlice";
import toast from "react-hot-toast";

export const RestaurantProfile = () => {

    const dispatch = useDispatch();

    const {
        restaurant,
        loading,
        success,
        error
    } = useSelector((state) => state.restaurant);

    const [restaurantData, setRestaurantData] = useState({
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        location: "",
        openingTime: "",
        closingTime: "",
        deliveryFee: "",
        minimumOrder: "",
        deliveryTime: "",
        isOpen: true
    });

    const [logoPreview, setLogoPreview] = useState("");
    const [bannerPreview, setBannerPreview] = useState("");

    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        dispatch(GetSingleRestaurant());
    }, [dispatch]);

    useEffect(() => {

        if (restaurant) {

            setRestaurantData({
                name: restaurant.name || "",
                description: restaurant.description || "",
                email: restaurant.email || "",
                phone: restaurant.phone || "",
                address: restaurant.address || "",
                city: restaurant.city || "",
                state: restaurant.state || "",
                pincode: restaurant.pincode || "",
                location: restaurant.location || "",
                openingTime: restaurant.openingTime || "",
                closingTime: restaurant.closingTime || "",
                deliveryFee: restaurant.deliveryFee || "",
                minimumOrder: restaurant.minimumOrder || "",
                deliveryTime: restaurant.deliveryTime || "",
                isOpen: restaurant.isOpen
            });

            setLogoPreview(restaurant.logo?.url);
            setBannerPreview(restaurant.banner?.url);

        }

    }, [restaurant]);

    const handleChange = (e) => {

        setRestaurantData({
            ...restaurantData,
            [e.target.name]: e.target.value
        });

    };

    const submitHandler = (e) => {

        e.preventDefault();

        const formData = new FormData();

        Object.keys(restaurantData).forEach((key) => {
            formData.set(key, restaurantData[key]);
        });

        if (logo) formData.set("logo", logo);

        if (banner) formData.set("banner", banner);

        dispatch(UpdateRestaurant(formData));

    };

    useEffect(() => {

        if (success) {

            toast.success("Restaurant Updated");

        }

        if (error) {

            toast.error(error);

        }

    }, [success, error]);

    return (
        <div className="container py-4">

            <div className="card shadow border-0">

                <div className="card-header bg-dark text-white">

                    <h3 className="mb-0">
                        Restaurant Profile
                    </h3>

                </div>

                <div className="card-body">

                    <form onSubmit={submitHandler}>

                        {/* Banner */}

                        <div className="mb-4">

                            <h5>Restaurant Banner</h5>

                            <img
                                src={bannerPreview}
                                className="img-fluid rounded mb-2"
                                style={{
                                    width: "100%",
                                    height: "220px",
                                    objectFit: "cover"
                                }}
                            />

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e)=>{
                                    setBanner(e.target.files[0]);
                                    setBannerPreview(URL.createObjectURL(e.target.files[0]));
                                }}
                            />

                        </div>

                        {/* Logo */}

                        <div className="mb-4 text-center">

                            <img
                                src={logoPreview}
                                className="rounded-circle"
                                style={{
                                    width:100,
                                    height:100,
                                    objectFit:"cover"
                                }}
                            />

                            <input
                                className="form-control mt-2"
                                type="file"
                                accept="image/*"
                                onChange={(e)=>{
                                    setLogo(e.target.files[0]);
                                    setLogoPreview(URL.createObjectURL(e.target.files[0]));
                                }}
                            />

                        </div>

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label>Name</label>

                                <input
                                    className="form-control"
                                    name="name"
                                    value={restaurantData.name}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label>Email</label>

                                <input
                                    className="form-control"
                                    name="email"
                                    value={restaurantData.email}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label>Phone</label>

                                <input
                                    className="form-control"
                                    name="phone"
                                    value={restaurantData.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label>Location</label>

                                <input
                                    className="form-control"
                                    name="location"
                                    value={restaurantData.location}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-12">

                                <label>Description</label>

                                <textarea
                                    rows={4}
                                    className="form-control"
                                    name="description"
                                    value={restaurantData.description}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label>Opening Time</label>

                                <input
                                    className="form-control"
                                    type="time"
                                    name="openingTime"
                                    value={restaurantData.openingTime}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label>Closing Time</label>

                                <input
                                    className="form-control"
                                    type="time"
                                    name="closingTime"
                                    value={restaurantData.closingTime}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label>Delivery Fee</label>

                                <input
                                    className="form-control"
                                    name="deliveryFee"
                                    value={restaurantData.deliveryFee}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label>Minimum Order</label>

                                <input
                                    className="form-control"
                                    name="minimumOrder"
                                    value={restaurantData.minimumOrder}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-4">

                                <label>Delivery Time</label>

                                <input
                                    className="form-control"
                                    name="deliveryTime"
                                    value={restaurantData.deliveryTime}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-12">

                                <div className="form-check form-switch">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={restaurantData.isOpen}
                                        onChange={() =>
                                            setRestaurantData({
                                                ...restaurantData,
                                                isOpen: !restaurantData.isOpen
                                            })
                                        }
                                    />

                                    <label className="form-check-label">

                                        Restaurant Open

                                    </label>

                                </div>

                            </div>

                        </div>

                        <button
                            className="btn btn-dark mt-4"
                            disabled={loading}
                        >
                            <Save size={16}/>
                            {" "}
                            Save Changes
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};