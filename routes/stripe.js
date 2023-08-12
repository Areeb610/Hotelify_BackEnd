const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51NcjUSDMO24VZazudm1ibIWuJGh0y7D7YrSSt7pa5EPx6mWJ3Cb2fPVc96zpv7LQXNEGUuck1HHuv9EVWvmAkB5J00AIN8dWvr');
const { connection } = require('../database/db'); // Import your database connection

router.get('/checkout', async (req, res) => {
  try {
    // Fetch booked room information from the database
    const query = `
      SELECT rb.room_id, rd.room_name, rd.price
      FROM room_bookings rb
      JOIN room_details rd ON rb.room_id = rd.id
      WHERE rb.status = 'pending'`; // Assuming you want to fetch pending bookings
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching booked rooms:', error);
        res.status(500).send('Error fetching booked rooms');
        return;
      }

      const bookedRooms = results.map((room) => ({
        name: room.room_name,
        price: room.price,
        quantity: 1, // Assuming each booked room is for 1 quantity
      }));

      // Create line items for the Stripe checkout session
      const lineItems = bookedRooms.map((room) => ({
        price_data: {
          currency: 'pkr',
          product_data: {
            name: room.name,
          },
          unit_amount: room.price * 100, // Convert price to cents
        },
        quantity: room.quantity,
      }));

      // Create Stripe checkout session
      stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `http://localhost:4000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: 'http://localhost:4000/checkout/cancel',
        },
        (error, session) => {
          if (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).send('Error creating checkout session');
            return;
          }

          res.redirect(session.url);
        }
      );
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Error creating checkout session');
  }
});

router.get('/checkout/success', (req, res) => {
  // Handle successful payment and update the booking status
  const session_id = req.query.session_id;
  const updateQuery = `
    UPDATE room_bookings
    SET status = 'paid'
    WHERE status = 'pending' AND
    room_id IN (SELECT rb.room_id FROM room_bookings rb JOIN room_details rd ON rb.room_id = rd.id WHERE rb.status = 'pending')`;
  
  connection.query(updateQuery, (error, updateResults) => {
    if (error) {
      console.error('Error updating booking status:', error);
      res.status(500).send('Error updating booking status');
      return;
    }

    res.send('Payment successful and booking status updated!');
  });
});

router.get('/checkout/cancel', (req, res) => {
  // Handle canceled payment
  res.send('Payment canceled.');
});

module.exports = router;
