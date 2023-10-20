import multer from "multer";
import path from "path";

const destPath = path.resolve("temp");

const storage = multer.diskStorage({
  destination: destPath,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniquePreffix}_${file.originalname}`;
    cb(null, fileName);
  },
});

const limits = {
  fileSize: 10 * 1024 * 1024,
};

const upload = multer({
  storage,
  limits,
});

export default upload;
