import multer from 'multer';

// basic use of multer
const upload = multer({
    dest : 'uploads',
})

export default upload;