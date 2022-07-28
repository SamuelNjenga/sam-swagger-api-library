const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const booksRouter = require("./routes/books");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");

const db = low(adapter);

db.defaults({ books: [] }).write();

const app = express();
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect router to the app
app.use("/books", booksRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
