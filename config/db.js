const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true, // Ensure indexes are created
    });

    console.log("✅ MongoDB Connected");

    // await Product.createIndexes();                                 // when creating new indexes
    // console.log("✅ Indexes built successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
