const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* -------------------- Registration -------------------- */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

/* -------------------- Synchronous routes (Tasks 1–4) -------------------- */
// Get the book list
public_users.get('/', (req, res) => {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) return res.status(200).send(JSON.stringify(book, null, 4));
  return res.status(404).json({ message: "Book not found!" });
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  const matches = Object.entries(books)
    .filter(([_, book]) => book.author && book.author.toLowerCase() === authorParam)
    .map(([isbn, book]) => ({ isbn, ...book }));
  if (matches.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }
  return res.status(200).send(JSON.stringify(matches, null, 4));
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  const matches = Object.entries(books)
    .filter(([_, book]) => book.title && book.title.toLowerCase() === titleParam)
    .map(([isbn, book]) => ({ isbn, ...book }));
  if (matches.length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }
  return res.status(200).send(JSON.stringify(matches, null, 4));
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found!" });
  return res.status(200).send(JSON.stringify(book.reviews || {}, null, 4));
});

/* -------------------- Axios-based routes (Tasks 10–12) -------------------- */
// Async/Await: get book list (wraps '/')
public_users.get('/async/books', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}/`;
    const { data } = await axios.get(url);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// Promise: get book list
public_users.get('/promise/books', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/`;
  axios.get(url)
    .then(r => res.status(200).send(JSON.stringify(r.data, null, 4)))
    .catch(err => res.status(500).json({ message: 'Error fetching books', error: err.message }));
});

// Async/Await: get book by ISBN (wraps '/isbn/:isbn')
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const url = `${req.protocol}://${req.get('host')}/isbn/${encodeURIComponent(isbn)}`;
    const { data } = await axios.get(url);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    return res.status(404).json({ message: "Book not found!", error: err.message });
  }
});

// Promise: get book by ISBN
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const url = `${req.protocol}://${req.get('host')}/isbn/${encodeURIComponent(isbn)}`;
  axios.get(url)
    .then(r => res.status(200).send(JSON.stringify(r.data, null, 4)))
    .catch(() => res.status(404).json({ message: "Book not found!" }));
});

// Async/Await: get books by author (wraps '/author/:author')
public_users.get('/async/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const url = `${req.protocol}://${req.get('host')}/author/${encodeURIComponent(author)}`;
    const { data } = await axios.get(url);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Promise: get books by author
public_users.get('/promise/author/:author', (req, res) => {
  const { author } = req.params;
  const url = `${req.protocol}://${req.get('host')}/author/${encodeURIComponent(author)}`;
  axios.get(url)
    .then(r => res.status(200).send(JSON.stringify(r.data, null, 4)))
    .catch(() => res.status(404).json({ message: "No books found for this author" }));
});

// Async/Await: get books by title (wraps '/title/:title')
public_users.get('/async/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
      const url = `${req.protocol}://${req.get('host')}/title/${encodeURIComponent(title)}`;
      const { data } = await axios.get(url);
      return res.status(200).send(JSON.stringify(data, null, 4));
    } catch {
      return res.status(404).json({ message: "No books found for this title" });
    }
  });
  
  // Promise: get books by title
  public_users.get('/promise/title/:title', (req, res) => {
    const { title } = req.params;
    const url = `${req.protocol}://${req.get('host')}/title/${encodeURIComponent(title)}`;
    axios.get(url)
      .then(r => res.status(200).send(JSON.stringify(r.data, null, 4)))
      .catch(() => res.status(404).json({ message: "No books found for this title" }));
  });

  
module.exports.general = public_users;
