import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteUser, GetAllUsers } from "../../Redux/UserSlice";
import { Navbar } from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { Pagination } from "../../Components/Pagination";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    Users,
    UserCheck,
    Search,
    Filter,
    CalendarDays,
    Eye,
    Trash2,
    ShieldCheck,
    X,
} from "lucide-react";

export const AllUsers = () => {
    const { users = [], isAuthenticated } = useSelector(
        (state) => state.user
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [roleFilter, setRoleFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(GetAllUsers());
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter]);

    const filteredUsers = users
        .filter(
            (user) =>
                roleFilter === "all" || user.role === roleFilter
        )
        .filter((user) => {
            const searchValue = search.toLowerCase();

            return (
                user?.name?.toLowerCase().includes(searchValue) ||
                user?.email?.toLowerCase().includes(searchValue)
            );
        });

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    const currentUsers = filteredUsers.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(
        filteredUsers.length / itemsPerPage
    );

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            await dispatch(DeleteUser(id));
            await dispatch(GetAllUsers());

            toast.success("User deleted successfully");
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const getRoleDetails = (role) => {
        const roleData = {
            customer: {
                label: "User",
                color: "#23c581",
                background: "rgba(35, 197, 129, 0.15)",
            },
            restaurant: {
                label: "Restaurant",
                color: "#438bff",
                background: "rgba(67, 139, 255, 0.15)",
            },
            admin: {
                label: "Admin",
                color: "#ff6675",
                background: "rgba(255, 102, 117, 0.15)",
            },
        };

        return (
            roleData[role] || {
                label: role || "Unknown",
                color: "#8d98a8",
                background: "rgba(141, 152, 168, 0.15)",
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setRoleFilter("all");
    };

    const cardStyle = {
        background:
            "linear-gradient(145deg, #191c20 0%, #101214 100%)",
        border: "1px solid #292d32",
        borderRadius: "24px",
        color: "#ffffff",
    };

    const inputStyle = {
        backgroundColor: "#111417",
        color: "#ffffff",
        border: "1px solid #30353b",
    };

    const mutedText = {
        color: "#8d98a8",
    };

    return (
        <div
            className="min-vh-100"
            style={{
                background:
                    "radial-gradient(circle at top left, #24140f 0%, #0b0b0d 38%, #090a0b 100%)",
            }}
        >
            <Navbar />

            <main className="container-fluid container-xl px-3 px-lg-4 py-4 text-white">
                {/* Header */}
                <section className="d-flex flex-wrap justify-content-between align-items-end gap-4 mb-4">
                    <div>
                        <div
                            className="d-flex align-items-center gap-2 fw-bold mb-3"
                            style={{
                                color: "#ff7a32",
                                letterSpacing: "3px",
                                fontSize: "13px",
                            }}
                        >
                            <Users size={17} />
                            ADMIN DASHBOARD
                        </div>

                        <h1
                            className="fw-bold mb-2"
                            style={{
                                fontSize: "clamp(30px, 4vw, 46px)",
                                letterSpacing: "-1.5px",
                            }}
                        >
                            User Management
                        </h1>

                        <p className="mb-0" style={mutedText}>
                            Manage and monitor all registered users.
                        </p>
                    </div>

                    <div
                        className="d-flex align-items-center gap-3 px-4 py-3"
                        style={{
                            backgroundColor: "#171a1d",
                            border: "1px solid #30353b",
                            borderRadius: "20px",
                        }}
                    >
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "46px",
                                height: "46px",
                                borderRadius: "15px",
                                backgroundColor:
                                    "rgba(67, 139, 255, 0.15)",
                                color: "#438bff",
                            }}
                        >
                            <UserCheck size={22} />
                        </div>

                        <div>
                            <small
                                className="d-block"
                                style={mutedText}
                            >
                                Total Users
                            </small>

                            <h4 className="fw-bold mb-0">
                                {users.length}
                            </h4>
                        </div>
                    </div>
                </section>

                {/* Filter Card */}
                <section
                    className="p-4 mb-4"
                    style={cardStyle}
                >
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-lg-8">
                            <div className="input-group">
                                <span
                                    className="input-group-text"
                                    style={{
                                        ...inputStyle,
                                        borderRight: "0",
                                        borderRadius:
                                            "30px 0 0 30px",
                                    }}
                                >
                                    <Search
                                        size={18}
                                        style={mutedText}
                                    />
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    style={{
                                        ...inputStyle,
                                        borderLeft: "0",
                                        borderRadius:
                                            "0 30px 30px 0",
                                    }}
                                />

                                {search && (
                                    <button
                                        type="button"
                                        className="btn position-absolute end-0 top-50 translate-middle-y me-2 d-flex align-items-center justify-content-center"
                                        onClick={() => setSearch("")}
                                        style={{
                                            color: "#8d98a8",
                                            zIndex: 5,
                                        }}
                                    >
                                        <X size={17} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="d-flex align-items-center gap-2">
                                <span
                                    className="d-flex align-items-center gap-2 text-nowrap"
                                    style={mutedText}
                                >
                                    <Filter size={17} />
                                    Filter
                                </span>

                                <select
                                    className="form-select"
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    style={{
                                        ...inputStyle,
                                        borderRadius: "30px",
                                    }}
                                >
                                    <option value="all">
                                        All Users
                                    </option>

                                    <option value="customer">
                                        User
                                    </option>

                                    <option value="restaurant">
                                        Restaurant
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
                        <small style={mutedText}>
                            Showing{" "}
                            <strong className="text-white">
                                {currentUsers.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="text-white">
                                {filteredUsers.length}
                            </strong>{" "}
                            users
                        </small>

                        {(search || roleFilter !== "all") && (
                            <button
                                type="button"
                                className="btn btn-sm rounded-pill px-3"
                                onClick={clearFilters}
                                style={{
                                    backgroundColor:
                                        "rgba(255, 122, 50, 0.15)",
                                    color: "#ff7a32",
                                    border: "1px solid rgba(255, 122, 50, 0.3)",
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </section>

                {/* Users Table */}
                {isAuthenticated && currentUsers.length > 0 ? (
                    <section
                        className="p-0 overflow-hidden mb-4"
                        style={cardStyle}
                    >
                        <div className="table-responsive">
                            <table
                                className="table table-dark table-hover align-middle mb-0"
                                style={{
                                    "--bs-table-bg": "transparent",
                                    "--bs-table-hover-bg": "#1c2025",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            color: "#8d98a8",
                                            fontSize: "12px",
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        <th className="px-4 py-4">
                                            USER
                                        </th>

                                        <th className="py-4">
                                            EMAIL
                                        </th>

                                        <th className="py-4">
                                            PHONE
                                        </th>

                                        <th className="py-4">
                                            ROLE
                                        </th>

                                        <th className="py-4">
                                            JOINED
                                        </th>

                                        <th className="py-4 text-center">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentUsers.map((item) => {
                                        const roleDetails =
                                            getRoleDetails(item?.role);

                                        return (
                                            <tr key={item?._id}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        {item?.image?.url ? (
                                                            <img
                                                                src={
                                                                    item.image
                                                                        .url
                                                                }
                                                                alt={
                                                                    item.name
                                                                }
                                                                className="rounded-circle"
                                                                style={{
                                                                    width: "48px",
                                                                    height: "48px",
                                                                    objectFit:
                                                                        "cover",
                                                                    border: "2px solid #30353b",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                                                style={{
                                                                    width: "48px",
                                                                    height: "48px",
                                                                    backgroundColor:
                                                                        "#252a30",
                                                                    color: "#ff7a32",
                                                                    border: "2px solid #30353b",
                                                                }}
                                                            >
                                                                {item?.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()}
                                                            </div>
                                                        )}

                                                        <div>
                                                            <div className="fw-semibold">
                                                                {item?.name ||
                                                                    "Unnamed User"}
                                                            </div>

                                                            <small
                                                                style={{
                                                                    color: "#66717f",
                                                                }}
                                                            >
                                                                #
                                                                {item?._id?.slice(
                                                                    -6
                                                                )}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        style={{
                                                            color: "#c3cbd5",
                                                        }}
                                                    >
                                                        {item?.email || "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        style={{
                                                            color: "#c3cbd5",
                                                        }}
                                                    >
                                                        {item?.phoneNo || "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className="px-3 py-2 rounded-pill fw-semibold"
                                                        style={{
                                                            color: roleDetails.color,
                                                            backgroundColor:
                                                                roleDetails.background,
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {roleDetails.label}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div
                                                        className="d-flex align-items-center gap-2"
                                                        style={mutedText}
                                                    >
                                                        <CalendarDays
                                                            size={16}
                                                        />

                                                        {item?.createdAt
                                                            ? new Date(
                                                                  item.createdAt
                                                              ).toLocaleDateString()
                                                            : "-"}
                                                    </div>
                                                </td>

                                                <td>
                                                    {item?.role !== "admin" ? (
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                                                                title="View Profile"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/profile/${item._id}`
                                                                    )
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        "rgba(67, 139, 255, 0.15)",
                                                                    color: "#438bff",
                                                                    border: "1px solid rgba(67, 139, 255, 0.25)",
                                                                }}
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />

                                                                <span className="d-none d-xl-inline">
                                                                    View
                                                                </span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                                                                title="Delete User"
                                                                onClick={() =>
                                                                    deleteUser(
                                                                        item._id
                                                                    )
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        "rgba(255, 102, 117, 0.15)",
                                                                    color: "#ff6675",
                                                                    border: "1px solid rgba(255, 102, 117, 0.25)",
                                                                }}
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />

                                                                <span className="d-none d-xl-inline">
                                                                    Delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className="d-flex align-items-center justify-content-center gap-1"
                                                            style={{
                                                                color: "#8d98a8",
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            <ShieldCheck
                                                                size={16}
                                                            />
                                                            Protected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : (
                    <section
                        className="text-center p-5 mb-4"
                        style={cardStyle}
                    >
                        <div
                            className="d-flex align-items-center justify-content-center mx-auto mb-4"
                            style={{
                                width: "76px",
                                height: "76px",
                                borderRadius: "24px",
                                backgroundColor:
                                    "rgba(255, 122, 50, 0.15)",
                                color: "#ff7a32",
                            }}
                        >
                            <Users size={34} />
                        </div>

                        <h4 className="fw-bold mb-2">
                            No users found
                        </h4>

                        <p className="mb-4" style={mutedText}>
                            {search || roleFilter !== "all"
                                ? "Try changing your search or filter."
                                : "There are no registered users available right now."}
                        </p>

                        {(search || roleFilter !== "all") && (
                            <button
                                type="button"
                                className="btn rounded-pill px-4"
                                onClick={clearFilters}
                                style={{
                                    backgroundColor: "#ff7130",
                                    color: "#ffffff",
                                    border: "1px solid #ff7130",
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </section>
                )}

                {/* Pagination */}
                {currentUsers.length > 0 && totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4 mb-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};