const express = require("express");
const router = express.Router();
const Rol = require("../../models/rol");
const User = require("../../models/user");

// Get Roles method
router.get("/", async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const roles = await Rol.find(searchOptions);
    res.json({
      roles: roles,
      searchOptions: req.query,
    });
  } catch {
    res.json({ status: 500, message: "Error" });
  }
});

// Post Rol method
router.post("/", async (req, res) => {
  const rol = new Rol({
    name: req.body.name,
  });

  try {
    const newAuthor = await rol.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Rol added" });
    });
  } catch {
    res.json({
      errorMessage: "Something went wrong",
    });
  }
});

// Get Rol by Id method
router.get("/:id", async (req, res) => {
  try {
    const rol = await Rol.findById(req.params.id);
    //const users = await User.find({ rol: rol.id }).limit(6).exec();
    if (!rol) {
      return res.json({ status: 404, message: "Not found" });
    }
    return res.json({
      rol,
      //rol: rol,
      //booksByAuthor: users,
    });
  } catch {
    return res.json({ status: 500, message: "Something went wrong" });
  }
});

// Put rol method
router.put("/:id", async (req, res) => {
  let rol;

  try {
    rol = await Rol.findById(req.params.id);
    rol.name = req.body.name;

    await rol.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Rol updated" });
    });
  } catch {
    if (rol == null) {
      res.json({ status: 404, message: "Rol not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

//Delete Rol method
router.delete("/:id", async (req, res) => {
  let rol;
  try {
    rol = await Rol.findById(req.params.id);
    await rol.remove();
    res.json({ status: 200, message: "Rol deleted" });
  } catch {
    if (rol == null) {
      res.json({ status: 404, message: "Rol not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

module.exports = router;
