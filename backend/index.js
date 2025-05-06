// index.js - Place this in your project root
import express from 'express';
import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors()); // For development

// Database connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finalproject'
});

// Create database if it doesn't exist
try {
  await db.query('CREATE DATABASE IF NOT EXISTS finalproject');
  console.log('Database created or already exists');
  
  // Switch to the finalproject database
  await db.query('USE finalproject');
  
  // Read and execute SQL file
  const sqlPath = join(__dirname, 'database_tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Split and execute SQL statements
  const statements = sql.split(';').filter(statement => statement.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await db.query(statement);
        console.log('SQL statement executed');
      } catch (err) {
        console.error('Error executing SQL:', err);
      }
    }
  }
} catch (err) {
  console.error('Database setup error:', err);
}

// Simple API endpoints

// Social Media Platforms
app.get('/api/socialmedia', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SocialMedia');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/socialmedia', async (req, res) => {
  try {
    const { media_name } = req.body;
    await db.query('INSERT INTO SocialMedia (media_name) VALUES (?)', [media_name]);
    res.status(201).json({ success: true, message: 'Platform added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Accounts
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM UserAccount');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    console.log(req.body);  // Log incoming request data
    
    const { username, media_name, first_name, last_name, birth_country, residence_country, age, gender, is_verified } = req.body;
    await db.query(
      'INSERT INTO UserAccount (username, media_name, first_name, last_name, birth_country, residence_country, age, gender, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, media_name, first_name, last_name, birth_country, residence_country, age, gender, is_verified]
    );
    res.status(201).json({ success: true, message: 'User added' });
  } catch (err) {
    console.error('Error inserting user:', err);  // Log error message
    res.status(500).json({ error: err.message });
  }
});

// Posts
// Retrieve all posts
app.get('/api/posts', async (req, res) => {
  console.log("made it to api1");
  try {
    const [rows] = await db.query('SELECT * FROM Post');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  console.log("made it to api2");
  console.log("Request body:", req.body); // Log the incoming data
  
  try {
    const {username, media_name, content, post_time, city, state_name, country, likes, dislikes, multimedia, project_name, field_name, is_repost } = req.body;
    
    console.log("Extracted data:", { username, media_name, content, post_time, city, state_name, country, likes, dislikes, multimedia, project_name, field_name, is_repost  });
    
    // Check if a post with the same content already exists
    console.log("Checking for existing posts with query params:", [username, media_name, content, post_time]);
    
    const [existingPosts] = await db.query(
      'SELECT * FROM Post WHERE username = ? AND media_name = ? AND content = ? AND post_time = ?',
      [username, media_name, content, post_time]
    );
    
    console.log("Existing posts check result:", existingPosts);
    
    if (existingPosts.length > 0) {
      return res.status(400).json({ error: 'A post with the same content already exists for this user on this date.' });
    }
    
    // Insert new post if no duplicate is found
    console.log("Inserting new post with data:", [username, media_name, content, post_time, city, state_name, country, likes, dislikes, multimedia, project_name, field_name, is_repost ]);
    
    await db.query(
      'INSERT INTO Post (username, media_name, content, post_time, city, state_name, country, likes, dislikes, multimedia, project_name, field_name, is_repost ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, media_name, content, post_time, city, state_name, country, likes, dislikes, multimedia, project_name, field_name, is_repost ]
    );
    
    console.log("Post successfully inserted");
    res.status(201).json({ success: true, message: 'Post added successfully' });
  } catch (err) {
    console.error("ERROR IN POST CREATION:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Project');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { project_name, project_description, project_manager_first, project_manager_last, institute, start_date, end_date } = req.body;
    await db.query(
      'INSERT INTO Project VALUES (?, ?, ?, ?, ?, ?, ?)',
      [project_name, project_description, project_manager_first, project_manager_last, institute, start_date, end_date]
    );
    res.status(201).json({ success: true, message: 'Project added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fields
app.get('/api/fields', async (req, res) => {
  try {
    const { project_name } = req.query;
    let query = 'SELECT * FROM Field';
    let params = [];
    
    if (project_name) {
      query += ' WHERE project_name = ?';
      params.push(project_name);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fields', async (req, res) => {
  try {
    const {project_name, field_name } = req.body;
    await db.query(
      'INSERT INTO Field (project_name, field_name) VALUES (?, ?)',
      [project_name, field_name]
    );
    res.status(201).json({ success: true, message: 'Field added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analysis Results
app.get('/api/analysis', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM AnalysisResult');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/analysis', async (req, res) => {
  try {
    const { project_name, analysis_title, analysis_data, analysis_date } = req.body;
    
    await db.query(
      'INSERT INTO AnalysisResult (project_name, analysis_title, analysis_data, analysis_date) VALUES (?, ?, ?, ?)',
      [project_name, analysis_title, analysis_data, analysis_date]
    );
    
    res.status(201).json({ success: true, message: 'Analysis result added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple queries 
app.get('/api/query/posts', async (req, res) => {
  try {
    const { 
      username, 
      media_name, 
      first_name,  
      last_name,
      content, 
      date_from, 
      date_to 
    } = req.query;
    
    let query = `
      SELECT 
        p.*,
        u.first_name,
        u.last_name
      FROM Post p
      INNER JOIN UserAccount u ON p.username = u.username AND p.media_name = u.media_name
      WHERE 1=1
    `;
    
    const params = [];
    
    if (username) {
      query += ` AND p.username LIKE ?`;
      params.push(`%${username}%`);
    }
    
    if (media_name) {
      query += ` AND p.media_name = ?`;
      params.push(media_name);
    }
    
    if (first_name && first_name.trim() !== '') {
      query += ` AND u.first_name LIKE ?`;
      params.push(`%${first_name.trim()}%`);
      
      console.log(`Searching for first_name: '${first_name.trim()}'`);
    }
    
    if (last_name && last_name.trim() !== '') {
      query += ` AND u.last_name LIKE ?`;
      params.push(`%${last_name.trim()}%`);
      
      console.log(`Searching for last_name: '${last_name.trim()}'`);
    }
    
    if (content) {
      query += ` AND p.content LIKE ?`;
      params.push(`%${content}%`);
    }
    
    if (date_from && date_to) {
      query += ` AND p.post_time BETWEEN ? AND ?`;
      params.push(date_from, date_to);
    }
    
    // Order by post time (most recent first)
    query += ` ORDER BY p.post_time DESC`;
    
    console.log('Query:', query);
    console.log('Parameters:', params);
    
    const [posts] = await db.execute(query, params);
    
    console.log(`Found ${posts.length} matching posts`);
    
    res.json(posts);
    
  } catch (error) {
    console.error('Error querying posts:', error);
    res.status(500).json({ error: 'An error occurred while querying posts' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});