const mysql = require('mysql2');

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'finalproject' ,
    multipleStatements: true,
    charset: 'utf8mb4'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database!');
    }
});

module.exports = db; // Export db connection to use in other files
