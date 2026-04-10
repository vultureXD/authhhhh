const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connecToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error(`Database connection error!`, error);
        process.exit(1);
    }
};
module.exports = connecToDB;
