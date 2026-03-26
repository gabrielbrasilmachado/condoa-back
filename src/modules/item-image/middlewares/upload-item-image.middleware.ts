import multer, { MulterError } from 'multer'
import { type NextFunction, type Request, type Response } from 'express'

const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_IN_BYTES,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new Error(
          'Tipo de arquivo inválido. Envie uma imagem JPEG, PNG ou WEBP.'
        )
      )

      return
    }

    callback(null, true)
  },
})

export const uploadItemImageMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  upload.single('file')(request, response, (error: unknown) => {
    if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return response.status(413).json({
        message: 'A imagem deve ter no máximo 5 MB.',
      })
    }

    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message,
      })
    }

    if (!request.file) {
      return response.status(400).json({
        message: 'Envie um arquivo de imagem.',
      })
    }

    return next()
  })
}
