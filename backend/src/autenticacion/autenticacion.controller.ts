import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AutenticacionService } from './autenticacion.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly authService: AutenticacionService) {}

  // RUTA REGISTRO
  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: diskStorage({
      destination: './uploads/perfiles', // Carpeta donde se guardarán
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async registro(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('La imagen de perfil es obligatoria');
    }
    
    // Aquí armamos el objeto con los datos y la URL/ruta de la imagen
    const usuarioData = {
      ...body,
      imagenUrl: `/uploads/perfiles/${file.filename}`
    };
    ;
  }

  // RUTA LOGIN
  @Post('login')
  async login(@Body() body: any) {
    const { identificador, password } = body; // 'identificador' puede ser correo o username
    return password;
  }
}