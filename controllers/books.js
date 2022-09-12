const { generateError } = require("../helpers/error");
const { getBooks } = require("../helpers/getBooks");
const fs = require("fs").promises;

const getBooksController = async (req, res, next) => {
  try {
    const booksData = await getBooks();
    if (booksData.lenght === 0) {
      throw generateError("File empty", 400);
    }
    res.send({ status: "ok", data: booksData });
  } catch (error) {
    next(error);
  }
};

const getBookByIsbnController = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const booksData = await getBooks();
    const bookData = booksData.find((book) => book.isbn === isbn);
    if (!bookData) {
      throw generateError("Book doesnt exist in the document", 400);
    }
    res.send({
      status: "ok",
      data: bookData,
    });
  } catch (error) {
    next(error);
  }
};

const createBookController = async (req, res, next) => {
  try {
    const {
      title,
      isbn,
      pageCount,
      publishedDate:{$date},
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      authors,
      categories,
    } = req.body;
  
    const booksData = await getBooks();
    const bookExist = booksData.find((book) => book.isbn === isbn);
    if (bookExist) {
      throw generateError("Book just exist in the document", 400);
    }
    const newBook = {
      title,
      isbn,
      pageCount,
      publishedDate:{$date},
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      authors,
      categories,
    };

    await fs.writeFile(
      "./src/books.json",
      JSON.stringify([...booksData, newBook], null, 2)
    );
    res.send({
      status: "ok",
      message: `Create Success`,
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

const editBookController = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const {
      title,
      pageCount,
      publishedDate,
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      authors,
      categories,
    } = req.body;
    const booksData = await getBooks();
    const book = booksData.find((book) => book.isbn === isbn);
    if (!book) {
      throw generateError("Book doesnt exist in the document", 400);
    }
    const updateBookInfo = (info, update) => {
      return update ? update : info;
    };
    const bookIndex = booksData.findIndex((b) => b.isbn === isbn);

    const bookData = booksData[bookIndex];

    bookData.title = updateBookInfo(bookData.title, title);
    bookData.pageCount = updateBookInfo(bookData.pageCount, pageCount);
    bookData.publishedDate = updateBookInfo(
      bookData.publishedDate,
      publishedDate
    );
    bookData.thumbnailUrl = updateBookInfo(bookData.thumbnailUrl, thumbnailUrl);
    bookData.shortDescription = updateBookInfo(
      bookData.shortDescription,
      shortDescription
    );
    bookData.longDescription = updateBookInfo(
      bookData.longDescription,
      longDescription
    );
    bookData.status = updateBookInfo(bookData.status, status);
    bookData.authors = updateBookInfo(bookData.authors, authors);
    bookData.categories = updateBookInfo(bookData.categories, categories);

    await fs.writeFile(
      "./src/books.json",
      JSON.stringify([...booksData], null, 2)
    );

    res.send({
      status: "ok",
      message: `Edit Success`,
      data: bookData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBookController = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const booksData = await getBooks();
    const book = booksData.find((book) => book.isbn === isbn);

    if (!book) {
        throw generateError("Book doesnt exist in the document", 400);
      }
    const bookIndex = booksData.findIndex((b) => b.isbn === isbn);
    booksData.splice(bookIndex, 1);
    await fs.writeFile(
      "./src/books.json",
      JSON.stringify([...booksData], null, 2)
    );
    res.send(book);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooksController,
  getBookByIsbnController,
  createBookController,
  editBookController,
  deleteBookController,
};
