const userModel = require("../model/user");
const { signUpValidation } = require("../middleware/validation");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
let randomBytesAsync = promisify(crypto.randomBytes);

const transporter = nodemailer.createTransport({
    host: process.env.ADMIN,
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
        user: process.env.ADMIN,
        pass: process.env.PASS,
        PASS,
    },
});

exports.signUp = async (req, res) => {
    try {
        let data = req.body;
        let error = signUpValidation(data);
        if (error) {
            error = error.details[0].message;
            return res.status(422).json({ status: false, error });
        }
        const User = await userModel.findOne({ email: data.email });
        if (User) {
            return res
                .status(400)
                .json({ status: true, msg: "email already exist " });
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        data.password = hashedPassword;
        const user = await userModel.create(data);

        const buffer = await randomBytesAsync(32);
        let token = buffer.toString("hex");
        let tokenExpiration = Date.now() + 3600000; // 1 hour
        // console.log(token);
        user.token = token;
        user.tokenExpiration = tokenExpiration;
        user.cart.items = [];

        await transporter.sendMail({
            from: process.env.ADMIN,
            to: data.email,
            subject: "verify email Address",
            html: `
                <p>Click this <a href="http://localhost:2000/user/verify/${user.token}">link </a> to verify your account</p>
                `,
        });
        await user.save();
        res.status(201).json({
            status: true,
            msg: "An email sent to your email account, please verify",
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};
// 0 1 2 3 4 5 6 7 8 9 A B C D E F
exports.verifyAccount = async (req, res, next) => {
    try {
        const token = req.params.token;
        const user = await userModel.findOne({
            token: token,
            tokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
            await userModel.findOneAndDelete({ token: token });
            return res.status(400).json({
                status: false,
                msg: "Link expired, please signup again ",
            });
        }
        user.isVerified = true;
        user.token = null;
        user.tokenExpiration = undefined;
        await user.save();
        res.status(200).json({
            status: true,
            msg: "account verified you can login now",
        });
        next();
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};
exports.login = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(422)
                .json({ status: false, msg: "email and password is required" });
        }
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                status: false,
                msg: "No account found with that email, please signup",
            });
        }
        const matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) {
            return res
                .status(400)
                .json({ status: false, msg: "Email or Password is wrong" });
        }
        if (!user.isVerified) {
            return res
                .status(400)
                .json({ status: false, msg: "Account is not verified" });
        }
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        );
        res.status(200).json({
            status: true,
            msg: "Logged-In Successfully",
            user,
            token,
        });
        next();
    } catch (error) {
        res.status(500).json({ status: false, msg: error });
    }
};
