import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import logo from '../assets/image.avif'

export const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">

          {/* Logo & Description */}
          <div className="col-md-3 mb-4">
            <div className="d-flex align-items-center gap-1">
            <img src={logo} style={{width:"30px", height:"30px", borderRadius:"50%"}}/>
            <h3 className="fw-bold mt-1"> RecuPy</h3>
            </div>
            <p>
              Reducing food waste and connecting donors,
              NGOs, and volunteers to build a hunger-free future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Home</a></li>
              <li><a href="#" className="text-light text-decoration-none">How It Works</a></li>
              <li><a href="#" className="text-light text-decoration-none">Join Us</a></li>
              {/* <li><a href="#" className="text-light text-decoration-none">Login</a></li>
              <li><a href="#" className="text-light text-decoration-none">Register</a></li> */}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Contact</h5>
            <p>📍 Chennai, Tamil Nadu</p>
            <p>📧 support@recupy.com</p>
            <p>📞 +91 81484 27615</p>
          </div>

          {/* Social Media */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Follow Us</h5>

            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-light">
                <FaFacebook />
              </a>

              <a href="#" className="text-light">
                <FaInstagram />
              </a>

              <a href="#" className="text-light">
                <FaLinkedin />
              </a>

              <a href="#" className="text-light">
                <FaXTwitter />
              </a>
            </div>
          </div>

        </div>

        <hr />

        <div className="text-center">
          <p className="mb-0">
            © 2026 RecuPy. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};