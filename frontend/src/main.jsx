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
import { Donor } from './Pages/Donor/Donor.jsx'
import { Volunteer } from './Pages/Volunteer/Volunteer.jsx'
import { Ngo } from './Pages/Ngo/Ngo.jsx'
import { MyDonations } from './Pages/Donor/MyDonations.jsx'
import { Profile } from './Pages/CommonFiles/Profile.jsx'
import { FoodDetails } from './Pages/CommonFiles/FoodDetails.jsx'
import { NgoAcceptedFoods } from './Pages/Ngo/NgoAcceptedFoods.jsx'
import { MyDeliveries } from './Pages/Volunteer/MyDeliveries.jsx'
import { DeliveryHistory } from './Pages/Volunteer/DeliveryHistory.jsx'
import { NgoFoodHistory } from './Pages/Ngo/NgoFoodHistory.jsx'
import { Admin } from './Pages/Admin/Admin.jsx'
import { AllUsers } from './Pages/Admin/AllUsers.jsx'
import { DonorUsers } from './Pages/Admin/DonorUsers.jsx'
import { NgoUsers } from './Pages/Admin/NgoUsers.jsx'
import { VolunteerUsers } from './Pages/Admin/VolunteerUsers.jsx'
import { AllFoods } from './Pages/Admin/AllFoods.jsx'
import { ForgotPasswordPage } from './Pages/CommonFiles/ForgotPassword.jsx'
import { ResetPasswordPage } from './Pages/CommonFiles/ResetPassword.jsx'

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
    {path: "/donor", element:<Donor/>},
    {path: "/volunteer", element: <Volunteer/>},
    {path: "/ngo", element: <Ngo/>},
    {path: "/mydonations", element: <MyDonations/>},
    {path: "/myprofile", element: <Profile/>},
    {path: "/fooddetails/:id", element: <FoodDetails/>},
    {path: "/ngo/acceptedfood", element: <NgoAcceptedFoods/>},
    {path: "/volunteer/mydeliveries", element: <MyDeliveries/>},
    {path: "/mydeliveredhistory", element: <DeliveryHistory/>},
    {path: "/receivedfoodhistory", element: <NgoFoodHistory/>},
    {path: "/admin", element: <Admin/>},
    {path: "/allUsers", element: <AllUsers/>},
    {path: "/alldonors", element: <DonorUsers/>},
    {path: "/allngos", element: <NgoUsers/>},
    {path: "/allvolunteers", element: <VolunteerUsers/>},
    {path: "/profile/:id", element: <Profile/>},
    {path: "/allfoods", element: <AllFoods/>},
    {path: "/forgotpassword", element: <ForgotPasswordPage/>},
    {path: "/reset/password/:token", element: <ResetPasswordPage />}
])
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router = {route}/>
    <Toaster position='top-center'/>
  </Provider>,
)
