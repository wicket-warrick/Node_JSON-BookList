const fs = require("fs").promises;
const getBooks = async () => {
  const books = await fs.readFile("./src/books.json", "utf-8");
  return JSON.parse(books);
};

module.exports = { getBooks };
