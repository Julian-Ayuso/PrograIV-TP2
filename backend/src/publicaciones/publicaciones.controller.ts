import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/create-publicaciones.dto';
import { AccionUsuarioDto } from './dto/update-publicaciones.dto';
import type { Express } from 'express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly service: PublicacionesService,) {}

  // POST /publicaciones  (multipart/form-data: titulo, descripcion, autorId, imagen?)
  // 201 Created
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('El archivo debe ser una imagen'), false);
        }
        cb(null, true);
      },
    }),
  )
  crear(@Body() dto: CrearPublicacionDto,
  @UploadedFile() imagen?: Express.Multer.File) {
  // ⬇️ antes armabas la URL local; ahora le pasás el archivo entero al service
  return this.service.crear(dto.titulo, dto.descripcion, dto.autorId, imagen);
}

  // GET /publicaciones?orden=fecha|likes&autor=<id>&offset=0&limit=10
  // 200 OK -> { total, publicaciones }
  @Get()
  listar(
    @Query('orden') orden?: 'fecha' | 'likes',
    @Query('autor') autor?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listar({
      orden,
      autor,
      offset: offset ? Number(offset) : 0,
      limit: limit ? Number(limit) : 10,
    });
  }

  // DELETE /publicaciones/:id  body { usuarioId }
  // Baja lógica. 200 OK, o 403/404 según el caso.
  @Delete(':id')
  eliminar(@Param('id') id: string, @Body() dto: AccionUsuarioDto) {
    return this.service.eliminar(id, dto.usuarioId);
  }

  // POST /publicaciones/:id/me-gusta  body { usuarioId }
  // Modifica una publicación existente (no crea documento) -> 200 OK.
  // 409 si el usuario ya había dado me gusta.
  @Post(':id/me-gusta')
  @HttpCode(HttpStatus.OK)
  darMeGusta(@Param('id') id: string, @Body() dto: AccionUsuarioDto) {
    return this.service.darMeGusta(id, dto.usuarioId);
  }

  // DELETE /publicaciones/:id/me-gusta  body { usuarioId }
  // 200 OK, o 400 si no lo había dado.
  @Delete(':id/me-gusta')
  quitarMeGusta(@Param('id') id: string, @Body() dto: AccionUsuarioDto) {
    return this.service.quitarMeGusta(id, dto.usuarioId);
  }
}
