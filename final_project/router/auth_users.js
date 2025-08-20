const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// true if the username is AVAILABLE (i.e., not already taken)
const isValid = (username) => {
  if (typeof username !== 'string' || username.trim() === '') return false;
  return !users.some(u => u.username === username);
};

// true if a user with this username/password exists
const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
};

//only registered users can login (left for later tasks)
//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body || {};
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken };
  
    return res.status(200).json({ message: "Logged in successfully." });
  });
  

// Add a book review (left for later tasks)
// Add or modify a book review (protected by /customer/auth/* middleware)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const review = req.query.review; // per spec: review comes via query string
    const username = req.user?.username; // set by JWT middleware in index.js
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated." });
    }
    if (!review || review.trim() === "") {
      return res.status(400).json({ message: "Review text is required (?review=...)." });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
  
    if (!book.reviews) book.reviews = {};
  
    const isUpdate = Object.prototype.hasOwnProperty.call(book.reviews, username);
    book.reviews[username] = review.trim();
  
    return res.status(200).json({
      message: isUpdate ? "Review updated." : "Review added.",
      reviews: book.reviews
    });
  });
  
  // Delete your own review for a book (protected)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated." });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review by this user for this book." });
    }
  
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted.", reviews: book.reviews });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
