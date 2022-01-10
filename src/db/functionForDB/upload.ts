import { GridFsStorage } from "multer-gridfs-storage";

export const storage = new GridFsStorage({
  url: process.env.MONGODB_URL || "mongodb://localhost:27017/Horenso_Manager",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-DuongHuuThang-${file.originalname}`;
      return filename;
    }
    return {
      bucketName: "photos",
      filename: `${Date.now()}-DuongHuuThang-${file.originalname}`,
    };
  },
});

// export multer({ storage });
