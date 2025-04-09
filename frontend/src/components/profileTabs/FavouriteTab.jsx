import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavourites } from "../../stores/slices/favouriteSlice";
import { fetchProducts } from "../../stores/slices/productSlice";
import { ItemCart } from "../ItemCart";

const FavouriteTab = () => {
  const {
    favourites,
    loading: favLoading,
    error: favError,
  } = useSelector((state) => state.favourites);

  const {
    products,
    loading: prodLoading,
    error: prodError,
  } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFavourites());
    dispatch(fetchProducts());
  }, [dispatch]);

  const favouriteProductIds = favourites.map((fav) => fav.productId);

  const favouriteProducts = products.filter((product) =>
    favouriteProductIds.includes(product._id)
  );

  const isLoading = favLoading || prodLoading;
  const hasError = favError || prodError;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-dark rounded-tl-2xl rounded-tr-2xl pt-8">
      <div className="w-full bg-dark px-6">
        <h1 className="text-white text-3xl font-bold ml-8 mb-6">Избранное</h1>

        {isLoading && <p className="text-white">Загрузка...</p>}
        {hasError && <p className="text-red-500">Ошибка при загрузке данных</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favouriteProducts.length > 0 ? (
            favouriteProducts.map((product) => (
              <ItemCart key={product._id} item={product} />
            ))
          ) : (
            <p className="text-white">Нет избранных товаров</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavouriteTab;
