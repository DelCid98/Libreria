const mongoose = require("mongoose");
const BookRegistry = require("./bookregistry");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishYear: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Genre",
  },
});

bookSchema.pre("remove", function (next) {
  BookRegistry.find({ bookregistry: this.id }, (err, bookregistries) => {
    if (err) {
      next(err);
    } else if (bookregistries.length > 0) {
      next(new Error("This book has registries asociated"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Book", bookSchema);
