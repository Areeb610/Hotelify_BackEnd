    const express = require('express');
    const router = express.Router();
    const { connection } = require('../database/db');

    // Route to show rooms details
    router.get('/', (req, res) => {
        connection.query('SELECT * FROM room_details', (error, results, fields) => {
            if (error) {
            res.send({
                "code": 400,
                "failed": "error occurred"
            });
            } else {
            res.send({
                "code": 200,
                "success": "rooms details fetched successfully",
                "data": results
            });
            }
        });
        }
    );

    module.exports = router;

