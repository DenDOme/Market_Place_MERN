import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../stores/slices/productSlice";
import { fetchReviews, createReview } from "../../stores/slices/reviewSlice";
import { useParams } from "react-router-dom";
import {
  createFavourite,
  deleteFavourite,
  fetchFavourites,
} from "../../stores/slices/favouriteSlice";
import { addItemToCart } from "../../stores/slices/cartSlice";
import heartHollowIcon from "../../assets/images/heart-hollow.svg";
import heartFullIcon from "../../assets/images/heart-full.svg";
import arrowIcon from "../../assets/images/arrow.svg";
import starIcon from "../../assets/images/star.svg";
import messageIcon from "../../assets/images/message.svg";
import sortIcon from "../../assets/images/sort.svg";

const ProductDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const { productDetails, loading: productLoading } = useSelector(
    (state) => state.products
  );
  const { reviews, loading: reviewsLoading } = useSelector(
    (state) => state.reviews
  );
  const favourites = useSelector((state) => state.favourites.favourites);

  const { productId } = useParams();

  const [isFavorite, setIsFavorite] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduct(productId));
    dispatch(fetchFavourites());
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetails?.images?.length > 0) {
      setSelectedImage(productDetails.images[0]);
    }
  }, [productDetails]);

  const handleAddToCart = () => {
    dispatch(addItemToCart(productId));
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((prevState) => !prevState);
    const favourite = favourites.find((fav) => fav.productId === productId);
    if (favourite) {
      dispatch(deleteFavourite(favourite._id));
    } else {
      dispatch(createFavourite({ productId }));
    }
  };

  const handleImageChange = (direction) => {
    const images = productDetails.images || [];
    let newIndex = currentImageIndex;
    if (direction === "up") {
      newIndex = (currentImageIndex - 1 + images.length) % images.length;
    } else if (direction === "down") {
      newIndex = (currentImageIndex + 1) % images.length;
    }
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const reviewStats = reviews.reduce(
    (acc, review) => {
      acc[review.rating - 1]++;
      return acc;
    },
    [0, 0, 0, 0, 0]
  );

  return (
    <div className="container min-h-[calc(100vh-64px-75px)] mx-auto">
      <div className="flex min-h-[calc(100vh-64px-75px)] flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Images */}
          <div className="flex gap-8">
            <div className="flex flex-col items-center justify-between mr-4">
              <button
                onClick={() => handleImageChange("up")}
                className="p-1 hover:bg-gray-300"
              >
                <img src={arrowIcon} alt="" />
              </button>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] py-2">
                {productDetails?.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    onClick={() => {
                      setSelectedImage(img);
                      setCurrentImageIndex(index);
                    }}
                    className={`w-12 h-12 md:w-20 md:h-20 object-cover cursor-pointer rounded-xl ${
                      selectedImage === img ? "ring-2 ring-dark" : ""
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => handleImageChange("down")}
                className="p-1 hover:bg-gray-300"
              >
                <img src={arrowIcon} className="transform rotate-180" alt="" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-200 rounded-2xl max-w-[430px] min-h-[430px]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-[430px] max-w-[430px] object-contain rounded-xl"
                />
              ) : (
                <div className="text-gray-500">No Image Available</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="relative bg-dark text-white p-6 rounded-2xl min-h-[430px] flex flex-col justify-between">
            {productLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-700 w-1/2 rounded"></div>
                <div className="h-4 bg-gray-700 w-full rounded"></div>
              </div>
            ) : (
              <>
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {productDetails?.name}
                  </h1>
                  <div className="flex items-center gap-4 text-lg mb-4">
                    <span className="text-blue-400 font-bold text-xl">
                      ${productDetails?.price}
                    </span>
                    <span className="text-sm text-gray-300">
                      В наличии {productDetails?.stock}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-300 max-h-[250px] overflow-y-auto">
                    {productDetails?.description}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Добавить в корзину
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className="text-yellow-400 p-2 rounded-lg"
                  >
                    <img
                      src={isFavorite ? heartFullIcon : heartHollowIcon}
                      alt="Favorite"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex bg-dark rounded-tl-2xl text-white rounded-tr-2xl gap-4 mt-8 flex-col md:flex-row ">
          <div className="reviewList w-full md:w-2/3 bg-light-gray p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Отзывы о продукте</h2>
            {reviewsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-700 w-1/2 rounded"></div>
                <div className="h-4 bg-gray-700 w-full rounded"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-400">Пока нет отзывов.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="review p-4 mb-4 border rounded-lg bg-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{user?.fullName}</h3>
                    <span className="text-yellow-500 flex gap-1">
                      {review.rating} <img src={starIcon} alt="" />
                    </span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))
            )}

            {/* Add Review */}
            {/* <form onSubmit={handleReviewSubmit} className="mt-6">
            <h3 className="text-lg font-bold mb-2">Оставить отзыв</h3>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="mb-2 p-2 border rounded w-full"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} звезда
                </option>
              ))}
            </select>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Ваш комментарий"
              className="mb-2 p-2 border rounded w-full"
              rows={4}
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded"
            >
              Отправить отзыв
            </button>
          </form> */}
          </div>

          <div className="w-full md:w-1/3 bg-light-gray p-4 rounded-lg mt-8">
            <div className="flex justify-between mb-4">
              <div className="flex gap-4 ">
                <p>Сортировать по: </p>
                <button className="">
                  <img src={sortIcon} alt="" />
                </button>
              </div>
              <div className="flex gap-5">
                <div className="flex gap-2">
                  <img src={starIcon} alt="" />
                  <p className=""></p>
                </div>
                <div className="flex gap-2">
                  <img src={messageIcon} alt="" />
                  <p className=""></p>
                </div>
              </div>
            </div>
            <div className="reviewDetails">
              <ul>
                <li className="flex justify-between">
                  <div className="flex gap-2">
                    <img src={starIcon} alt="" />
                    <span>1</span>
                  </div>
                  {reviewStats[0]}
                </li>
                <li className="flex justify-between">
                  <div className="flex gap-2">
                    <img src={starIcon} alt="" />
                    <span>2</span>
                  </div>
                  {reviewStats[1]}
                </li>
                <li className="flex justify-between">
                  <div className="flex gap-2">
                    <img src={starIcon} alt="" />
                    <span>3</span>
                  </div>
                  {reviewStats[2]}
                </li>
                <li className="flex justify-between">
                  <div className="flex gap-2">
                    <img src={starIcon} alt="" />
                    <span>4</span>
                  </div>
                  {reviewStats[3]}
                </li>
                <li className="flex justify-between">
                  <div className="flex gap-2">
                    <img src={starIcon} alt="" />
                    <span>5</span>
                  </div>
                  {reviewStats[4]}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
