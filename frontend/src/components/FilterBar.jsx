import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilterProducts } from "../stores/slices/productSlice";
import { fetchCategories } from "../stores/slices/categorySlice";

const FilterBar = () => {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    categoryId: "",
    stock: "",
  });

  const { categories, loading, error } = useSelector(
    (store) => store.categories
  );

  const childCategories = categories.filter((category) => category.parentId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );

    console.log(cleanFilters);

    dispatch(fetchFilterProducts(cleanFilters));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-10 bg-dark text-white rounded mb-4 h-full"
    >
      <label htmlFor="priceMin" className="mb-2">
        Минимальная цена
      </label>
      <input
        id="priceMin"
        name="priceMin"
        type="number"
        placeholder="Мин цена"
        value={filters.priceMin}
        onChange={handleChange}
        className="p-1 mb-4"
      />

      <label htmlFor="priceMax" className="mb-2">
        Максимальная цена
      </label>
      <input
        id="priceMax"
        name="priceMax"
        type="number"
        placeholder="Макс цена"
        value={filters.priceMax}
        onChange={handleChange}
        className="p-1 mb-4"
      />

      {loading && <p>Loading categories...</p>}

      <label htmlFor="categoryId" className="mb-2">
        Категория
      </label>
      <select
        id="categoryId"
        name="categoryId"
        value={filters.categoryId}
        onChange={handleChange}
        className="p-1 mb-4 text-black"
      >
        <option value="">Все категории</option>
        {childCategories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="stock" className="mb-2">
        Количество в наличии
      </label>
      <input
        id="stock"
        name="stock"
        type="number"
        placeholder="Число в наличии"
        value={filters.stock}
        onChange={handleChange}
        className="p-1 mb-4"
      />

      <button
        type="submit"
        className={`block w-full mt-5 mx-auto p-2 rounded font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-primary"
        }`}
        disabled={loading}
      >
        {loading ? "Загрузка..." : "Применить"}
      </button>
    </form>
  );
};

export default FilterBar;
