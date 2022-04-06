const express = require("express");
const router = express.Router();
const Author = require("../../models/author");
const Book = require("../../models/book");

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const authors = await Author.find(searchOptions);
    res.json({
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.json({ status: 500, message: "Error" });
  }
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Author added" });
    });
  } catch {
    res.json({
      errorMessage: "Something went wrong",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    if (!author) {
      res.json({ status: 404, message: "Not found" });
    }
    res.json({
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.json({ status: 500, message: "Something went wrong" });
  }
});

router.put("/:id", async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;

    await author.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Author updated" });
    });
  } catch {
    if (author == null) {
      res.json({ status: 404, message: "Author not found" });
    } else {
      res.json({
        errorMessage: "Something went wrong",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.json({ status: 200, message: "Author deleted" });
  } catch {
    if (author == null) {
      res.json({ status: 404, message: "Author not found" });
    } else {
      res.json({
        errorMessage: "Something went wrong",
      });
    }
  }
});

module.exports = router;
