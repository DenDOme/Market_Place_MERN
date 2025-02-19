import UserAction from "../models/userAction.model.js";
import Favourite from "../models/favourite.model.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const getRecommendedProducts = async (userId) => {
  try {
    const clickedCategories = await UserAction.distinct("categoryId", {
      userId,
    });
    const favoriteProducts = await Favourite.distinct("productId", { userId });
    const reviewedProducts = await Review.distinct("productId", { userId });

    const recommendations = await Product.aggregate([
      {
        $match: {
          categoryId: { $in: clickedCategories },
          _id: { $nin: [...favoriteProducts, ...reviewedProducts] },
        },
      },
      {
        $addFields: {
          clickScore: {
            $cond: [{ $in: ["$categoryId", clickedCategories] }, 1, 0],
          },
          favoriteScore: { $cond: [{ $in: ["$_id", favoriteProducts] }, 1, 0] },
          ratingScore: { $cond: [{ $in: ["$_id", reviewedProducts] }, 1, 0] },
        },
      },
      {
        $addFields: {
          weightedScore: {
            $add: [
              { $multiply: ["$clickScore", 0.2] },
              { $multiply: ["$favoriteScore", 0.3] },
              { $multiply: ["$ratingScore", 0.5] },
            ],
          },
        },
      },
      { $sort: { weightedScore: -1 } },
      { $limit: 20 },
    ]);

    return recommendations;
  } catch (error) {
    console.error(
      "Error getRecommendedProducts | userProductRecommend middleware",
      error
    );
    throw new Error("getRecommendedProducts error");
  }
};
