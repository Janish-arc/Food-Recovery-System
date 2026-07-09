import React, { useEffect, useMemo, useState } from "react";
import {PlusCircle,Search,Salad,Package,CircleCheckBig,SquarePen,Trash2,Eye,EyeOff,ChevronLeft,ChevronRight} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DeleteFood, GetMenuOfRestaurant, ToggleFoodAvailability} from "../../Redux/FoodSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { Pagination } from "../../Components/Pagination";
import { GetCategory } from "../../Redux/CategorySlice";

export const RestaurantMenu = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {resFood, loading} = useSelector((state) => state.food);
    const {category} = useSelector((state) => state.category)
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState("All");
    const filteredFoods = useMemo(() => {
        let data = resFood || [];
        if (categories !== "All") {
            data = data.filter(
                (food) => food.category?._id === categories
            );
        }
        if (search) {
            data = data.filter((food) =>
                food.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        return data;
    }, [resFood, categories, search]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentFoods = (filteredFoods || []).slice(firstIndex, lastIndex);
    const totalPages = Math.ceil((filteredFoods?.length || 0) / itemsPerPage);
    const availableFoods = resFood.filter((food) => food.isAvailable);
    const outOfStock = resFood.filter((food) => !food.isAvailable);

    const deleteFoodHandler = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this food?"
        );
        if (confirmDelete) {
            dispatch(DeleteFood(id))
            dispatch(GetMenuOfRestaurant())
            console.log("Delete", id);
        }
    };

    useEffect(() => {
        dispatch(GetMenuOfRestaurant());
        dispatch(GetCategory())
    }, [dispatch]);

const toggleAvailability = async (id) => {
    await dispatch(ToggleFoodAvailability(id))
    dispatch(GetMenuOfRestaurant( ))
};

if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                    Loading...
                </span>
            </div>
        </div>
    );
}

    return (
        <div className="home">
            <Navbar/>
        <div className="container py-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">🍔 Manage Menu</h2>
                    <small className="text-muted">Manage all your restaurant food items.</small>
                </div>
                <button className="btn btn-primary rounded-pill px-4">
                    <PlusCircle size={18} className="me-2"/> Add Food
                </button>
            </div>

            {/* Statistics */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <Package size={28} color="#0d6efd"/>
                            <h3 className="mt-2">{resFood?.length}</h3>
                            <p className="text-muted mb-0">Total Foods</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <CircleCheckBig size={28} color="green"/>
                            <h3 className="mt-2">{availableFoods.length}</h3>
                            <p className="text-muted mb-0">Available</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <Salad size={28} color="red"/>
                            <h3 className="mt-2">{outOfStock.length}</h3>
                            <p className="text-muted mb-0">Out Of Stock</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="row mb-4">
                <div className="col-lg-8 mb-3 mb-lg-0">
                    <div className="input-group">
                        <span className="input-group-text"><Search size={18}/></span>
                        <input className="form-control" placeholder="Search food..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
                    </div>
                </div>
                <div className="col-lg-4">
                    <select className="form-select" value={categories} onChange={(e)=> setCategories(e.target.value)}>
                        <option value="All">All</option>
                        {category.map((cat)=>(
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Food Table */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr className="text-center">
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {!loading &&
                            resFood.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" width={90} alt=""/>
                                        <h5 className="mt-3">No Food Items</h5>
                                        <p className="text-muted">Start by adding your first food.</p>
                                        <button className="btn btn-primary rounded-pill"> Add Food </button>
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                            currentFoods.map((food) => (
                                <tr key={food._id}>
                                    {/* Image */}
                                    <td>
                                        <img src={food.image?.url} alt={food.name} style={{width:65,height:65,objectFit:"cover",borderRadius:10}}                                        />
                                    </td>

                                    {/* Name */}
                                    <td style={{ maxWidth: "220px"}}>
                                        <div className="fw-semibold text-truncate">{food.name}</div>
                                        <small className="text-muted text-break"> {food.description}...</small>
                                    </td>

                                    {/* Category */}
                                    <td>
                                        <span className="badge bg-primary">{food.category?.name}</span>
                                    </td>

                                    {/* Price */}
                                    <td>
                                        <strong>₹{food.price}</strong>
                                    </td>

                                    {/* Status */}
                                    <td>
                                        {food.isAvailable ?
                                            <span className="badge bg-success">Available</span>
                                            :
                                            <span className="badge bg-danger">Out Of Stock</span>
                                        }
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-warning btn-sm" title="Edit Food" onClick={() =>navigate(`/restaurant/edit-food/${food._id}`)}>
                                                <SquarePen size={16}/>
                                            </button>
                                            <button className="btn btn-danger btn-sm" title="Delete Food" onClick={() => deleteFoodHandler(food._id)}>
                                                <Trash2 size={16}/>
                                            </button>

                                            <button className={`btn btn-sm ${food.isAvailable ? "btn-secondary" : "btn-success"}`}
                                                title={food.isAvailable ? "Hide Food" : "Show Food"}
                                                onClick={() => toggleAvailability(food._id)}>
                                                {food.isAvailable ? <EyeOff size={16}/> : <Eye size={16}/>}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
            </div>
        <Footer/>
        </div>
    )
    }
            