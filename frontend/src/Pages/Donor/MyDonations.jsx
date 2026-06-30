import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetDonorFoods, DeleteFood } from '../../Redux/FoodSlice'
import { Pagination } from '../../Components/Pagination'

export const MyDonations = () => {

    const { food } = useSelector((state) => state.food)
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const receivedFoods = food?.filter(item => item.status === "Delivered" && item?.donorId === user._id)
    const filteredFoods = food
        .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
        .filter((item) =>
            (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.organization || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.status || "").toLowerCase().includes(search.toLowerCase())
        );
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentFoods = filteredFoods.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

    useEffect(() => {
        dispatch(GetDonorFoods());
    }, [dispatch]);

    const deletefood = async (id) => {
        await dispatch(DeleteFood(id))
        dispatch(GetDonorFoods())
    }

    const statCardStyle = {
        minWidth: "110px",
        flex: "1",
    }

    return (
        <div>
            <Navbar />

            {/* Page Header */}
            <div className="d-flex flex-column align-items-center mt-4 mb-2">
                <h2 className="fw-bold mb-1">📦 My Donations</h2>
                <p className="text-muted mb-0">Manage all your donations here</p>
            </div>

            {/* Search & Filter */}
            <div className="container mt-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="input-group" style={{ maxWidth: "400px" }}>
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search food, organization, status..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        className="form-select"
                        style={{ width: "200px" }}
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="all">All Categories</option>
                        <option value="Veg">🥗 Veg</option>
                        <option value="NonVeg">🍗 NonVeg</option>
                        <option value="Snacks">🍪 Snacks</option>
                    </select>
                </div>
            </div>

            {food.length > 0 ? (
                <div className="container mt-4">

                    {/* Stats + Insights Row */}
                    <div className="d-flex gap-3 flex-wrap align-items-stretch mb-4">

                        {/* Stats Cards */}
                        <div className="d-flex gap-2 flex-wrap flex-grow-1 bg-white shadow rounded p-3">
                            {[
                                { label: "Total Donations", value: food.length },
                                { label: "Available", value: food.filter(i => i.status === "Available").length },
                                { label: "Picked Up", value: food.filter(i => i.status === "Picked Up").length },
                                { label: "Delivered", value: food.filter(i => i.status === "Delivered").length },
                                {
                                    label: "Meals Donated",
                                    value: food.filter(i => i.status === "Delivered" && i.donorId?._id === user._id)
                                        .reduce((total, f) => total + f.quantity, 0)
                                },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="card shadow-sm text-center px-3 py-2 d-flex flex-column justify-content-center align-items-center border-0"
                                    style={statCardStyle}
                                >
                                    <div className="text-muted small mb-1">{label}</div>
                                    <div className="fw-bold fs-5">{value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Insights Card */}
                        <div className="card shadow border-0 p-3" style={{ minWidth: "200px" }}>
                            <h6 className="fw-bold text-center mb-3">📈 Food Insights</h6>
                            {[
                                { emoji: "🥗", label: "Veg", cat: "Veg" },
                                { emoji: "🍗", label: "Non-Veg", cat: "NonVeg" },
                                { emoji: "🍪", label: "Snacks", cat: "Snacks" },
                            ].map(({ emoji, label, cat }) => (
                                <div key={cat} className="d-flex justify-content-between align-items-center mb-2">
                                    <span>{emoji} {label}</span>
                                    <span className="fw-semibold">
                                        {receivedFoods.filter(i => i.category === cat).length}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Food Cards Grid */}
                    {currentFoods.length > 0 ? (
                        <div className="row g-4 mb-5">
                            {currentFoods.map((donor) => (
                                <div className="col-6 col-md-4 col-lg-3" key={donor._id}>
                                    <div className="card shadow-sm border-0 h-100">
                                        <img
                                            src={donor?.image?.url}
                                            alt={donor?.name}
                                            className="rounded-top"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h6 className="card-title fw-bold mb-3 text-truncate">
                                                {donor?.name} ({donor?.category})
                                            </h6>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted small">Quantity</span>
                                                <span className="fw-semibold small">{donor?.quantity}</span>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted small">Status</span>
                                                <span className={`badge ${
                                                    donor?.status === "Available" ? "bg-success" :
                                                    donor?.status === "Delivered" ? "bg-danger" :
                                                    "bg-warning text-dark"
                                                }`}>
                                                    {donor?.status}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted small">Published</span>
                                                <span className="small">{new Date(donor?.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="text-muted small">Expiry</span>
                                                <span className="small">{new Date(donor?.expiryDate).toLocaleDateString()}</span>
                                            </div>

                                            <div className="d-flex gap-2 mt-auto">
                                                <button className="btn btn-primary btn-sm w-50">Edit</button>
                                                {donor.status === "Available" && (
                                                    <button
                                                        className="btn btn-danger btn-sm w-50"
                                                        onClick={() => deletefood(donor._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 shadow rounded">
                            <h5 className="text-muted">No donations match your search</h5>
                        </div>
                    )}
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center shadow my-5 py-5 container rounded">
                    <h5 className="mb-2">No Donations Yet</h5>
                    <p className="text-muted mb-4">Start helping your community by donating surplus food</p>
                    <button className="btn btn-primary" onClick={() => navigate("/donor", { state: { popUp: true } })}>
                        Donate Food
                    </button>
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            <Footer />
        </div>
    )
}
