const express = require('express');
const db = require('./db');  
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for allowing requests from other domains
app.use(express.json()); // Middleware to parse incoming JSON data into JavaScript objects
app.use(express.static('public')); // Serve static files like images, CSS, JS from 'public' directory

// Multer configuration for file uploads
const upload = multer({
  dest: 'public/uploads/', // Set the destination folder for uploaded files
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Allowed image formats
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    const mimetype = allowedTypes.test(file.mimetype); // Check file MIME type

    if (extname && mimetype) {
      return cb(null, true); // If file is of allowed type, proceed
    } else {
      return cb(new Error('Only image files are allowed'), false); // Reject file if not an image
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
      return res.status(500).send('Error fetching travel cards'); // Error fetching travel cards from DB
    }
    res.status(200).json(result); // Send the fetched travel cards as a JSON response
  });
});

// GET request to fetch all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM categories';  // SQL query to fetch all categories
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching categories'); // Error fetching categories from DB
    }
    res.status(200).json(result);  // Send categories data as JSON response
  });
});

// GET request to fetch a travel card by id
app.get('/api/travel-cards/:id', (req, res) => {
  const { id } = req.params; // Extract the travel card ID from the URL parameter

  const query = `
    SELECT travel_cards.*, categories.category_name
    FROM travel_cards
    INNER JOIN categories ON travel_cards.category_id = categories.id
    WHERE travel_cards.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching travel card:', err);
      return res.status(500).send('Error fetching travel card'); // Error fetching specific card from DB
    }

    if (result.length === 0) {
      return res.status(404).send('Travel card not found'); // Return 404 if the card doesn't exist
    }

    res.status(200).json(result[0]); // Return the single travel card as a response
  });
});

// POST request to add a new travel card
app.post('/api/travel-cards', upload.single('image'), (req, res) => {
  console.log('Received data:', req.body);  // Log the request body to check if data is being sent correctly
  console.log('Received file:', req.file);  // Log the uploaded file information

  if (!req.file) {
    return res.status(400).send('No file uploaded'); // Ensure file is uploaded; return an error if not
  }

  const { title, description, rating, date, category_id } = req.body;
  const imagePath = `/uploads/${req.file.filename}`; // Construct image URL from the uploaded file's filename

  const query = `
    INSERT INTO travel_cards (title, description, rating, date, category_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [title, description, rating, date, category_id, imagePath], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error adding travel card'); // Error adding travel card to DB
    }
    res.status(201).json({ message: 'Travel card added successfully', id: result.insertId }); // Send success message with the new card's ID
  });
});

// PUT request to update an existing travel card
app.put('/api/travel-cards/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;  // Extract the travel card ID from the URL parameter
  const { title, description, rating, date, category_id } = req.body;

  const numericId = parseInt(id, 10); // Convert the ID to a number

  // If a new file is uploaded, use its filename; otherwise, keep the old image URL
  let image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  if (!image_url) {
    image_url = req.body.image_url; // Ensure image_url is set if no new image is uploaded
  }

  const query = `
    UPDATE travel_cards
    SET title = ?, description = ?, rating = ?, date = ?, category_id = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(query, [title, description, rating, date, category_id, image_url, numericId], (err, result) => {
    if (err) {
      console.error('Error updating travel card:', err);
      return res.status(500).send('Error updating travel card'); // Error updating the travel card in the DB
    }

    // Fetch the updated card data to send it back in the response
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
      res.status(200).json(result[0]);  // Return the updated card data
    });
  });
});

// DELETE request to remove a travel card
app.delete('/api/travel-cards/:id', (req, res) => {
  const { id } = req.params; // Get the travel card ID from the URL

  const query = 'DELETE FROM travel_cards WHERE id = ?'; // SQL query to delete the card by ID
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Error deleting travel card'); // Error deleting travel card from DB
    }
    res.status(200).json({ message: 'Travel card deleted successfully' }); // Send success message on successful deletion
  });
});

// Start the server
const PORT = process.env.PORT || 5001; // Set the port number, using the environment variable or 5001 by default
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log a message when the server starts
});
