import express from 'express';
import { uploadFile } from '../controller/file-controller.js';
import upload from '../utils/upload.js';

const router = express.Router();

// define router and adjust middleware multer
router.post('/upload', upload.single('file') , uploadFile);



export default router;