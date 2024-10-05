import express from 'express'
import { createCouponCtrl, deleteCouponCtrl, getAllCouponCtrl, getCouponCtrl, updateCouponCtrl } from '../controllers/couponsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const couponRouter = express.Router();

couponRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
couponRouter.get("/", getAllCouponCtrl);
couponRouter.get("/:id", getCouponCtrl);
couponRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);


export default couponRouter;