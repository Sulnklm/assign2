const express = require('express');
const db = require('./db');  // MySQL 데이터베이스 연결
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration for file uploads
const upload = multer({
  dest: 'public/uploads/', // 업로드할 경로 설정
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET request to fetch all travel cards with category
app.get('/api/travel-cards', (req, res) => {
  const query = `
    SELECT travel_cards.*, categories.category_name
    FROM travel_cards
    INNER JOIN categories ON travel_cards.category_id = categories.id
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching travel cards');
    }
    res.status(200).json(result); // 카테고리 이름과 함께 카드 데이터를 반환
  });
});

// GET request to fetch all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM categories';  // Example query to get all categories
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching categories');
    }
    res.status(200).json(result);  // Send categories data as JSON response
  });
});

// POST request to add a new travel card
app.post('/api/travel-cards', upload.single('image'), (req, res) => {
  console.log('Received data:', req.body);  // Log the request body to check if data is being sent correctly
  console.log('Received file:', req.file);  // Log the uploaded file info

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const { title, description, rating, date, category_id } = req.body;
  const imagePath = `/uploads/${req.file.filename}`; // Use req.file.filename for the image path

  const query = `
    INSERT INTO travel_cards (title, description, rating, date, category_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [title, description, rating, date, category_id, imagePath], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error adding travel card');
    }
    res.status(201).json({ message: 'Travel card added successfully', id: result.insertId });
  });
});

// Route to delete a travel card
app.delete('/api/travel-cards/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM travel_cards WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error deleting travel card');
    }
    res.status(200).json({ message: 'Travel card deleted successfully' });
  });
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
