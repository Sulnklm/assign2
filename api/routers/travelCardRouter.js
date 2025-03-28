const express = require('express');
const db = require('../db');
const upload = require('../storage');  // file upload middleware
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
  console.log('Received data:', req.body);  // 폼 데이터 출력
  console.log('Received file:', req.file);  // 파일 정보 출력

  const { title, description, rating, date, category_id } = req.body;
  const image = req.file ? req.file.filename : null; // 이미지 파일이 존재하는지 확인

  const query = `
    INSERT INTO travel_cards (title, description, rating, date, category_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const imagePath = image ? `/uploads/${image}` : null; // 이미지 경로 설정

  db.query(query, [title, description, rating, date, category_id, imagePath], (err, result) => {
    if (err) {
      console.error('Database query error:', err);  // 쿼리 오류 로그
      return res.status(500).send('Error adding travel card');
    }
    res.status(201).json({ message: 'Travel card added successfully', id: result.insertId });
  });
});


module.exports = travelCardRouter;
