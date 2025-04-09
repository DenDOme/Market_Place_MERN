import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProduct, updateProduct } from "../../stores/slices/productSlice";
import { fetchCategories } from "../../stores/slices/categorySlice";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetails, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    dispatch(fetchProduct(id));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  const childCategories = categories.filter((category) => category.parentId);

  useEffect(() => {
    if (productDetails) {
      setFormData({
        name: productDetails.name || "",
        price: productDetails.price || "",
        stock: productDetails.stock || "",
        description: productDetails.description || "",
        categoryId: productDetails.categoryId || "",
      });

      if (productDetails.images) {
        const loadedImages = productDetails.images.map((img, idx) => ({
          id: Date.now() + idx,
          base64: img,
          position: idx + 1,
          isOld: true,
        }));
        setImages(loadedImages);
      }
    }
  }, [productDetails]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result;
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + index,
            base64: base64Image,
            position: prev.length + 1,
            isOld: false,
            file,
          },
        ]);
      };
    });
  };

  const handlePositionChange = (id, newPosition) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, position: parseInt(newPosition) } : img
      )
    );
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = new FormData();
    updatedProduct.append("_id", id);
    updatedProduct.append("name", formData.name);
    updatedProduct.append("price", formData.price);
    updatedProduct.append("stock", formData.stock);
    updatedProduct.append("description", formData.description);
    updatedProduct.append("categoryId", formData.categoryId);

    images
      .sort((a, b) => a.position - b.position)
      .forEach((img) => {
        if (!img.isOld && img.file) {
          updatedProduct.append("images[]", img.file);
        }
      });

    dispatch(updateProduct(updatedProduct));
  };

  return (
    <div className="container min-h-[calc(100vh-64px-75px)] flex flex-col justify-center items-center text-white p-8 rounded-lg max-w-5xl mx-auto">
      <div className="bg-dark p-20 rounded-3xl">
        <h1 className="mb-10 font-bold text-white text-3xl">Обновить товар</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Upload */}
          <div>
            <label className="w-full h-56 bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer rounded-md mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-xl">📷</p>
                <p>Добавить фотографию товара</p>
              </div>
            </label>

            {/* Preview and Position Controls */}
            <div className="space-y-2">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={img.base64}
                      alt={`preview-${index}`}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <p className="text-sm">Фотография</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={img.position}
                      onChange={(e) =>
                        handlePositionChange(img.id, e.target.value)
                      }
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      {Array.from(
                        { length: images.length },
                        (_, i) => i + 1
                      ).map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="text-red-500 hover:underline"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Название товара</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Название товара"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Цена</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="Цена"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Количество</label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="Количество"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Описание товара</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Описание"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Категория</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              >
                {childCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-primary px-6 py-2 rounded text-white font-semibold"
            >
              Сохранить изменения
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
