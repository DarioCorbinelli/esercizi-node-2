import multer from "multer";
import mime from "mime";
import { randomUUID } from "crypto";

export const generatePhotoFilename = (mimeType: string) => {
  const randomFilename = `${randomUUID()}-${Date.now()}`
  const fileExtension = mime.getExtension(mimeType)
  const filename = `${randomFilename}.${fileExtension}`

  return filename
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    return cb(null, generatePhotoFilename(file.mimetype))
  }
})

const MAX_SIZE_IN_MEGABYTES = 6 * 1024 * 1024;
const VALID_MIME_TYPES = ["image/png", "image/jpeg"]

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (VALID_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Error: The uploaded file mult be a JPG or a PNG image"))
  }
}

export const multerOptions = {
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_IN_MEGABYTES
  }
}

export const initMulterMiddleware = () => {
  return multer({storage, ...multerOptions})
}