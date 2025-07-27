import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in to place an order");
      return;
    }

    const items = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        ...item,
        quantity: cartItems[item._id]
      }));

    const address = { ...data };
    const amount = getTotalCartAmount() + 2;

    try {
      const response = await axios.post(
        `${url}/api/order/place`,
        { items, amount, address },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Order failed to process.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error placing order.");
    }
  };

  // const placeOrder = async(event) => {
  //   event.preventDefault();
  //   let orderItems = [];
  //   food_list.map((item)=>{
  //     if(cartItems[item._id]>0){
  //       let itemInfo =item;
  //       itemInfo.quantity = cartItems[item._id];
  //       orderItems.push(itemInfo);
  //     }
  //   })
  //   let orderData = {
  //     address:data,
  //     items:orderItems,
  //     amount:getTotalCartAmount() + 2,
  //   }
  //   let response = await axios.post(url+"/api/order/place", orderData,{headers: {
  //           Authorization: `Bearer ${token}`
  //         }})
  //   if(response.data.success){
  //     const {session_url} = response.data;
  //     window.location.replace(session_url);
  //   }
  //   else{
  //     alert("Order failed to process.");
  //   }

  // }

  const navigate = useNavigate();
  useEffect(() => {
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount() === 0){
      navigate('/cart');
    }
  },[token])



  return (
    <form onSubmit={handleSubmit} className="place-order" >
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
