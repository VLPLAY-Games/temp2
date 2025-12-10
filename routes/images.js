const express = require('express');
const router = express.Router();
const {
  getAllImages,
  getImageById,
  uploadImage,
  deleteImage
} = require('../controllers/imagesController');

// GET /api/images — получить все изображения
router.get('/', getAllImages);

// GET /api/images/:id — получить изображение по ID
router.get('/:id', getImageById);

// POST /api/images — загрузить новое изображение
router.post('/', uploadImage);

// DELETE /api/images/:id — удалить изображение
router.delete('/:id', deleteImage);

module.exports = router;