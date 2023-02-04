const mongoose = require("mongoose");
//name,email,password,isVerified,token,tokenExpiration

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        token: String,
        tokenExpiration: Date,
        cart: {
            items: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "product",
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    },

    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
