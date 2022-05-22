const express = require("express");
const router = express.Router();
const Book = require("../../models/book");
const Author = require("../../models/author");

// Get Books method
router.get("/", async (req, res) => {
  let searchOptions = {};

  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }

  try {
    const books = await Book.find(searchOptions);
    res.json({
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.json({ status: 500, message: "Error" });
  }
});

// Post Book method
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    stock: req.body.stock,
    publishYear: req.body.publishYear,
    genre: req.body.genre,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newBook = await book.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }

      return res.json({ status: 200, message: "Book added" });
    });
  } catch {
    res.json({
      errorMessage: "Something went wrong",
    });
  }
});

// Get Book by Id method
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();

    if (!book) {
      return res.json({ status: 404, message: "Not found" });
    }
    return res.json({
      book,
      //book:book,
      //searchOptions: req.query,
    });
  } catch {
    return res.json({ status: 500, message: "Something went wrong!" });
  }
});

// Put Book method
router.put("/:id", async (req, res) => {
  let book;

  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.stock = req.body.stock;
    book.publishYear = req.body.publishYear;
    book.genre = req.body.genre;
    book.description = req.body.description;
    book.imageUrl = req.body.imageURL;

    await book.save((err, u) => {
      if (err || !u) {
        return res.status(500).send({
          status: "error",
          err,
        });
      }
      return res.json({ status: 200, message: "Book updated" });
    });
  } catch {
    if (book == null) {
      res.json({ status: 404, message: "Book not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

// Delete Book method
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.json({ status: 200, message: "Book deleted" });
  } catch {
    if (book == null) {
      res.json({ status: 404, message: "Book not found" });
    } else {
      res.json({ status: 500, message: "Something went wrong!" });
    }
  }
});

module.exports = router;
