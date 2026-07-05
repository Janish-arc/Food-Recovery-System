import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Banner1 from '../../assets/banner1.png'
import Banner2 from "../../assets/banner2.png";
import Banner3 from "../../assets/banner3.png";
import Banner4 from "../../assets/banner4.png";
import Banner5 from "../../assets/banner5.png"

const images = [Banner1, Banner2, Banner3, Banner4, Banner5]

export const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length-1 : (prev - 1)))
  }
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length )
  }
  return (
    <div className="position-relative" style={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{ display: "flex", transform: `translateX(-${current * 100}%)`, transition: "transform 2s ease-in-out" }}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`slide-${index}`} className="w-100 flex-shrink-0"style={{height: "clamp(250px, 35vw, 400px)", objectFit: "cover"}}/>
        ))}
      </div>
      <button onClick={prevSlide} className='position-absolute bg-secondary text-white rounded-circle border border-none d-flex justify-content-center align-items-center' style={{width:'30px', height: '30px', fontSize: '33px', top:'50%', left:'10px'}}><ChevronLeft/></button>
      <button onClick={nextSlide} className='position-absolute bg-secondary text-white rounded-circle border border-none d-flex justify-content-center align-items-center ' style={{width:'30px', height: '30px', fontSize: '33px', top:'50%', right:'10px'}}><ChevronRight/></button>

      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-1">
        {images.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-circle border-0 ${
                current === index ? "bg-white active-dot" : "bg-white opacity-50"
                }`}
                style={{
                width: current === index ? "25px" : "0px",
                height: "4px",
                transition: "all 0.3s ease"
                }}
            ></button>
        ))}
    </div>
    </div>
  );
};