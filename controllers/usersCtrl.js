import User from "../model/User.js"
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import Order from "../model/Order.js";



export const registerUserCtrl = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    //check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        //throw user already exists
        throw new Error("User already exists");

    }
    //hash password
    //gen salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create user
    const user = await User.create({
        fullname, email, password: hashedPassword
    });
    res.status(201).json({
        status: "success",
        message: "user created successfully",
        data: user
    })
})

export const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound && await bcrypt.compare(password, userFound?.password)) {
        res.json({
            status: 'success',
            message: 'user logged in successfully',
            userFound,
            token: generateToken(userFound?._id)
        })
    }
    else {
        throw new Error("invalid login details")
    }

})

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userAuthId).populate('orders');
    res.json({
        success: true,
        message: "User fetched successfully",
        user,
    })


})

export const updateShippingAddressctrl = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
    } = req.body;
    const user = await User.findByIdAndUpdate(
        req.userAuthId,
        {
            shippingAddress: {
                firstName,
                lastName,
                address,
                city,
                postalCode,
                province,
                phone,
                country,
            },
            hasShippingAddress: true,
        },
        {
            new: true,
        }
    );
    //send response
    res.json({
        status: "success",
        message: "User shipping address updated successfully",
        user,
    });
});