import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are permitted.`
      ),
      false
    );
  }
};

export const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per image
    files: 10, // Max 10 images at once
  },
  fileFilter,
});

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1,
  },
  fileFilter,
});
