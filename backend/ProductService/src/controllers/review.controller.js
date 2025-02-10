import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export const createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const { userId } = req.user;

    try {
        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "All fields must be provided" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const isReviewExists = await Review.findOne({ userId, productId });
        if (isReviewExists) {
            return res.status(409).json({ message: "Review already exists" });
        }

        const newReview = new Review({
            userId,
            productId,
            rating,
            comment,
        });

        await newReview.save();
        res.status(201).json({ message: "Review successfully created" });
    } catch (error) {
        console.error('Error in createReview | review controller', error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteReview = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        if (!id) {
            return res.status(400).json({ message: "Invalid review" });
        }

        const review = await Review.findById(id);
        if (!review || review.userId !== userId) {
            return res.status(404).json({ message: "Review not found or unauthorized" });
        }

        await Review.deleteOne({ _id: id });
        res.status(200).json({ message: "Review successfully deleted" });
    } catch (error) {
        console.error('Error in deleteReview | review controller', error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getReviews = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const reviews = await Review.find({ productId: id });
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error in getReviews | review controller', error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
