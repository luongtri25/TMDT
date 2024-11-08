const mongoose = require('mongoose');

const uri = "mongodb+srv://bompro:1234567ab@cluster0.qzsyn.mongodb.net/Honda?retryWrites=true&w=majority&appName=Cluster0"; // Specify the database name in the URI

const connectToDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (e) {
        console.error("Failed to connect to MongoDB", e);
        throw e; // Rethrow the error for handling in the calling function
    }
};

module.exports = connectToDB;
