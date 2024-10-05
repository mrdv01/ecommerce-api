import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";


// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
    const { product, message, rating } = req.body;
    //1 find product
    const { productId } = req.params;
    const productFound = await Product.findById(productId)?.populate("reviews");;
    if (!productFound) {
        throw new Error("No product Found");
    }
    //check if user already reviewed this product

    const hasReviwed = productFound.reviews.find((review) => {
        return review?.user?.toString() === req.userAuthId.toString()
    })
    if (hasReviwed) {
        throw new Error("user already review the product")
    }
    //create review



    const review = await Review.create({
        user: req.userAuthId,
        product: productFound?._id,
        message,
        rating
    })

    //push review into the product found
    productFound.reviews.push(review?._id);
    //resave
    await productFound.save();

    res.status(201).json({
        success: true,
        msg: "review created successfully",
        review
    })
})

