import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, changeOrderStatus } from "../../stores/slices/orderSlice";

const UpdateStatus = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(changeOrderStatus({ orderId, status }));
  };

  return (
    <div>
      {loading && <p>Loading orders...</p>}
      {error && <p>{error}</p>}
      <h2>Update Order Status</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <span>Order ID: {order.id}</span> -
            <span>Current Status: {order.status}</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateStatus;
