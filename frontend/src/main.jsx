import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MyProfile } from "./Redux/UserSlice";
import { store } from "./Redux/store.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Home } from "./Pages/CommonFiles/Home.jsx";
import { Register } from "./Pages/CommonFiles/Register.jsx";
import { Login } from "./Pages/CommonFiles/Login.jsx";
import { Profile } from "./Pages/CommonFiles/Profile.jsx";
import { FoodDetails } from "./Pages/CommonFiles/FoodDetails.jsx";
import { Admin } from "./Pages/Admin/Admin.jsx";
import { AllUsers } from "./Pages/Admin/AllUsers.jsx";
import { AllFoods } from "./Pages/Admin/AllFoods.jsx";
import { ForgotPasswordPage } from "./Pages/CommonFiles/ForgotPassword.jsx";
import { ResetPasswordPage } from "./Pages/CommonFiles/ResetPassword.jsx";
import { RestaurantDetails } from "./Pages/CommonFiles/RestaurantDetails.jsx";
import { Cart } from "./Pages/CommonFiles/Cart.jsx";
import { Checkout } from "./Pages/CommonFiles/Checkout.jsx";
import { Order } from "./Pages/CommonFiles/Order.jsx";
import { MyOrders } from "./Pages/CommonFiles/Myorders.jsx";
import { OrderDetails } from "./Pages/CommonFiles/OrderDetails.jsx";
import { Category } from "./Pages/CommonFiles/Category.jsx";
import { RestaurantDashboard } from "./Pages/CommonFiles/RestaurantDashboard.jsx";
import { RestaurantMenu } from "./Pages/CommonFiles/RestaurantMenu.jsx";
import { RestaurantProfile } from "./Pages/CommonFiles/RestaurantProfile.jsx";
import { RestaurantOrders } from "./Pages/CommonFiles/RestaurantOrders.jsx";
import { AllRestaurants } from "./Pages/CommonFiles/AllRestaurants.jsx";
import { AllFood } from "./Pages/CommonFiles/AllFood.jsx";
import { AdminRestaurants } from "./Pages/Admin/AllRestaurants.jsx";
import { AdminRestaurantDetails } from "./Pages/Admin/SingleRestaurant.jsx";
import { AdminOrders } from "./Pages/Admin/AdminOrders.jsx";
import { AdminCategories } from "./Pages/Admin/AdminCategory.jsx";
import { AdminReports } from "./Pages/Admin/AdminReport.jsx";
import { RestaurantOrderDetails } from "./Pages/CommonFiles/RestaurantOrdersDetails.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authLoading } = useSelector((state) => state.user);

    if (authLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AuthCheck = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(MyProfile());
    }, [dispatch]);

    return null;
};

const route = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/all/restaurants", element: <AllRestaurants /> },
    { path: "/all/foods", element: <AllFood /> },
    { path: "/restaurantdetails/:id", element: <RestaurantDetails /> },
    { path: "/category/:id", element: <Category /> },
    { path: "/fooddetails/:id", element: <FoodDetails /> },
    { path: "/forgotpassword", element: <ForgotPasswordPage /> },
    { path: "/reset/password/:token", element: <ResetPasswordPage /> },
    { path: "/cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
    { path: "/checkout", element: <ProtectedRoute><Checkout /></ProtectedRoute> },
    { path: "/order", element: <ProtectedRoute><Order /></ProtectedRoute> },
    { path: "/myorder", element: <ProtectedRoute><MyOrders /></ProtectedRoute> },
    { path: "/orderdetails/:id", element: <ProtectedRoute><OrderDetails /></ProtectedRoute> },
    { path: "/myprofile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
    { path: "/restaurant/dashboard", element: <ProtectedRoute><RestaurantDashboard /></ProtectedRoute> },
    { path: "/restaurant/profile", element: <ProtectedRoute><RestaurantProfile /></ProtectedRoute> },
    { path: "/restaurant/orders", element: <ProtectedRoute><RestaurantOrders /></ProtectedRoute> },
    { path: "/restaurant/menu", element: <ProtectedRoute><RestaurantMenu /></ProtectedRoute> },
    { path: "/profile/:id", element: <ProtectedRoute><Profile /></ProtectedRoute> },
    { path: "/admin", element: <ProtectedRoute><Admin /></ProtectedRoute> },
    { path: "/allUsers", element: <ProtectedRoute><AllUsers /></ProtectedRoute> },
    { path: "/allfoods", element: <ProtectedRoute><AllFoods /></ProtectedRoute> },
    { path: "/admin/allrestaurants", element: <ProtectedRoute><AdminRestaurants /></ProtectedRoute> },
    { path: "/admin/restaurant/:id", element: <ProtectedRoute><AdminRestaurantDetails /></ProtectedRoute> },
    { path: "/admin/orders", element: <ProtectedRoute><AdminOrders /></ProtectedRoute> },
    { path: "/admin/categories", element: <ProtectedRoute><AdminCategories /></ProtectedRoute> },
    { path: "/admin/reports", element: <ProtectedRoute><AdminReports /></ProtectedRoute> },
    { path: "/admin/order/:id", element: <ProtectedRoute><RestaurantOrderDetails/></ProtectedRoute> },
]);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <AuthCheck />
        <RouterProvider router={route} />
        <Toaster position="top-center" />
    </Provider>
);