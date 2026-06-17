import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Lee las credenciales del .env (y de las env vars de Vercel en producción)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Recibe el buffer del archivo (multer en memoria) y lo sube a Cloudinary.
  // Devuelve la URL pública (secure_url) que vas a guardar en Mongo.
  subirImagen(buffer: Buffer, carpeta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: carpeta }, // ej: 'perfiles' o 'publicaciones'
        (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      );
      // Convertimos el buffer en un stream y lo "pipeamos" al upload de Cloudinary
      Readable.from(buffer).pipe(stream);
    });
  }
}
