import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js"


import asyncHandler from "express-async-handler";

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {


    const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;
    const convertedImgs = req.files.map((file) => file?.path);
    // check product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("product already existed")
    }
    //find the brand
    const brandFound = await Brand.findOne({
        name: brand?.toLowerCase(),
    });

    if (!brandFound) {
        throw new Error(
            "Brand not found, please create brand first or check brand name"
        );
    }
    //find the category
    const categoryFound = await Category.findOne({
        name: category.toLowerCase()
    });
    if (!categoryFound) {
        throw new Error("Category not found, please check category name or create category first")
    }
    // create product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
        images: convertedImgs

    })
    //push product into category
    categoryFound.products.push(product._id);
    //resave
    await categoryFound.save();
    //push product into brand
    brandFound.products.push(product._id);
    await brandFound.save();
    //send response
    res.json({
        status: "success",
        message: "product created successfully",
        product,
    })
})

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

export const getProductsCtrl = asyncHandler(async (req, res) => {
    //Initialize a Query:
    //start with a query that selects all products.
    //This query can be modified before being executed (e.g., adding a name filter if needed).
    let productQuery = Product.find();
    //search by name
    if (req.query.name) {
        //modifing query
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i" }
        });
    }
    //filter by name
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" }
        })
    }
    //filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: "i" }
        })
    }
    //filter by sizes
    if (req.query.sizes) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.sizes, $options: "i" }
        })
    }
    //filter by colors
    if (req.query.colors) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.colors, $options: "i" }
        })
    }
    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] }
        })
    }

    //pageination
    //page 
    const page = req.query.page ? parseInt(req.query.page) : 1;
    //limit
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    //startIdx
    const startIdx = (page - 1) * limit;
    //lastIdx
    const lastIdx = limit * page;
    //total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIdx).limit(limit);

    //pagination result
    const pagination = {};
    if (lastIdx < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }

    if (startIdx > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    };

    //Execute the Query
    const products = await productQuery.find().populate("reviews");
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "products fetched successfully",
        products

    })
})

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public

export const getSingleProductCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate("reviews");
    if (!product) {
        throw new Error("product not found")
    }
    else {
        res.json({
            status: "success",
            message: "product fetch successfully",
            product
        })
    }
})

// @desc    update  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
    const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name, description, category, sizes, colors, price, totalQty, brand
    }, {
        new: true
    })
    res.json({
        status: "success",
        message: "product updated successfully",
        product
    })

})

// @desc    delete  product
// @route   DELETE /api/products/:id/delete
// @access  Private/Admin

export const deleteProductCtrl = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
})
