import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
import Coupon from "../model/Coupon.js";


dotenv.config();

//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
    // get the coupon
    const { coupon } = req?.query;

    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase()
    })

    if (couponFound?.isExpired) {
        throw new Error("coupon has expired")
    }

    if (!couponFound) {
        throw new Error("invalid coupon");

    }

    //get discont

    const discount = couponFound?.discount / 100;


    //get the payload(customer,orderItem,totalPrice,shippingAddress)
    const { orderItems, shippingAddress, totalPrice } = req.body;
    //find the user
    const user = await User.findById(req.userAuthId);
    //Check if user has shipping address
    if (!user?.hasShippingAddress) {
        throw new Error("Please provide shipping address");
    }
    //check if order is not empty
    if (orderItems?.length <= 0) {
        throw new Error("No Order Items ")
    }


    //place/create order -- save into db
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,

    });

    console.log(order);
    //update product qty
    const products = await Product.find({ _id: { $in: orderItems } })
    orderItems?.map(async (order) => {
        const product = products.find((product) => {
            return product?._id.toString() === order?._id.toString();
        })
        if (product) {
            product.totalSold += order.qty;
        }
        await product.save();

    })
    //push order into user
    user.orders.push(order?._id);
    await user.save();
    // make payment(stripe)
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "hats",
                        description: "best hat"
                    },
                    unit_amount: 1000 * 100
                },
                quantity: 2,

            }
        ],
        metadata: {
            orderId: JSON.stringify(order?._id)
        },
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });
    res.send({ url: session.url });
    //payment webhook
    //update the user order

    // res.json({
    //     success: true,
    //     message: "order Created",
    //     order,
    //     user,
    // })
})


//@desc getAllOrders
//@route POST /api/v1/orders
//@access private

export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.json({
        success: true,
        message: "orders fetched successfully",
        orders,
    })
})

//@desc get single order
//@route POST /api/v1/orders/:id
//@access private

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        order,
    })
})

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    //update
    const updatedOrder = await Order.findByIdAndUpdate(id, {
        status: status,
    }, {
        new: true,
    });

    res.status(200).json({
        success: true,
        message: "order updated successfully",
        updatedOrder,
    })



})

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
    //get order stats
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                minimumSale: {
                    $min: "$totalPrice",
                },
                totalSales: {
                    $sum: "$totalPrice",
                },
                maxSale: {
                    $max: "$totalPrice",
                },
                avgSale: {
                    $avg: "$totalPrice",
                },
            },
        },
    ]);
    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
    //send response
    res.status(200).json({
        success: true,
        message: "Sum of orders",
        orders,
        saleToday,
    });
});

