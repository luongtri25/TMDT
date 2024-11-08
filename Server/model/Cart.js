const mongoose = require('mongoose');
const productInCartSchema = new mongoose.Schema({
  id_product: { type: String, required: true },  // Sử dụng id_product làm khóa chính
  imgProduct: { type: String },
  nameProduct: { type: String },
  number: { type: Number },
  price: { type: Number },
});

const CartSchema = new mongoose.Schema({
  id: { type: String, required: true },
  details: [productInCartSchema],
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;

