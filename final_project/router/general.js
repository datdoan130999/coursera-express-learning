const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
};

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
        return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    // res.send(JSON.stringify({books}, null, 4));
    await res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    await res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const result = keys.filter(key => books[key].author === author).map(key => books[key]);
    if (result.length > 0) {
        await res.status(200).json(result);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const result = keys.filter(key => books[key].title === title).map(key => books[key]);
    if (result.length > 0) {
        await res.status(200).json(result);
    } else {
        res.status(404).json({ message: "No books found by this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;