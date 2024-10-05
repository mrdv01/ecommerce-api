import express from 'express'
import dbConnect from '../config/dbConnect.js';
import dotenv from 'dotenv'
import userRoutes from '../routes/userRoute.js';
import { globalErrorHandler, notFound } from '../middlewares/globalErrorHandler.js';
import productsRouter from '../routes/productRoute.js';

import categoriesRouter from '../routes/categoryRoute.js';
import brandsRouter from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewsRouter from '../routes/reviewsRouter.js';
import orderRouter from '../routes/orderRouter.js';
import Stripe from "stripe";
import Order from '../model/Order.js';
import couponRouter from '../routes/couponRouter.js';
Order
dotenv.config();

dbConnect();
const app = express();
//stripe webhook

const stripe = new Stripe(process.env.STRIPE_KEY);

const endpointSecret = 'whsec_029113306f4c16c92b2e6c42d5ea8f22810525364b9f8bf9f8fd7c9394ffaeec';

// This example uses Express to receive webhooks


// Match the raw body to content type application/json
app.post('/webhooks', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {


        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {


        response.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
        //update order
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;
        //update order
        const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
            totalPrice: totalAmount / 100,
            currency,
            paymentMethod,
            paymentStatus,
        }, {
            new: true,
        })
        console.log(order);

    }
    else {
        return;
    }
    // Handle the event
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntent = event.data.object;
    //         console.log('PaymentIntent was successful!');
    //         break;
    //     case 'payment_method.attached':
    //         const paymentMethod = event.data.object;
    //         console.log('PaymentMethod was attached to a Customer!');
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
});
//pass incoming data
app.use(express.json())


//routes
app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/products/', productsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/brands', brandsRouter);
app.use('/api/v1/colors', colorRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/coupons', couponRouter);







//error handler
app.use(notFound)
app.use(globalErrorHandler);

export default app;

