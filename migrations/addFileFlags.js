const mongoose = require("mongoose");
const File = require("../models/file");

// Replace with your MongoDB connection string
const MONGO_URI = "mongodb://127.0.0.1:27017/dropbox";

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");

        const result = await File.updateMany(
            {
                $or: [
                    { isTrash: { $exists: false } },
                    { isFavorite: { $exists: false } }
                ]
            },
            {
                $set: {
                    isTrash: false,
                    isFavorite: false
                }
            }
        );

        console.log(`${result.modifiedCount} documents updated`);

        await mongoose.disconnect();

        console.log("Migration completed");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();