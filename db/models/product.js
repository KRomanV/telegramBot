const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  title: String,
  type: String,
  brand: String,
  price: Number,
});

module.exports = model('Product', ProductSchema);
