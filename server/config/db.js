const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const pairing = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${pairing.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectdb;
