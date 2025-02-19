import UserAction from "../models/userAction.model.js";
import Favourite from "../models/favourite.model.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const getRecommendedProducts = async (userId) => {
  try {
    console.log("userId is: ", userId);

    // Fetch user actions
    const userActions = await UserAction.find({ userId });
    console.log("User Actions:", userActions);

    if (!userActions.length) {
      console.log("No user actions found.");
      return [];
    }

    // Extract category IDs
    const clickedCategories = userActions.map((action) =>
      action.categoryId.toString()
    );
    console.log("Clicked categories:", clickedCategories);

    // Get favorite and reviewed products
    const favoriteProducts = await Favourite.find({ userId }).distinct(
      "productId"
    );
    const reviewedProducts = await Review.find({ userId }).distinct(
      "productId"
    );
    console.log("Favorite Products:", favoriteProducts);
    console.log("Reviewed Products:", reviewedProducts);

    // Combine interacted products
    const interactedProducts = [
      ...new Set([...favoriteProducts, ...reviewedProducts]),
    ].map((id) => id.toString());
    console.log("Interacted Products:", interactedProducts);

    // MongoDB Aggregation Pipeline
    const recommendations = await Product.aggregate([
      // Stage 1: Match products in clicked categories and exclude interacted products
      {
        $match: {
          categoryId: { $in: clickedCategories },
          _id: { $nin: interactedProducts },
        },
      },
      // Stage 2: Add fields for scoring
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
      // Stage 3: Calculate weighted score
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
      // Stage 4: Sort by weighted score (descending)
      { $sort: { weightedScore: -1 } },
      // Stage 5: Limit to 20 products
      { $sample: { size: 20 } },
    ]);

    // Fallback: If no recommendations, get popular products
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
