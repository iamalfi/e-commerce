const jwt = require("jsonwebtoken");

exports.Authentication = async (req, res, next) => {
    let bearerToken = req.headers("Authorization");
    if (!bearerToken) {
        return res.status(400).json({ status: false, msg: "token is missing" });
    }
    // 'Bearer ynrvhlfkl'
    try {
        let token = bearerToken.split(" ")[1];
        const decodedToken = jwt.verify(
            token,
            "fhkjln5vynvvvvhnhnv584p757658ftjy57t8fytn8o"
        );
        if (!decodedToken) {
            return res
                .status(400)
                .json({ status: false, msg: "invalid token" });
        }
        req.decodedToken = decodedToken;
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }

    next();
};
exports.Authorization = (req, res, next) => {
    let email = req.decodedToken.email;
    if (email != "zaidialfiya415@gmail.com") {
        return res
            .status(401)
            .json({ status: false, message: "Access Denied" });
    }
    next();
};
