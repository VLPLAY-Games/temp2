const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Только изображения (jpeg, jpg, png, gif, webp)'));
  }
}).single('image');

// Массив для хранения информации об изображениях (вместо БД)
let images = [
  { id: 1, filename: 'example1.jpg', title: 'Пример 1', uploadedAt: '2025-01-01' },
  { id: 2, filename: 'example2.png', title: 'Пример 2', uploadedAt: '2025-01-02' }
];

// Получить все изображения
const getAllImages = (req, res) => {
  res.json({
    success: true,
    count: images.length,
    data: images
  });
};

// Получить изображение по ID
const getImageById = (req, res) => {
  const id = parseInt(req.params.id);
  const image = images.find(img => img.id === id);
  if (!image) {
    return res.status(404).json({ success: false, message: 'Изображение не найдено' });
  }
  res.json({ success: true, data: image });
};

// Загрузить новое изображение
const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Файл не выбран' });
    }

    const newImage = {
      id: images.length + 1,
      filename: req.file.filename,
      title: req.body.title || 'Без названия',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    images.push(newImage);
    res.status(201).json({
      success: true,
      message: 'Изображение загружено',
      data: newImage
    });
  });
};

// Удалить изображение
const deleteImage = (req, res) => {
  const id = parseInt(req.params.id);
  const index = images.findIndex(img => img.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Изображение не найдено' });
  }

  const image = images[index];
  const filePath = path.join(__dirname, '../uploads', image.filename);

  // Удаляем файл с диска
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Ошибка удаления файла:', err);
    }
  });

  images.splice(index, 1);
  res.json({ success: true, message: 'Изображение удалено' });
};

module.exports = {
  getAllImages,
  getImageById,
  uploadImage,
  deleteImage
};