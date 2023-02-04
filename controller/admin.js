const productModel = require("../model/product");
const { productValidation } = require("../middleware/validation");
const { default: mongoose } = require("mongoose");

exports.createProduct = async (req, res) => {
    try {
        let data = req.body;

        let error = productValidation(data);

        if (error) {
            error = error.details[0].message;
            return res.status(422).json({ status: true, error });
        }
        data.userId = req.decodedToken.userId;
        const product = await productModel.create(data);
        res.status(201).json({
            status: true,
            msg: "created successfully 👍",
            product: product,
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({ status: true, products: products });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};

exports.updateproduct = async (req, res) => {
    try {
        let productId = req.params.productId;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: false,
                msg: "please enter valid product id 😢",
            });
        }

        const product = await productModel.findByIdAndUpdate(
            productId,
            req.body,
            {
                new: true,
            }
        );
        res.status(200).json({
            status: true,
            msg: "updated successfully 👍",
            product: product,
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};
exports.deleteproduct = async (req, res) => {
    try {
        let productId = req.params.productId;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res
                .status(400)
                .json({
                    status: false,
                    msg: "please enter valid product id 😢",
                });
        }

        const product = await productModel.findByIdAndDelete(productId);
        res.status(200).json({
            status: true,
            msg: "deleted successfully 👍",
            product: product,
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};
