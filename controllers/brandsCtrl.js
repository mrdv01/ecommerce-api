import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private/Admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    //brand exists
    const brandFound = await Brand.findOne({ name });
    if (brandFound) {
        throw new Error("brand already exists");
    }
    //create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,

    });

    res.json({
        status: "success",
        message: "Brand created successfully",
        brand,

    });
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    if (!brands) {
        throw new Error("no brand found")
    }

    res.json({
        status: "success",
        message: "brands fetched successfully",
        brands,
    })
})

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public

export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
        throw new Error("brand not found");
    }

    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    })
})

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //update
    const brand = await Brand.findByIdAndUpdate(
        req.params.id,
        {
            name,
        },
        {
            new: true,
        }
    );
    res.json({
        status: "success",
        message: "Brand updated successfully",
        brand,
    });

})

// @desc    delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
});