import mongoose from "mongoose";
const Schema = mongoose.Schema;

//defining user schema
const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    whishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Whislist"
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    },
    hasShippingAddress: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        firstName: {
            type: String,

        },
        lastName: {
            type: String,

        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        phone: {
            type: String,
        },


    }
}, {
    timestamps: true
});

//compile the schema to model

const User = mongoose.model('User', UserSchema);

export default User;



