import './MyOrders.css';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets'; // ✅ Ensure this file exists

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <p>
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} x {item.quantity}
                    {i !== order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p>₹{order.amount / 100}</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span>  <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
