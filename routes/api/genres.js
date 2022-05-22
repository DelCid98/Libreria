const express = require("express");
const router = express.Router();
const Genre = require("../../models/genre");
const Book = require("../../models/book");

// Get Genre method
router.get("/", async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const genres = await Genre.find(searchOptions);
    res.json({
      genres: genres,
      searchOptions: req.query,
    });
  } catch {
    res.json({ status: 500, message: "Error" });
  }
});

// Post Genre method
router.post("/", async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });

  try {
    const newAuthor = await genre.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Genre added" });
    });
  } catch {
    res.json({
      errorMessage: "Something went wrong",
    });
  }
});

// Get Genre by Id method
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    //const books = await Book.find({ genre: genre.id }).limit(6).exec();
    if (!genre) {
      return res.json({ status: 404, message: "Not found" });
    }
    return res.json({
      genre,
      //genre: genre,
      //booksByAuthor: books,
    });
  } catch {
    return res.json({ status: 500, message: "Something went wrong" });
  }
});

// Put genre method
router.put("/:id", async (req, res) => {
  let genre;

  try {
    genre = await Genre.findById(req.params.id);
    genre.name = req.body.name;

    await genre.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Genre updated" });
    });
  } catch {
    if (genre == null) {
      res.json({ status: 404, message: "Genre not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

//Delete Genre method
router.delete("/:id", async (req, res) => {
  let genre;
  try {
    genre = await Genre.findById(req.params.id);
    await genre.remove();
    res.json({ status: 200, message: "Genre deleted" });
  } catch {
    if (genre == null) {
      res.json({ status: 404, message: "Genre not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

module.exports = router;
