import { useEffect } from "react";
import CategoryTab from "../../components/CategoryTab";
import { fetchProducts } from "../../stores/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import FilterBar from "../../components/FilterBar";
import { ItemCart } from "../../components/ItemCart";

const DetailedSearch = () => {
  const { products, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div>
        <CategoryTab />
      </div>

      <div className="container flex justify-between items-start mt-8 gap-10">
        <FilterBar />
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
          {products.map((item) => {
            return <ItemCart key={item._id} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedSearch;
