import UserAction from "../models/userAction.model.js";
import Favourite from "../models/favourite.model.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const getRecommendedProducts = async (userId) => {
  try {
    console.log("userId is: ", userId);

    const userActions = await UserAction.find({ userId });
    console.log("User Actions:", userActions);

    if (!userActions.length) {
      console.log("No user actions found.");
      return [];
    }

    const clickedCategories = userActions.map((action) =>
      action.categoryId.toString()
    );
    console.log("Clicked categories:", clickedCategories);

    const favoriteProducts = await Favourite.find({ userId }).distinct(
      "productId"
    );
    const reviewedProducts = await Review.find({ userId }).distinct(
      "productId"
    );
    console.log("Favorite Products:", favoriteProducts);
    console.log("Reviewed Products:", reviewedProducts);

    const interactedProducts = [
      ...new Set([...favoriteProducts, ...reviewedProducts]),
    ].map((id) => id.toString());
    console.log("Interacted Products:", interactedProducts);

    const recommendations = await Product.aggregate([
      {
        $match: {
          categoryId: { $in: clickedCategories },
          _id: { $nin: interactedProducts },
        },
      },
      {
        $addFields: {
          clickScore: {
            $cond: [{ $in: ["$categoryId", clickedCategories] }, 1, 0],
          },
          favoriteScore: {
            $cond: [{ $in: ["$_id", favoriteProducts] }, 1, 0],
          },
          ratingScore: {
            $cond: [{ $in: ["$_id", reviewedProducts] }, 1, 0],
          },
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
      { $sample: { size: 20 } },
    ]);

    if (recommendations.length === 0) {
      console.log(
        "No products found in clicked categories. Falling back to popular products."
      );
      const newRecommendations = await Product.aggregate([
        { $sort: { rating: -1 } },
        { $sample: { size: 20 } },
      ]);

      return newRecommendations;
    }

    console.log("Final Recommended Products:", recommendations);
    return recommendations;
  } catch (error) {
    console.error("Error in getRecommendedProducts:", error);
    throw new Error("getRecommendedProducts error");
  }
};
