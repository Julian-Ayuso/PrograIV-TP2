import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

// Configuración de multer: guarda la imagen en disco con nombre único
//const storageImagenPerfil = diskStorage({
//  destination: './uploads/perfiles',
//  filename: (_req, file, cb) => {
//    cb(null, `${uuid()}${extname(file.originalname)}`);
//  },
//});

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly authService: AutenticacionService) {}

  // POST /auth/registro  (multipart/form-data por la imagen)
  // 201 Created si sale bien, 400 si los datos no validan, 409 si está duplicado
  @Post('registro')
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      //storage: storageImagenPerfil,
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('El archivo debe ser una imagen'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  
  registrar(
    @Body() dto: RegistroDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.authService.registrar(dto, imagen);
  }

  // POST /auth/login
  // 200 OK con los datos del usuario, 401 si las credenciales no son válidas
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}