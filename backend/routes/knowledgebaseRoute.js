const express = require('express');
const upload = require('../middlewares/multerconfig'); // Updated multer config
const { uploadPdf, getAllPdfs } = require('../controllers/knowledgebaseController');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadPdf); // Handle file upload
router.get('/pdfs', getAllPdfs); // Fetch all PDFs

module.exports = router;
