const express = require('express');
const db = require('../db');  // MySQL database connection
const upload = require('../storage');  // File upload middleware
const travelCardRouter = express.Router();

// GET request to fetch all travel cards with category
travelCardRouter.get('/', (req, res) => {
  const query = `
    SELECT travel_cards.*, categories.category_name
    FROM travel_cards
    INNER JOIN categories ON travel_cards.category_id = categories.id
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching travel cards:', err);
      return res.status(500).send('Error fetching travel cards');
    }
    res.status(200).json(result);
  });
});

// POST request to add a new travel card
travelCardRouter.post('/', upload.single('image'), (req, res) => {
  console.log('Received data:', req.body);  // Log received data
  console.log('Received file:', req.file);  // Log uploaded file

  const { title, description, rating, date, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  const imagePath = image ? `/uploads/${image}` : null;

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

// PUT request to update a travel card
travelCardRouter.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;  // Get card ID from URL params
  
  // Ensure id is a valid number
  const numericId = parseInt(id, 10);  // Parse the ID as an integer

  // If id is not a valid number, return an error
  if (isNaN(numericId)) {
    return res.status(400).send('Invalid ID');
  }

  const { title, description, rating, date, category_id } = req.body;
  
  let image_url = req.file ? `/uploads/${req.file.filename}` : null;
  if (!image_url) {
    image_url = req.body.image_url;  // Preserve old image if no new one is uploaded
  }

  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  const query = `
    UPDATE travel_cards
    SET title = ?, description = ?, rating = ?, date = ?, category_id = ?, image_url = ?
    WHERE id = ?
  `;

  // Pass numericId instead of id to ensure it's a valid number
  db.query(query, [title, description, rating, date, category_id, image_url, numericId], (err, result) => {
    if (err) {
      console.error('Error updating travel card:', err);
      return res.status(500).send('Error updating travel card');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Travel card not found');
    }

    res.status(200).json({ message: 'Travel card updated successfully' });
  });
});


// DELETE request to remove a travel card
travelCardRouter.delete('/:id', (req, res) => {
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

module.exports = travelCardRouter;
