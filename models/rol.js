const mongoose = require("mongoose");
const User = require("./user");

const rolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

rolSchema.pre("remove", function (next) {
  User.find({ rol: this.id }, (err, users) => {
    if (err) {
      next(err);
    } else if (users.length > 0) {
      next(new Error("This rol has users still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Rol", rolSchema);
