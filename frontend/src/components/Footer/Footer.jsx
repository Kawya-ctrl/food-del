import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>Tomato is your go-to platform for fresh, fast, and delicious food delivery. From local favorites to international cuisines, we connect you with the best restaurants in your area. Enjoy quick service, affordable prices, and meals made with love — right at your doorstep.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" /> 
            <img src={assets.facebook_icon} alt="" />  
            <img src={assets.linkedIn_icon} alt="" /> 
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
          <li>Home</li>
          <li>About us</li>
          <li>Delivery</li>
          <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">Copyright © 2025 Tomato.com - All Rights Are Reserved.</p>
    </div>
  )
}

export default Footer;
