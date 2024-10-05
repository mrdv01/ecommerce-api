import exppress from "express";


import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";

const reviewsRouter = exppress.Router();

reviewsRouter.post("/:productId", isLoggedIn, createReviewCtrl);



export default reviewsRouter;