const express = require('express');
const router = express.Router();
const { connection } = require('../database/db');

// Route to handle hotel login
router.post('/', (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
    console.log(results);
    if (error) {
      res.send({
        "code": 400,
        "failed": "error occurred"
      });
    } else {
      if (results.length >= 1) {
        const userRole = results[0].isAdmin;
        res.send({
          "code": 200,
          "success": "login successful",
          "isAdmin": userRole === 1
        });
      } else {
        res.send({
          "code": 404,
          "failed": "Email and password do not match"
        });
      }
    }
  });
});

router.get('/', (req, res) => {
  res.send('Welcome to the hotel login page!');
});

module.exports = router;
