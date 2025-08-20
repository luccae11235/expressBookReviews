const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book){
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({message:"Book not found!"})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorParam = req.params.author.toLowerCase();
  
    // books is an object keyed by "isbn-like" ids
    const matches = Object.entries(books)
      .filter(([_, book]) => book.author && book.author.toLowerCase() === authorParam)
      .map(([isbn, book]) => ({ isbn, ...book }));
  
    if (matches.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
    return res.status(200).send(JSON.stringify(matches, null, 4));
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
