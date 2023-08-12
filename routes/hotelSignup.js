const express = require('express');
const router = express.Router();
const { connection } = require('../database/db');

// Route to handle hotel login
router.post('/', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  const values = [email, password];
  connection.query(query, values, (error, results, fields) => {
    console.log(results);
    if (error) {
      res.send({
        "code": 400,
        "failed": "error occurred"
      });
    } else {
      res.send({
        "code": 200,
        "success": "signup successful"
      });
    }
    });
  }
);
  

router.get('/', (req, res) => {
  res.send('Welcome to the hotel signup pagse!');
});

module.exports = router;
