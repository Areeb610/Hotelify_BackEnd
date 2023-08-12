const express = require('express');
const router = express.Router();
const { connection } = require('../database/db');

router.post('/', (req, res) => {
    const { id, status, room_id } = req.body;
    console.log(id, status);

    // Update booking status
    connection.query('UPDATE room_bookings SET status = ? WHERE booking_id = ?', [status, id], (error1, results1, fields1) => {
        if (error1) {
            res.status(400).json({
                "code": 400,
                "failed": "Error updating booking status"
            });
        } else {
            // Update room status based on roomId
            connection.query('UPDATE room_details SET status = ? WHERE id = ?', [status, room_id], (error2, results2, fields2) => {
                if (error2) {
                    res.status(400).json({
                        "code": 400,
                        "failed": "Error updating room status"
                    });
                } else {
                    res.status(200).json({
                        "code": 200,
                        "success": "Booking and room status updated successfully"
                    });
                }
            });
        }
    });
});


router.get('/', (req, res) => {
    query = 'SELECT * FROM room_bookings';
    connection.query(query, (error, results, fields) => {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error occurred"
            });

        } else {
            res.send({
                "code": 200,
                "success": "booking details fetched successfully",
                "data": results
            });
        }
    });
});


module.exports = router;
