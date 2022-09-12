const {
  getBooksController,
  getBookByIsbnController,
  createBookController,
  editBookController,
  deleteBookController
} = require("../controllers/books");

const router = require("express").Router();

router.get("/books", getBooksController);
router.get("/books/:isbn", getBookByIsbnController);
router.post("/books", createBookController);
router.put("/books/:isbn", editBookController);
router.delete("/books/:isbn", deleteBookController);

module.exports = router;
