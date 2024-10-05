import exppress from "express";


import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandsCtrl, getSingleBrandCtrl, updateBrandCtrl } from "../controllers/brandsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandsRouter = exppress.Router();

brandsRouter.post('/', isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get('/', getAllBrandsCtrl);
brandsRouter.get('/:id', getSingleBrandCtrl);
brandsRouter.put('/:id', isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete('/:id', isLoggedIn, isLoggedIn, deleteBrandCtrl);

export default brandsRouter;