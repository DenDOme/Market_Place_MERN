import {
  useLocation,
  NavLink,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, changeOrderStatus } from "../../stores/slices/orderSlice";
import { fetchProducts } from "../../stores/slices/productSlice";

const OrderTab = () => {
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const getProductById = (id) => products.find((p) => p._id === id);

  const activeOrders = orders.filter(
    (order) => order.status !== "Cancelled" && order.status !== "Completed"
  );
  const historyOrders = orders.filter(
    (order) => order.status === "Cancelled" || order.status === "Completed"
  );

  const renderOrders = (orderList) => (
    <div className="space-y-4">
      {orderList.map((order) => (
        <div
          key={order._id}
          className="bg-dark border border-gray-300 p-4 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <p className="text-white font-bold">Заказ № {order.trackingNumber}</p>
          <p className="text-white">Статус: {order.status}</p>
          <p className="text-white">
            Дата доставки: {new Date(order.deliveryDate).toLocaleDateString()}
          </p>
          <p className="text-white">Адрес: {order.address}</p>
          <p className="text-white">Метод оплаты: {order.paymentMethod}</p>
          <p className="text-white">Сумма: {order.totalPrice}₽</p>
          {order.status === "Pending" && (
            <button
              onClick={() =>
                dispatch(
                  changeOrderStatus({ orderId: order._id, status: "Cancelled" })
                )
              }
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Отменить заказ
            </button>
          )}
          <div className="mt-2 space-y-2">
            {order.items.map((item) => {
              const product = getProductById(item.productId);
              return (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-dark p-2 rounded-lg"
                >
                  {product && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {product?.name || "Товар не найден"}
                    </p>
                    <p className="text-white">Кол-во: {item.quantity}</p>
                    <p className="text-white">Цена за единицу: {item.price}₽</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (ordersLoading || productsLoading)
    return <p className="text-white">Загрузка заказов...</p>;
  if (ordersError || productsError)
    return <p className="text-red-500">Ошибка при загрузке заказов</p>;

  const currentTab = location.pathname.includes("current")
    ? "current"
    : "history";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-dark rounded-tl-2xl rounded-tr-2xl pt-8">
      <div className="w-full bg-dark px-6">
        <ul className="flex gap-4 text-white text-3xl font-bold ml-8 mb-6">
          <li>
            <NavLink
              to="/profile/current"
              className={({ isActive }) =>
                isActive ? "text-white" : "text-gray-400"
              }
            >
              Активные заказы
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/history"
              className={({ isActive }) =>
                isActive ? "text-white" : "text-gray-400"
              }
            >
              История заказов
            </NavLink>
          </li>
        </ul>

        <Routes>
          <Route path="/" element={<Navigate to="current" replace />} />
          <Route
            path="current"
            element={
              <div>
                {activeOrders.length ? (
                  renderOrders(activeOrders)
                ) : (
                  <p className="text-white">Нет активных заказов</p>
                )}
              </div>
            }
          />
          <Route
            path="history"
            element={
              <div>
                {historyOrders.length ? (
                  renderOrders(historyOrders)
                ) : (
                  <p className="text-white">История пуста</p>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default OrderTab;
