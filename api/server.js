const express = require('express');
const db = require('./db');  
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
  dest: 'public/uploads/', 
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
    res.status(200).json(result); 
  });
});

// GET request to fetch all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM categories';  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching categories');
    }
    res.status(200).json(result);  // Send categories data as JSON response
  });
});

// GET request to fetch a travel card by id
app.get('/api/travel-cards/:id', (req, res) => {
  const { id } = req.params; // Get the card ID from the URL parameter

  const query = `
    SELECT travel_cards.*, categories.category_name
    FROM travel_cards
    INNER JOIN categories ON travel_cards.category_id = categories.id
    WHERE travel_cards.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching travel card:', err);
      return res.status(500).send('Error fetching travel card');
    }

    if (result.length === 0) {
      return res.status(404).send('Travel card not found');
    }

    res.status(200).json(result[0]); // Return the single card
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

app.put('/api/travel-cards/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;  // id를 가져옴
  const { title, description, rating, date, category_id } = req.body;

  // id가 문자열로 들어올 수 있기 때문에, 이를 숫자로 변환
  const numericId = parseInt(id, 10); // id를 숫자로 변환

  let image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  if (!image_url) {
    image_url = req.body.image_url;
  }

  const query = `
    UPDATE travel_cards
    SET title = ?, description = ?, rating = ?, date = ?, category_id = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(query, [title, description, rating, date, category_id, image_url, numericId], (err, result) => {
    if (err) {
      console.error('Error updating travel card:', err);
      return res.status(500).send('Error updating travel card');
    }

    const updatedCardQuery = `
      SELECT travel_cards.*, categories.category_name
      FROM travel_cards
      INNER JOIN categories ON travel_cards.category_id = categories.id
      WHERE travel_cards.id = ?
    `;
    
    db.query(updatedCardQuery, [numericId], (err, result) => {
      if (err) {
        console.error('Error fetching updated travel card:', err);
        return res.status(500).send('Error fetching updated travel card');
      }
      res.status(200).json(result[0]);  // Return the updated card
    });
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
