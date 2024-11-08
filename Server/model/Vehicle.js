const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toHexString() 
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: String, 
        required: true
    },
    description: {  // Fixed the typo from "decription" to "description"
        type: String,
        required: true
    },
    img: {
        type: Map,
        of: String,  // Using Map to store dynamic image URLs as key-value pairs
        required: false
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Vehicles', vehicleSchema);
