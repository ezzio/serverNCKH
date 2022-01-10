import { GridFsStorage } from "multer-gridfs-storage";

export const storage = new GridFsStorage({
  url: process.env.MONGODB_URL || "mongodb://localhost:27017/Horenso_Manager",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    if (file.minetype == "application/zip")
      return {
        bucketName: "zipfiles",
        filename: `${Date.now()}-DuongHuuThang-${file.originalname}`,
      };
  },
});

// export multer({ storage });
