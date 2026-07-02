import React, { useEffect } from 'react'
import { Navbar } from '../../Components/Navbar'
import { Footer } from '../../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetCategory } from '../../Redux/CategorySlice'
import { GetRestaurant } from '../../Redux/RestaurantSlice'

export const Home = () => {

    const {user, isAuthenticated} = useSelector((state) => state.user)
    const {category} = useSelector((state) => state.category)
    const {restaurant} = useSelector((state) => state.restaurant)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(GetCategory())
    }, [dispatch])

    useEffect(() => {
        dispatch(GetRestaurant())
    }, [dispatch])

  return (
    <>
        <Navbar/>
        <div className='vh-100 home'>
            <div className='container pt-4'>

                {/* Category Section */}
                <div className='mt-3 mx-5'>
                    <h4 className='fw-bold fs-3'>{user?.name}, Find Your Favourite . . </h4>
                    <div className='d-flex gap-5 overflow-x-auto mt-5 mb-5' style={{scrollbarWidth: "none"}}>
                        {category?.map((item) => (
                            <div  key={item._id} className='text-center'>                   
                                <img src={item?.image?.url} alt={item.name} className='rounded-circle' style={{width:"120px", height:"120px", objectFit: "cover"}}/>
                                <h6 className='mt-2'>{item.name}</h6>
                            </div>
                        ))}
                    </div>
                    <hr />
                </div>

                {/* Restaurant Section */}
                <div className='card col-6 col-md-4 col-lg-3'>
                    {restaurant?.map((item) => (
                    <div style={{width: "250px", height:"100px", borderRadius:"10px"}}>
                        <img src={item.image} alt={item.name}/>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        <Footer/>
    </>
    
  )
}