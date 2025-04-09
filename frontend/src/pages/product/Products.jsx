import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../stores/slices/productSlice";
import { ItemCart } from "../../components/ItemCart";
import CategoryTab from "../../components/CategoryTab";
import { fetchFavourites } from "../../stores/slices/favouriteSlice";

const Products = () => {
  const { products, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchFavourites());
  }, [dispatch]);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="">
      <div>
        <CategoryTab />
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
        {products.map((item) => {
          return <ItemCart key={item._id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default Products;
