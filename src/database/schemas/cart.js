const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  itemID: {
    type: Integer,
    required: true
  },
  item: {
    type: string,
    required: true
  },
  quantity: {
    type: Integer,
    required: true
  }
});

module.exports = mongoose.model('cart', cartSchema);