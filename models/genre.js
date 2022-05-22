const mongoose = require("mongoose");
const Book = require("./book");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

genreSchema.pre("remove", function (next) {
  Book.find({ genre: this.id }, (err, genres) => {
    if (err) {
      next(err);
    } else if (genres.length > 0) {
      next(new Error("This genre has books still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Genre", genreSchema);
