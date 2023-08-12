    const express = require('express');
    const router = express.Router();
    const { connection } = require('../database/db');
// ... (other imports and setup)

// Route to handle room bookings
router.post('/', (req, res) => {
    const {
      person_name,
      email,
      contact,
      arrival_datetime,
      departure_datetime,
      num_children,
      num_adults,
      room_id,
    } = req.body;
    const status = 'pending';
  
    
    // First, check if the user exists
    connection.query('SELECT id FROM users WHERE email = ?', [email], (error, userResults) => {
      if (error) {
        console.error('Error fetching user ID:', error);
        res.status(500).json({ "error": "Database error" });
        return;
      }
  
      if (userResults.length === 0) {
        res.status(400).json({ "error": "User not found" });
        return;
      }
  
      const user_id = userResults[0].id;
  
      // Check if the user already has a pending booking
      connection.query('SELECT status FROM room_bookings WHERE user_id = ? AND status = ?', [user_id, 'pending'], (error, bookingResults) => {
        if (error) {
          console.error('Error fetching booking status:', error);
          res.status(500).json({ "error": "Database error" });
          return;
        }
  
        if (bookingResults.length > 0) {
          res.status(400).json({ "error": "Room is already booked and pending for this user" });
          return;
        }
  
        // Insert booking
        connection.query(
          'INSERT INTO room_bookings (user_id, person_name, email, contact, arrival_datetime, departure_datetime, num_children, num_adults, status, room_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [user_id, person_name, email, contact, arrival_datetime, departure_datetime, num_children, num_adults, status, room_id],
          (error, insertResults) => {
            if (error) {
              console.error('Error inserting booking:', error);
              res.status(400).json({ "error": "Error occurred" });
              return;
            }
  
            // Update room status
            connection.query(
              'UPDATE room_details SET status = ? WHERE id = ?',
              ['pending', room_id],
              (updateError, updateResults) => {
                if (updateError) {
                  console.error('Error updating room status:', updateError);
                  res.status(500).json({ "error": "Database error" });
                  return;
                }
  
                console.log('Booking inserted successfully');
                res.status(200).json({ "success": "Booking successful" });
              }
            );
          }
        );
      });
    });
  });
  
  


    
    


    router.get('/', (req, res) => {
        const query = 'SELECT * FROM room_bookings';
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error occurred"
                });
            } else {
                res.send({
                    "code": 200,
                    "success": "bookings fetched successfully",
                    "data": results
                });
            }
        });
    });

    module.exports = router;