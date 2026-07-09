import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css" 
import { store } from './Redux/store.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { Home } from './Pages/CommonFiles/Home.jsx'
import { Register } from './Pages/CommonFiles/Register.jsx'
import { Login } from './Pages/CommonFiles/Login.jsx'
import { Profile } from './Pages/CommonFiles/Profile.jsx'
import { FoodDetails } from './Pages/CommonFiles/FoodDetails.jsx'
import { Admin } from './Pages/Admin/Admin.jsx'
import { AllUsers } from './Pages/Admin/AllUsers.jsx'
import { AllFoods } from './Pages/Admin/AllFoods.jsx'
import { ForgotPasswordPage } from './Pages/CommonFiles/ForgotPassword.jsx'
import { ResetPasswordPage } from './Pages/CommonFiles/ResetPassword.jsx'
import { RestaurantDetails } from './Pages/CommonFiles/RestaurantDetails.jsx'
import { Cart } from './Pages/CommonFiles/Cart.jsx'
import { Checkout } from './Pages/CommonFiles/Checkout.jsx'
import { Order } from './Pages/CommonFiles/Order.jsx'
import { MyOrders } from './Pages/CommonFiles/Myorders.jsx'
import { OrderDetails } from './Pages/CommonFiles/OrderDetails.jsx'
import { Category } from './Pages/CommonFiles/Category.jsx'
import { RestaurantDashboard } from './Pages/CommonFiles/RestaurantDashboard.jsx'
import { RestaurantMenu } from './Pages/CommonFiles/RestaurantMenu.jsx'

const ProtectedRoute = ({children}) => {
  const {isAuthenticated} = useSelector((state) => state.user)
  if(!isAuthenticated){
    return <Navigate to="/login" />
  }
  return children
}

// const [popUp, setPopUp] = useState(false)
const route = createBrowserRouter(
  [
    {path: '/', element: <Home/>},
    {path: "/register", element: <Register/>},
    {path: "/login", element: <Login/>},
    {path: "/restaurantdetails/:id", element: <RestaurantDetails/>},
    {path: "/category/:id", element: <Category/>},
    {path: "/cart", element: <Cart/>},
    {path: "/checkout", element:<Checkout/>},
    {path: "/order", element: <Order/>},
    {path: "/myorder", element: <MyOrders/>},
    {path: "/orderdetails/:id", element: <OrderDetails/>},
    {path: "/myprofile", element: <Profile/>},
    {path: "/fooddetails/:id", element: <FoodDetails/>},
    {path: "/restaurant/profile", element: <RestaurantDashboard/>},
    {path: "/restaurant/menu", element: <RestaurantMenu/>},
    {path: "/admin", element: <Admin/>},
    {path: "/allUsers", element: <AllUsers/>},
    {path: "/profile/:id", element: <Profile/>},
    {path: "/forgotpassword", element: <ForgotPasswordPage/>},
    {path: "/reset/password/:token", element: <ResetPasswordPage />}
])
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router = {route}/>
    <Toaster position='top-center'/>
  </Provider>,
)
