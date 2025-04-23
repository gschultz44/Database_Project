const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Assuming you already have a DB connection
const db = require('../db'); // Assuming you have a separate file for DB connection

// Create a new user
router.post('/create', (req, res) => {
    const { username, media_name, first_name, last_name, birth_country, residence_country, age, gender, is_verified } = req.body;
    
    const query = 'INSERT INTO UserAccount (username, media_name, first_name, last_name, birth_country, residence_country, age, gender, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [username, media_name, first_name, last_name, birth_country, residence_country, age, gender, is_verified], (err, result) => {
        if (err) {
            res.status(500).send('Error inserting user');
        } else {
            res.status(200).send('User created successfully');
        }
    });
});

// Other user-related routes can go here...

module.exports = router;
