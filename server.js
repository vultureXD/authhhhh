require("dotenv").config();

const express = require("express");
const connecToDB = require("./database/db.js");

const authRoutes = require("./routes/auth.route.js");
const homeRoutes = require("./routes/home.route.js");
const adminRoutes = require("./routes/admin.route.js");
const uploadImageRoutes = require("./routes/image.route.js");

const PORT = process.env.PORT || 3000;

const app = express();

//connect to db
connecToDB();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
