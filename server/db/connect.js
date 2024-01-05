const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_SECRETE_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("CONNECTED TO MONGO");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { mongoose, connectToMongo };
