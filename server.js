const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const productRoute = require("./routes/admin");
const customerRoutes = require("./routes/customer");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());
app.use("/user", userRoute);
app.use("/admin", productRoute);
app.use("/customer", customerRoutes);
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.URI, { dbName: "e-commerce" })
    .then((result) => console.log("mongodb connected"))
    .catch((err) => console.log(err));

app.listen(2000, () => {
    console.log("server is running ok"), 2000;
});
