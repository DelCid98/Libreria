if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");
const userRouter = require("./routes/users");

const authorAPIRouter = require("./routes/api/authors");
const booksAPIRouter = require("./routes/api/books");
const genresAPIRouter = require("./routes/api/genres");
const rolesAPIRouter = require("./routes/api/roles");
const usersAPIRouter = require("./routes/api/users");
const bookregistriesAPIRouter = require("./routes/api/bookregistries");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/users", userRouter);

app.use("/api/authors", authorAPIRouter);
app.use("/api/books", booksAPIRouter);
app.use("/api/genres", genresAPIRouter);
app.use("/api/roles", rolesAPIRouter);
app.use("/api/users", usersAPIRouter);
app.use("/api/library", bookregistriesAPIRouter);

app.listen(process.env.PORT || 3000);
