const userModel = require("../model/user");
const productModel = require("../model/product");
const OrderModel = require("../model/order");
// const stripe = require("stripe")(process.env.STRIPE_SK_KEY);
exports.getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({ status: true, products: products });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const productId = req.pamras.productId;
        const product = await productModel.findById(productId);
        res.status(200).json({ status: true, product });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await userModel.findById(req.decodedToken.userId);

        const product = user.cart.items.find((cartProduct) => {
            return cartProduct.productId.toString() == productId.toString();
        });

        if (product != undefined) {
            // if cart already has some products
            product.quantity = product.quantity + 1;
        } else {
            // if there is no product in cart
            user.cart.items.push({
                productId,
                quantity: 1,
            });
        }
        await user.save();
        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};

// items = [{
//     productId: 1,
//     quantity :3
// }, {
//     productId:2,
//     quantity:1
// }];
exports.deleteCart = async (req, res) => {
    try {
        let productId = req.params.productId;
        const user = await userModel.findById(req.decodedToken.userId);
        const cartItems = user.cart.items.filter((product) => {
            return product.productId.toString() != productId.toString();
        });
        user.cart.items = cartItems;
        await user.save();
        res.status(200).json({
            status: true,
            message: "cart deleted successfully 👍",
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};

exports.addToOrder = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.decodedToken.userId)
            .populate("cart.items.productId");
        if (user.cart.items.length == 0) {
            return res.json({ message: "No products found in cart 😢" });
        }
        let products = user.cart.items.map((item) => {
            return {
                quantity: item.quantity,
                product: { ...item.productId._doc },
            };
        });
        const newOrder = new OrderModel({
            user: {
                name: user.name,
                userId: user._id,
            },
            products: products,
        });
        await newOrder.save();
        user.cart.items = [];
        await user.save();
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};
// exports.payment = async (req, res, next) => {
//     const user = await userModel.findById(req.decodedToken.userId);

//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price_data: {
//                     currency: "usd",
//                     product_data: {
//                         name: "T-shirt",
//                     },
//                     unit_amount: 2000,
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: "payment",
//         success_url: "http://localhost:3200/success",
//         cancel_url: "http://localhost:3200/cancel",
//     });
//     res.json(session);
// };
