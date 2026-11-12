import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Utensils,
  MoreHorizontal,
  FolderOpen,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateCategory,
  DeleteCategory,
  GetCategory,
  UpdateCategory,
} from "../../Redux/CategorySlice";
import { GetAllFoods } from "../../Redux/FoodSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";

export const AdminCategories = () => {
  const dispatch = useDispatch();

  const { category = [] } = useSelector((state) => state.category);
  const { food = [] } = useSelector((state) => state.food);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(GetCategory());
    dispatch(GetAllFoods());
  }, [dispatch]);

  const openAddCategory = () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryImage(null);
    setShowCategoryModal(true);
  };

  const openEditCategory = (selectedCategory) => {
    setEditCategory(selectedCategory);
    setCategoryName(selectedCategory.name || "");
    setCategoryDescription(selectedCategory.description || "");
    setCategoryImage(null);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryImage(null);
    setIsSubmitting(false);
  };

  const createCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("description", categoryDescription.trim());

      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      const result = await dispatch(
        CreateCategory({
          value: formData,
        })
      );

      if (CreateCategory.fulfilled.match(result)) {
        closeCategoryModal();
        dispatch(GetCategory());
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategory = async (id) => {
    if (!categoryName.trim()) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("categoryName", categoryName.trim());
      formData.append("categoryDescription", categoryDescription.trim());

      if (categoryImage) {
        formData.append("categoryImage", categoryImage);
      }

      const result = await dispatch(
        UpdateCategory({
          id,
          value: formData,
        })
      );

      if (UpdateCategory.fulfilled.match(result)) {
        closeCategoryModal();
        dispatch(GetCategory());
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!shouldDelete) return;

    await dispatch(DeleteCategory(id));
    dispatch(GetCategory());
  };

  const getFoodCount = (categoryId) => {
    return food.filter((item) => {
      const itemCategoryId =
        typeof item.category === "object"
          ? item.category?._id
          : item.category;

      return itemCategoryId === categoryId;
    }).length;
  };

  const filteredCategories = useMemo(() => {
    if (!Array.isArray(category)) return [];

    const searchValue = search.toLowerCase().trim();

    return category.filter((cat) =>
      cat.name?.toLowerCase().includes(searchValue)
    );
  }, [category, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );

  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoriesInUse = Array.isArray(category)
    ? category.filter((cat) => getFoodCount(cat._id) > 0).length
    : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getImagePreview = () => {
    if (!categoryImage) return null;
    return URL.createObjectURL(categoryImage);
  };

  return (
    <>
      <Navbar />

      <div
        className="min-vh-100"
        style={{
          background:
            "radial-gradient(circle at 8% 0%, rgba(255, 113, 48, 0.14), transparent 30%), radial-gradient(circle at 95% 20%, rgba(120, 65, 35, 0.13), transparent 28%), #0d0d0d",
          color: "#f8fafc",
        }}
      >
        <main className="container-fluid container-xl px-3 px-md-4 py-4 py-lg-5">
          <div
            className="rounded-4 p-3 p-md-4 mb-4 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 113, 48, 0.16), rgba(28, 28, 28, 0.98) 65%)",
              border: "1px solid #343434",
            }}
          >
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-7">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "38px",
                      height: "38px",
                      background: "rgba(255, 113, 48, 0.15)",
                      color: "#ff7130",
                    }}
                  >
                    <FolderOpen size={18} />
                  </span>

                  <span
                    className="small fw-semibold"
                    style={{
                      color: "#ff9a68",
                      letterSpacing: "1px",
                    }}
                  >
                    MENU MANAGEMENT
                  </span>
                </div>

                <h2 className="fw-bold mb-2">Food Categories</h2>

                <p
                  className="mb-0"
                  style={{
                    color: "#94a3b8",
                    maxWidth: "520px",
                    fontSize: "14px",
                    lineHeight: "1.7",
                  }}
                >
                  Organize your food menu into clean, easy-to-browse
                  categories and manage every category from one dashboard.
                </p>
              </div>

              <div className="col-12 col-lg-5">
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                    onClick={openAddCategory}
                    style={{
                      background: "#ff7130",
                      color: "#171717",
                      border: "1px solid #ff7130",
                      minHeight: "44px",
                    }}
                  >
                    <Plus size={18} />
                    Add New Category
                  </button>

                  <div className="position-relative">
                    <Search
                      size={17}
                      className="position-absolute"
                      style={{
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#64748b",
                      }}
                    />

                    <input
                      type="text"
                      className="form-control rounded-3 ps-5 py-2 shadow-none"
                      placeholder="Search categories..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        background: "#171717",
                        border: "1px solid #3a3a3a",
                        color: "#f8fafc",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-4">
              <div
                className="rounded-4 p-3 h-100"
                style={{
                  background: "#171717",
                  border: "1px solid #303030",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "rgba(255, 113, 48, 0.13)",
                      color: "#ff7130",
                    }}
                  >
                    <FolderOpen size={21} />
                  </div>

                  <div>
                    <small style={{ color: "#64748b" }}>Categories</small>
                    <h5 className="fw-bold mb-0">{category.length}</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-4">
              <div
                className="rounded-4 p-3 h-100"
                style={{
                  background: "#171717",
                  border: "1px solid #303030",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "rgba(34, 197, 94, 0.12)",
                      color: "#4ade80",
                    }}
                  >
                    <Utensils size={21} />
                  </div>

                  <div>
                    <small style={{ color: "#64748b" }}>Food Items</small>
                    <h5 className="fw-bold mb-0">{food.length}</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div
                className="rounded-4 p-3 h-100"
                style={{
                  background: "#171717",
                  border: "1px solid #303030",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "rgba(168, 85, 247, 0.12)",
                      color: "#c084fc",
                    }}
                  >
                    <ArrowUpRight size={21} />
                  </div>

                  <div>
                    <small style={{ color: "#64748b" }}>
                      Categories In Use
                    </small>
                    <h5 className="fw-bold mb-0">{categoriesInUse}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentCategories.length > 0 ? (
            <>
              <div className="row g-3">
                {currentCategories.map((cat) => {
                  const foodCount = getFoodCount(cat._id);

                  return (
                    <div
                      className="col-12 col-sm-6 col-lg-4 col-xl-3"
                      key={cat._id}
                    >
                      <div
                        className="h-100 overflow-hidden rounded-4"
                        style={{
                          background:
                            "linear-gradient(145deg, #191919, #111111)",
                          border: "1px solid #303030",
                        }}
                      >
                        <div
                          className="position-relative"
                          style={{ height: "190px" }}
                        >
                          {cat.image?.url ? (
                            <img
                              src={cat.image.url}
                              alt={cat.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="w-100 h-100 d-flex align-items-center justify-content-center"
                              style={{
                                background:
                                  "linear-gradient(135deg, #292929, #171717)",
                                color: "#64748b",
                              }}
                            >
                              <FolderOpen size={45} />
                            </div>
                          )}

                          <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,.1), transparent 40%, rgba(0,0,0,.75))",
                            }}
                          />

                          <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between">
                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{
                                background: "rgba(15, 15, 15, 0.8)",
                                color: "#f8fafc",
                                border: "1px solid rgba(255,255,255,.14)",
                                fontSize: "10px",
                              }}
                            >
                              {foodCount}{" "}
                              {foodCount === 1 ? "item" : "items"}
                            </span>

                            <button
                              type="button"
                              className="btn rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{
                                width: "34px",
                                height: "34px",
                                background: "rgba(15, 15, 15, 0.8)",
                                color: "#f8fafc",
                                border: "1px solid rgba(255,255,255,.14)",
                              }}
                              onClick={() => openEditCategory(cat)}
                            >
                              <MoreHorizontal size={17} />
                            </button>
                          </div>
                        </div>

                        <div className="p-3">
                          <h6 className="fw-bold mb-2">{cat.name}</h6>

                          <p
                            className="mb-0"
                            style={{
                              color: "#94a3b8",
                              fontSize: "12px",
                              lineHeight: "1.6",
                              minHeight: "38px",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {cat.description || "No description available."}
                          </p>

                          <div
                            className="d-flex align-items-center justify-content-between mt-3 pt-3"
                            style={{ borderTop: "1px solid #303030" }}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="rounded-circle"
                                style={{
                                  width: "7px",
                                  height: "7px",
                                  background:
                                    foodCount > 0 ? "#4ade80" : "#64748b",
                                }}
                              />

                              <small
                                style={{
                                  color:
                                    foodCount > 0 ? "#4ade80" : "#94a3b8",
                                  fontSize: "11px",
                                }}
                              >
                                {foodCount > 0 ? "Active" : "Empty"}
                              </small>
                            </div>

                            <div className="d-flex gap-1">
                              <button
                                type="button"
                                className="btn btn-sm rounded-3"
                                title="Edit category"
                                onClick={() => openEditCategory(cat)}
                                style={{
                                  background: "rgba(255, 255, 255, 0.06)",
                                  color: "#cbd5e1",
                                  border: "1px solid #383838",
                                }}
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm rounded-3"
                                title="Delete category"
                                onClick={() => deleteCategory(cat._id)}
                                style={{
                                  background: "rgba(239, 68, 68, 0.1)",
                                  color: "#f87171",
                                  border: "1px solid rgba(239, 68, 68, .25)",
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4">
                <small style={{ color: "#64748b" }}>
                  Showing{" "}
                  {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCategories.length
                  )}{" "}
                  of {filteredCategories.length}
                </small>

                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm rounded-3"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(page - 1, 1))
                    }
                    style={{
                      background: "#171717",
                      color: "#cbd5e1",
                      border: "1px solid #303030",
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className="btn btn-sm rounded-3"
                      onClick={() => setCurrentPage(page)}
                      style={{
                        background:
                          currentPage === page ? "#ff7130" : "#171717",
                        color:
                          currentPage === page ? "#171717" : "#cbd5e1",
                        border:
                          currentPage === page
                            ? "1px solid #ff7130"
                            : "1px solid #303030",
                        fontWeight: currentPage === page ? "700" : "500",
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="btn btn-sm rounded-3"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(page + 1, totalPages)
                      )
                    }
                    style={{
                      background: "#171717",
                      color: "#cbd5e1",
                      border: "1px solid #303030",
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="rounded-4 text-center py-5 px-3"
              style={{
                background: "#171717",
                border: "1px solid #303030",
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
                style={{
                  width: "72px",
                  height: "72px",
                  background: "rgba(255, 113, 48, 0.12)",
                  color: "#ff7130",
                }}
              >
                <FolderOpen size={32} />
              </div>

              <h5 className="fw-bold mb-2">No Categories Found</h5>

              <p
                className="small mb-4"
                style={{ color: "#94a3b8" }}
              >
                {search
                  ? "No category matches your search."
                  : "Start organizing your menu by creating your first category."}
              </p>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {search && (
                  <button
                    type="button"
                    className="btn rounded-3 px-4"
                    onClick={() => setSearch("")}
                    style={{
                      background: "#242424",
                      color: "#cbd5e1",
                      border: "1px solid #3a3a3a",
                    }}
                  >
                    Clear Search
                  </button>
                )}

                <button
                  type="button"
                  className="btn rounded-3 px-4"
                  onClick={openAddCategory}
                  style={{
                    background: "#ff7130",
                    color: "#171717",
                    border: "1px solid #ff7130",
                  }}
                >
                  <Plus size={17} className="me-1" />
                  Add Category
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {showCategoryModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.78)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div
              className="modal-content rounded-4 overflow-hidden"
              style={{
                background: "#171717",
                border: "1px solid #383838",
                color: "#f8fafc",
              }}
            >
              <div
                className="modal-header px-4 pt-4 pb-3"
                style={{ borderBottom: "1px solid #303030" }}
              >
                <div>
                  <h5 className="fw-bold mb-1">
                    {editCategory ? "Edit Category" : "Add Category"}
                  </h5>

                  <p
                    className="small mb-0"
                    style={{ color: "#94a3b8" }}
                  >
                    {editCategory
                      ? "Update the category information."
                      : "Create a new food category."}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn rounded-circle d-flex align-items-center justify-content-center"
                  onClick={closeCategoryModal}
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#242424",
                    color: "#cbd5e1",
                    border: "1px solid #3a3a3a",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="modal-body px-4 py-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Category Name
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3 shadow-none"
                    placeholder="Eg: Fast Food"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    style={{
                      background: "#202020",
                      border: "1px solid #3a3a3a",
                      color: "#f8fafc",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Description
                  </label>

                  <textarea
                    className="form-control rounded-3 shadow-none"
                    rows="3"
                    placeholder="Describe this category..."
                    value={categoryDescription}
                    onChange={(e) =>
                      setCategoryDescription(e.target.value)
                    }
                    style={{
                      background: "#202020",
                      border: "1px solid #3a3a3a",
                      color: "#f8fafc",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold small">
                    Category Image
                  </label>

                  <input
                    type="file"
                    className="form-control rounded-3"
                    accept="image/*"
                    onChange={(e) =>
                      setCategoryImage(e.target.files?.[0] || null)
                    }
                    style={{
                      background: "#202020",
                      border: "1px solid #3a3a3a",
                      color: "#cbd5e1",
                      fontSize: "12px",
                    }}
                  />

                  {editCategory && !categoryImage && editCategory.image?.url && (
                    <div className="mt-3 d-flex align-items-center gap-2">
                      <img
                        src={editCategory.image.url}
                        alt={editCategory.name}
                        className="rounded-3"
                        style={{
                          width: "58px",
                          height: "58px",
                          objectFit: "cover",
                          border: "1px solid #3a3a3a",
                        }}
                      />

                      <small style={{ color: "#94a3b8" }}>
                        Current image
                      </small>
                    </div>
                  )}

                  {categoryImage && (
                    <div className="mt-3">
                      <img
                        src={getImagePreview()}
                        alt="Category preview"
                        className="rounded-3"
                        style={{
                          width: "78px",
                          height: "78px",
                          objectFit: "cover",
                          border: "1px solid #3a3a3a",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                className="modal-footer px-4 pb-4 pt-3"
                style={{ borderTop: "1px solid #303030" }}
              >
                <button
                  type="button"
                  className="btn rounded-3 px-4"
                  onClick={closeCategoryModal}
                  disabled={isSubmitting}
                  style={{
                    background: "#242424",
                    color: "#cbd5e1",
                    border: "1px solid #3a3a3a",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn rounded-3 px-4"
                  disabled={isSubmitting || !categoryName.trim()}
                  onClick={() => {
                    if (editCategory) {
                      updateCategory(editCategory._id);
                    } else {
                      createCategory();
                    }
                  }}
                  style={{
                    background: "#ff7130",
                    color: "#171717",
                    border: "1px solid #ff7130",
                    fontWeight: "600",
                  }}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editCategory
                    ? "Save Changes"
                    : "Create Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};