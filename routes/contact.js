const express = require('express');
const router = express.Router();
const { connection } = require('../database/db');

router.get('/', (req, res) => {
    connection.query('SELECT * FROM Contacts', (error, results, fields) => {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error occurred"
            });
        } else {
            res.send({
                "code": 200,
                "success": "contacts details fetched successfully",
                "data": results
            });
        }
    });
});

router.post('/',  (req, res) => {
    const { name, email, message } = req.body;
    console.log(req.body);
    const query = 'INSERT INTO Contacts (name, email, message) VALUES (?, ?, ?)';
    const values = [name, email, message];
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
                "success": "contact added successfully",
                "data": results
            });
        }
    });
});

module.exports = router;