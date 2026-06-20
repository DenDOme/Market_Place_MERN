import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, clearCart } from "../../stores/slices/cartSlice";
import { createOrder } from "../../stores/slices/orderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalPrice, loading: cartLoading } = useSelector(
    (state) => state.carts
  );
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.orders
  );

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      setFormError("Укажите адрес доставки");
      return;
    }

    setFormError("");

    dispatch(createOrder({ address, paymentMethod }))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        navigate("/profile/current");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="container mx-auto p-8 min-h-[calc(100vh-64px-75px)] text-white">
        Загрузка...
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-8 min-h-[calc(100vh-64px-75px)]">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Оформление заказа
        </h1>
        <p className="text-gray-400">Корзина пуста, нечего оформлять</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 min-h-[calc(100vh-64px-75px)]">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Оформление заказа
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-dark text-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Товары</h2>

          <div className="flex flex-col gap-3">
            {cartItems.map((item) => (
              <div
                key={item._id ?? item.productId}
                className="flex items-center justify-between border-b border-gray-700 pb-2"
              >
                <div>
                  <p className="font-medium">{item.name ?? "Товар"}</p>
                  <p className="text-gray-400 text-sm">
                    {item.quantity} x {item.price.toFixed(2)} $
                  </p>
                </div>
                <p className="text-primary font-bold">
                  {(item.price * item.quantity).toFixed(2)} $
                </p>
              </div>
            ))}
          </div>

          <div className="text-right text-xl font-bold mt-4">
            Итого: {Number(totalPrice).toFixed(2)} $
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-96 bg-dark text-white p-6 rounded-xl flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold">Доставка и оплата</h2>

          <div className="flex flex-col gap-2">
            <label className="text-white">Адрес доставки</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Город, улица, дом, квартира"
              rows={3}
              className="p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white">Способ оплаты</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Card">Карта</option>
              <option value="Cash">Наличные</option>
            </select>
          </div>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}

          {orderError && (
            <p className="text-red-400 text-sm">
              {typeof orderError === "string"
                ? orderError
                : orderError?.message || "Не удалось оформить заказ"}
            </p>
          )}

          <button
            type="submit"
            disabled={orderLoading}
            className={`mt-2 p-2 rounded font-semibold ${
              orderLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:opacity-80"
            } text-white`}
          >
            {orderLoading ? "Оформляем..." : "Подтвердить заказ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;