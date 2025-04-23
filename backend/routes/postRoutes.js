const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Assuming you already have a DB connection
const db = require('../db'); // Assuming you have a separate file for DB connection

// Create a new post
router.post('/create', (req, res) => {
    const { post_id, username, media_name, content, post_time, is_repost } = req.body;
    
    const query = 'INSERT INTO Post (post_id, username, media_name, content, post_time, is_repost) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [post_id, username, media_name, content, post_time, is_repost], (err, result) => {
        if (err) {
            res.status(500).send('Error inserting post');
        } else {
            res.status(200).send('Post created successfully');
        }
    });
});

// Other post-related routes can go here...

module.exports = router;
