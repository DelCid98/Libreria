const mongoose = require("mongoose");

const bookRegistrySchema = new mongoose.Schema({
  dateCheckout: {
    type: Date,
    required: true,
  },
  dateReturn: {
    type: Date,
  },
  Returned: {
    type: Boolean,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Book",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("BookRegistry", bookRegistrySchema);
