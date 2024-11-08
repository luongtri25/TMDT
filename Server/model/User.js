const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa User schema
const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toHexString()
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true, // Email bắt buộc
        unique: true,   // Email không được trùng lặp
        trim: true,
        lowercase: true // Tự động chuyển email về chữ thường
    },
    password: {
        type: String,
        required: true, // Mật khẩu bắt buộc
        minlength: 6    // Mật khẩu phải ít nhất 6 ký tự
    }

});

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
