import React, { useEffect, useMemo, useState } from "react";
import {PlusCircle,Search,Salad,Package,CircleCheckBig,SquarePen,Trash2,Eye,EyeOff,ChevronLeft,ChevronRight} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateFood, DeleteFood, GetMenuOfRestaurant, UpdateFood} from "../../Redux/FoodSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { Pagination } from "../../Components/Pagination";
import { GetCategory } from "../../Redux/CategorySlice";
import toast from "react-hot-toast";

export const RestaurantMenu = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {resFood, loading, success, food: allFood} = useSelector((state) => state.food);
    const {category: allCategory} = useSelector((state) => state.category)
    const [pop, setPop] = useState(false)
    const [editPop, setEditPop] = useState(false)
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
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
    const [preview, setPreview] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600")
    const [foodData, setFoodData] = useState({
        name:"", category:"", description:"", price:"", preparedTime:""
    })
    const {name, category, description, price, preparedTime} = foodData
    const [image, setImage] = useState(preview)

    const handleCreateFood = async (e) => {
        e.preventDefault();
        const myform = new FormData();
        myform.set("name", name);
        myform.set("description", description);
        myform.set("category", category);
        myform.set("price", price);
        myform.set("preparedTime", preparedTime);
        if (image) {
            myform.set("image", image);
        }
        const result = await dispatch(CreateFood(myform));
        if (result.meta.requestStatus === "fulfilled") {
            setPop(false);
            toast.success("Food created successfully");
        }
    };

    const createFood = (e) => {
        setFoodData({
            ...foodData,
            [e.target.name]: e.target.value,
        });
    };

    const editFoodHandler = (food) => {
        setSelectedFood(food);
        setFoodData({
            name: food.name,
            category: food.category?._id,
            description: food.description,
            price: food.price,
            preparedTime: food.preparedTime
        });
        setPreview(food.image?.url);
        setImage(null);
        setEditPop(true);
    }

    const handleUpdateteFood = async (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("name", name);
    myform.set("category", category);
    myform.set("description", description);
    myform.set("price", price);
    myform.set("preparedTime", preparedTime);
    if(image){
        myform.set("image", image);
    }
      await dispatch(UpdateFood({ id: selectedFood._id, foodData: myform }));
      dispatch(GetMenuOfRestaurant());
      setEditPop(false)
      if(success){
        toast.success("Food Updated successfully")
      }
    };

    const updateFood = (e) => {
        setFoodData({...foodData, [e.target.name]:e.target.value})
    }

    const deleteFoodHandler = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this food?"
        );
        if (confirmDelete) {
            await dispatch(DeleteFood(id))
            dispatch(GetMenuOfRestaurant())
        }
    };

    useEffect(() => {
        dispatch(GetMenuOfRestaurant());
        dispatch(GetCategory())
    }, [dispatch]);

if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
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
                    <button className="btn btn-primary rounded-pill px-4" onClick={() => setPop(true)}>
                        <PlusCircle size={18} className="me-2"/> Add Food
                    </button>
                </div>

                {/* Statistics */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <Package size={28} color="#0d6efd"/>
                                <h3 className="mt-2">{resFood?.length}</h3>
                                <p className="text-muted mb-0">Total Foods</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <CircleCheckBig size={28} color="green"/>
                                <h3 className="mt-2">{availableFoods.length}</h3>
                                <p className="text-muted mb-0">Available</p>
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
                            {allCategory.map((cat)=>(
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
                                            <button className="btn btn-primary rounded-pill" onClick={() => setPop(true)}> Add Food </button>
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
                                                <button className="btn btn-warning btn-sm" title="Edit Food" onClick={() => editFoodHandler(food)}>
                                                    <SquarePen size={16}/>
                                                </button>
                                                <button className="btn btn-danger btn-sm" title="Delete Food" onClick={() => deleteFoodHandler(food._id)}>
                                                    <Trash2 size={16}/>
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

            {pop && (
                <div className='position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center px-3' style={{zIndex:1000, backgroundColor:"rgba(0,0,0,0.5)"}}>
                <div className="bg-white rounded shadow-lg p-4 overflow-y-auto w-100" style={{maxWidth:"550px", maxHeight:"80vh", scrollbarWidth:"none"}}>
                    <h2 className='text-center'>Add Food</h2>
                    <form onSubmit={handleCreateFood}>
                    <div className='d-flex flex-column gap-4'>
                        <div>
                            <h6>Food Name</h6>
                            <input className="form-control" type="text" placeholder="Enter Food Name"
                            name='name' value={name} onChange={createFood}/>
                        </div>
                        <div>
                            <h6>Category</h6>
                            <select name="category" className="form-select" value={category} onChange={createFood}>
                                <option>Select Category</option>
                                {allCategory.map((item) => (
                                    <option key={item._id} value={item._id} >{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h6>Food Description</h6>
                            <input className="form-control" type="text" placeholder="Enter Food description"
                            name='description' value={description} onChange={createFood}/>
                        </div>
                        <div>
                            <h6>Price</h6>
                            <input className="form-control" type="Number" placeholder="Enter Price"
                            name='price' value={price} onChange={createFood}/>
                        </div>
                        <div>
                            <h6>Prepared Time</h6>
                            <input className="form-control" type="text" placeholder="Enter Prepared Time"
                            name='preparedTime' value={preparedTime} onChange={createFood}/>
                        </div>
                        <div className='mb-4'>
                            <h6>Food Image</h6>
                            <div className='d-flex align-items-center gap-2'>
                                <div>
                                    <img src={preview} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"70px", width:"70px" }}/>
                                </div>
                                <div>
                                    <input className="form-control" type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];
                                    if (file) {
                                    setImage(file);
                                    setPreview(URL.createObjectURL(file));
                                    }
                                }}/>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary w-50" type="Submit">Add Food</button>
                            <button className="btn btn-danger w-50" onClick={() => setPop(false)}>Cancel</button>
                        </div> 
                    </div>
                    </form>   
                </div>
                </div>
            )}

            {editPop && (
                <div className='position-fixed top-0 start-0 vh-100 w-100 d-flex justify-content-center align-items-center px-3' style={{zIndex:1000, backgroundColor:"rgba(0,0,0,0.5)"}}>
                <div className="bg-white rounded shadow-lg p-4 overflow-y-auto w-100" style={{maxWidth:"550px", maxHeight:"80vh", scrollbarWidth:"none"}}>
                    <h2 className='text-center'>Edit Food</h2>
                    <form onSubmit={handleUpdateteFood}>
                    <div className='d-flex flex-column gap-4'>
                        <div>
                            <h6>Food Name</h6>
                            <input className="form-control" type="text" placeholder="Enter Food Name"
                            name='name' value={name} onChange={updateFood}/>
                        </div>
                        <div>
                            <h6>Category</h6>
                            <select name="category" className="form-select" value={category} onChange={updateFood}>
                                <option>Select Category</option>
                                {allCategory.map((item) => (
                                    <option key={item._id} value={item._id} >{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h6>Food Description</h6>
                            <input className="form-control" type="text" placeholder="Enter Food description"
                            name='description' value={description} onChange={updateFood}/>
                        </div>
                        <div>
                            <h6>Price</h6>
                            <input className="form-control" type="Number" placeholder="Enter Price"
                            name='price' value={price} onChange={updateFood}/>
                        </div>
                        <div>
                            <h6>Prepared Time</h6>
                            <input className="form-control" type="text" placeholder="Enter Prepared Time"
                            name='preparedTime' value={preparedTime} onChange={updateFood}/>
                        </div>
                        <div className='mb-4'>
                            <h6>Food Image</h6>
                            <div className='d-flex align-items-center gap-2'>
                                <div>
                                    <img src={preview} className="rounded-circle shadow mt-2" style={{ objectFit: "cover", height:"70px", width:"70px" }}/>
                                </div>
                                <div>
                                    <input className="form-control" type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];
                                    if (file) {
                                    setImage(file);
                                    setPreview(URL.createObjectURL(file));
                                    }
                                }}/>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary w-50" type="Submit">Update Food</button>
                            <button className="btn btn-danger w-50" onClick={() => setEditPop(false)}>Cancel</button>
                        </div> 
                    </div>
                    </form>   
                </div>
                </div>
            )}
        <Footer/>
        </div>
    )
    }
            