import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createFavourite,
  deleteFavourite,
} from "../stores/slices/favouriteSlice";
import heartHollowIcon from "../assets/images/heart-hollow.svg";
import heartFullIcon from "../assets/images/heart-full.svg";
import StarIcon from "../assets/images/star.svg";
import { useState } from "react";

export const ItemCart = ({ item }) => {
  const favourites = useSelector((state) => state.favourites.favourites);
  const user = useSelector((state) => state.auth.user);
  const [isFavorite, setIsFavorite] = useState(() =>
    favourites.some((fav) => fav.productId === item._id)
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRedirectDetails = (id) => {
    navigate("/product/details/" + id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();

    setIsFavorite((prevState) => !prevState);

    const favourite = favourites.find((fav) => fav.productId === item._id);

    if (favourite) {
      const favouriteId = favourite._id;
      dispatch(deleteFavourite(favouriteId));
    } else {
      console.log("Creating favorite for product with _id:", item._id);
      dispatch(createFavourite({ productId: item._id }));
    }
  };

  return (
    <div
      className="relative bg-dark text-white border border-gray-300 rounded-lg p-4 shadow-md cursor-pointer"
      onClick={() => handleRedirectDetails(item._id)}
    >
      {user ? (
        <div
          className="absolute top-2 right-2 p-1 cursor-pointer"
          onClick={handleToggleFavorite}
        >
          <img
            src={isFavorite ? heartFullIcon : heartHollowIcon}
            alt="Favorite"
            className="w-6 h-6"
          />
        </div>
      ) : null}

      <img
        src={item.images[0]}
        alt={item.name}
        className="w-full h-40 object-cover rounded-md"
      />

      <h3 className="text-lg font-semibold mt-2 flex justify-between items-center">
        <p className="truncate w-2/4 flex-grow">{item.name}</p>
        <p className="ml-2">{item.price} $</p>
      </h3>

      <p className="text-white font-thin opacity-70 line-clamp-3 h-16 overflow-hidden">
        {item.description}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <span className="flex items-center gap-1 font-bold">
          <img src={StarIcon} alt="" />
          {item.rating}
        </span>
        <span className="text-sm text-gray-500">
          ({item.reviewCount} оценок)
        </span>
      </div>
    </div>
  );
};
