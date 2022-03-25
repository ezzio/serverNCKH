import { GridFsStorage } from "multer-gridfs-storage";
import { uuid } from "uuidv4";
export const storage = new GridFsStorage({
  url:
    process.env.MONGODB_URL ||
    "mongodb+srv://ezzio:123456thang@cluster0.zbyuh.mongodb.net/Horenso_Manager?retryWrites=true&w=majority",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    console.log(file);
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${uuid()}-${file.originalname}`;
      return filename;
    }
    return {
      bucketName: "photos",
      filename: `${Date.now()}-${uuid()}-${file.originalname}`,
    };
  },
});

// export multer({ storage });
