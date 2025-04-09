import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../stores/slices/categorySlice";

const CategoryTab = () => {
  const { categories } = useSelector((state) => state.categories);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const parentCategories = categories.filter((category) => !category.parentId);

  return (
    <div className="bg-dark p-1">
      <div className="container w-full ">
        <ul className="flex justify-between  text-white">
          {parentCategories.map((category) => (
            <li key={category._id} className="cursor-pointer">
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryTab;
