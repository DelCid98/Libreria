const express = require("express");
const router = express.Router();
const encrypt = require("crypto");
const User = require("../../models/user");
const Rol = require("../../models/rol");

// Get Users method
router.get("/", async (req, res) => {
  let searchOptions = {};

  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }

  try {
    const users = await User.find(searchOptions);
    res.json({
      users: users,
      searchOptions: req.query,
    });
  } catch {
    res.json({ status: 500, message: "Error" });
  }
});

// Post User method
router.post("/", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: encrypt
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64"),
    rol: req.body.rol,
  });

  try {
    const newBook = await user.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }

      return res.json({ status: 200, message: "User added" });
    });
  } catch {
    res.json({
      errorMessage: "Something went wrong",
    });
  }
});

// Post Login method
router.post("/login", async (req, res) => {
  let searchOptions = { email: req.body.email };

  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }

  try {
    const user = await User.findOne(searchOptions);
    if (!user) {
      return res.status(404).send({ status: "User or password incorrect" });
    }
    if (
      user.password ==
      encrypt.createHash("sha256").update(req.body.password).digest("base64")
    ) {
      return res.json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          rol: user.rol,
        },
        searchOptions: req.query,
      });
    } else {
      return res.status(404).send({ status: "User or password incorrect" });
    }
  } catch {
    res.json({ status: 500, message: "Error" });
  }
});

// Get User by Id method
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("rol").exec();

    if (!user) {
      return res.json({ status: 404, message: "Not found" });
    }
    return res.json({
      user,
      //user:user,
      //searchOptions: req.query,
    });
  } catch {
    return res.json({ status: 500, message: "Something went wrong!" });
  }
});

// Put User method
router.put("/:id", async (req, res) => {
  let user;

  try {
    user = await User.findById(req.params.id);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = encrypt
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64");
    user.rol = req.body.rol;

    await user.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "User updated" });
    });
  } catch {
    if (user == null) {
      res.json({ status: 404, message: "User not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

// Delete User method
router.delete("/:id", async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    await user.remove();
    res.json({ status: 200, message: "User deleted" });
  } catch {
    if (user == null) {
      res.json({ status: 404, message: "User not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

module.exports = router;
