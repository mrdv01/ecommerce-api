import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

// @desc    Create new Coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    //check if admin
    //check if coupon already exists

    const coupontExist = await Coupon.findOne({
        code: code.toUpperCase()
    })

    if (coupontExist) {
        throw new Error("Coupon already existed")
    }
    //check if discount is a number
    if (isNaN(discount)) {
        throw new Error("discount must be a number")
    }

    //create a coupon
    const coupon = await Coupon.create({
        code,
        startDate,
        endDate,
        discount,
        user: req.userAuthId

    })

    res.status(201).json({
        status: "success",
        message: "Coupon created successfully",
        coupon,
    })


})

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin

export const getAllCouponCtrl = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.status(200).json({
        status: "success",
        message: "All coupons",
        coupons,
    })
})

// @desc    Get single coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin

export const getCouponCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    res.status(200).json({
        status: "success",
        message: "coupon fetched successfully",
        coupon,

    })
})

export const updateCouponCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { code, startDate, endDate, discount } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(id, {
        code: code?.toUpperCase(), startDate, endDate, discount
    }, {
        new: true,
    });
    res.status(200).json({
        status: "success",
        message: "coupon updated successfully",
        coupon,

    })
})

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;


    const coupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
        message: "coupon deleted successfully",
        coupon,

    })
})