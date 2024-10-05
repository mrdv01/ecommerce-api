import exppress from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createOrderCtrl, getAllOrdersCtrl, getSingleOrderCtrl, updateOrderCtrl, getOrderStatsCtrl } from "../controllers/orderCtrl.js";

const orderRouter = exppress.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl)
orderRouter.get("/", isLoggedIn, getAllOrdersCtrl)
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);

orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl)
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl)


export default orderRouter;