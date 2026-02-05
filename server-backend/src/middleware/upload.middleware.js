import multer from 'multer';
import path from 'path';
import fs from 'fs';


// create upload directory if it doent exisits.
const uploadDir = './uploads/documents';

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {
        recursive : true,
    });
}

// configure storage.
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png|gif|xlsx|xls|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, images, and Office files are allowed.'));
  }
};

// congiure multer 

export const upload = multer({
    storage : storage,
    limits : {
         fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});