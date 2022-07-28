const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *          - title
 *          - author
 *       properties:
 *           id:
 *             type: string
 *             description: The auto-generated id of the book
 *           title:
 *             type: string
 *             description: The book title
 *           author:
 *              type: string
 *              description: The book author
 *       example:
 *           id: e4rW_ajU
 *           title: Tips of a great Software Engineer
 *           author: Wesly S. Jefferson
 */

// Create a tag
/**
 * @swagger
 * tags:
 *    name: Books
 *    description: The books managing API
 */

// Routes

/**
 * @swagger
 * /books:
 *    get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Book'
 */

router.get("/", (req, res) => {
  const books = req.app.db.get("books");
  res.send(books);
});

/**
 * @swagger
 * /books/{id}:
 *    get:
 *      summary: Get the book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: The book id
 *      responses:
 *        200:
 *          description: The book description by id
 *          contents:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Book'
 *        404:
 *           description: The book was not found
 */

router.get("/:id", (req, res) => {
  const book = req.app.db.get("books").find({ id: req.params.id }).value();
  if (!book) res.sendStatus(404);

  res.send(book);
});

router.post("/", (req, res) => {
  try {
    const book = {
      id: nanoid(idLength),
      ...req.body,
    };
    req.app.db.get("books").push(book).write();
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put("/:id", (req, res) => {
  try {
    req.app.db
      .get("books")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();
    res.send(req.app.db.get("books").find({ id: req.params.id }));
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/:id", (req, res) => {
  req.app.db.get("books").remove({ id: req.params.id }).write();
  res.sendStatus(200);
});

module.exports = router;
