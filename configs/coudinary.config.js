// You need to run `npm i cloudinary multer-storage-cloudinary multer` to use cloudinary
// create this file in the 'config' folder

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// once you register on cloudinary you will get these three keys. 
// store them in the .env file and reference them here 
cloudinary.config({
  cloud_name: 'manishp',
  api_key: '541333762759667',
  api_secret: 'OMDRR0dLPUVWRXqXQR9TAY6ca84'
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'todo-gallery', // The name of the folder in cloudinary . You can name this whatever you want
  allowedFormats: ['jpg', 'png'],
  // params: { resource_type: 'raw' }, => this is in case you want to upload other type of files, not just images
  filename: function (req, res, cb) {
    cb(null, res.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

module.exports = multer({ storage });