import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Something went wrong while fetching orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders add">
      <h2>Order Page</h2>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            {/* Left: Icon */}
            <img src={assets.parcel_icon} alt="parcel" />

            {/* Middle: Details */}
            <div className="order-details">
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx !== order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">Phone: {order.address.phone}</p>
            </div>

            {/* Right: Items, Total, Status */}
            <div className="order-item-right">
              <div>Items: {order.items.length}</div>
              <div>Total: ₹{order.amount}</div>
              <select defaultValue={order.status || "Food Processing"}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
