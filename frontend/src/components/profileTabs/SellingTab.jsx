import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProducts,
  deleteProduct,
} from "../../stores/slices/productSlice";
import { useNavigate } from "react-router-dom";

const SellingTab = () => {
  const { products, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProducts());
  }, [dispatch]);

  const handleDelete = (productId) => {
    if (confirm("Удалить этот товар?")) {
      dispatch(deleteProduct(productId));
    }
  };

  const handleUpdate = (productId) => {
    navigate("/product/update/" + productId);
  };

  const handleCreateProduct = () => {
    navigate("/product/create");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-dark rounded-tl-2xl rounded-tr-2xl pt-8 pb-8">
      <div className="w-full bg-dark px-6">
        <div className="flex justify-between items-center ml-8 mb-6">
          <h1 className="text-white text-3xl font-bold ">Мои товары</h1>
          <button
            onClick={handleCreateProduct}
            className={`px-4 py-2 font-bold text-white`}
          >
            Добавить товар
          </button>
        </div>

        {loading && <p className="text-white">Загрузка товаров...</p>}
        {error && <p className="text-red-500">Ошибка: {error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-white">У вас пока нет товаров.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold text-white">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-300">{product.description}</p>
                <p className="mt-2 font-bold text-white">{product.price} ₽</p>
                <div className="flex flex-col justify-center items-start mt-4">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:underline"
                  >
                    Удалить
                  </button>
                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="text-blue-500 hover:underline"
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellingTab;
