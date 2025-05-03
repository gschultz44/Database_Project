import express from 'express';
import mysql from 'mysql2';
import fs from 'fs'; 
import cors from 'cors';     

const app = express();
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the MySQL server:', err);
        return;
    }
    console.log('Connected to MySQL server!');

    // Create the database if it doesn't exist
    const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS finalproject';
    db.query(createDatabaseQuery, (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database created or already exists.');

        // Use finalproject as the databse
        db.changeUser({ database: 'finalproject' }, (err) => {
            if (err) {
                console.error('Error selecting database:', err);
                return;
            }
            console.log('Using the database!');

            createTables();
        });
    });
});

// Executes SQL script to create the tables
function createTables() {
    const sqlFilePath = './database_tables.sql';

    fs.readFile(sqlFilePath, 'utf8', (err, sqlContent) => {
        if (err) {
            console.error('Error reading the SQL file:', err);
            return;
        }
        
        // Split the SQL content into individual statements
        const statements = sqlContent.split(';').filter(stmt => stmt.trim() !== '');
        
        // Execute each statement separately
        statements.forEach(statement => {
            if (statement.trim()) {
                db.query(statement, (err, result) => {
                    if (err) {
                        console.error('Error executing statement:', statement);
                        console.error('Error details:', err);
                    } else {
                        console.log('Statement executed successfully');
                    }
                });
            }
        });
    });
}

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.use(cors({
  origin: 'http://localhost:5173' // allows frontend to make requests to backend
}));



