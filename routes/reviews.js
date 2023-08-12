const express = require('express');
const router = express.Router();
const { connection } = require('../database/db');

router.get('/', (req, res) => {
    connection.query('SELECT * FROM reviews', (error, results, fields) => {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error occurred"
            });
        } else {
            res.send({
                "code": 200,
                "success": "reviews details fetched successfully",
                "data": results
            });
        }
    });
});

router.post('/',  (req, res) => {
    const { room_number, rating, comment, createdAt } = req.body;
    const query = 'INSERT INTO reviews (room_number, rating, comment) VALUES (?, ?, ?)';
    const values = [room_number, rating, comment];
    console.log(req.body);
    connection.query(query, values, (error, results, fields) => {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error occurred"
            });
        } else {
            res.send({
                "code": 200,
                "success": "review added successfully",
                "data": results
            });
        }
    });
});

module.exports = router;
