const mongoose = require("mongoose");
const BookRegistry = require("./bookregistry");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Rol",
  },
});

userSchema.pre("remove", function (next) {
  BookRegistry.find({ bookregistry: this.id }, (err, bookregistries) => {
    if (err) {
      next(err);
    } else if (bookregistries.length > 0) {
      next(new Error("This user has registries asociated"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("User", userSchema);
