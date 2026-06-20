import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
} from "../../stores/slices/cartSlice";

const CartList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, loading, error } = useSelector(
    (state) => state.carts
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading && cartItems.length === 0) {
    return (
      <div className="container mx-auto p-8 min-h-[calc(100vh-64px-75px)] text-white">
        Загрузка...
      </div>
    );
  }

  const createOrder = () => {
   navigate("/checkout");
  }

  return (
    <div className="container mx-auto p-8 min-h-[calc(100vh-64px-75px)]">
      <h1 className="text-2xl font-bold mb-6 text-white">Корзина</h1>

      {error && (
        <p className="text-red-400 mb-4">
          {typeof error === "string"
            ? error
            : error?.message || "Произошла ошибка"}
        </p>
      )}

      {!cartItems || cartItems.length === 0 ? (
        <p className="text-gray-400">Корзина пуста</p>
      ) : (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id ?? item.productId}
              className="flex items-center justify-between bg-dark text-white p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">{item.name ?? "Товар"}</p>
                <p className="text-gray-400">Кол-во: {item.quantity}</p>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-primary font-bold">
                  {(item.price * item.quantity).toFixed(2)} $
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      dispatch(removeItemFromCart(item.productId))
                    }
                    disabled={loading}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-dark font-bold hover:opacity-80 disabled:opacity-50"
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <button
                    onClick={() => dispatch(addItemToCart(item.productId))}
                    disabled={loading}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold hover:opacity-80 disabled:opacity-50"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="text-right text-xl font-bold mt-4 text-dark">
            Итого: {Number(totalPrice).toFixed(2)} $
          </div>
          
          <div className="w-full h-8 flex flex-row-reverse items-center">
            <button
              onClick={createOrder}
              disabled={loading}
              className="w-fit px-4 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold hover:opacity-80 disabled:opacity-50"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;