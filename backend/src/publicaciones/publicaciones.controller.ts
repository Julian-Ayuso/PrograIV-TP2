import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/create-publicaciones.dto';
import { AccionUsuarioDto } from './dto/update-publicaciones.dto';
import type { Express } from 'express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly service: PublicacionesService,) {}

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
  return this.service.crear(dto.titulo, dto.descripcion, dto.autorId, imagen);
}

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

  @Delete(':id')
  eliminar(@Param('id') id: string, @Body() dto: AccionUsuarioDto) {
    return this.service.eliminar(id, dto.usuarioId);
  }

  @Post(':id/me-gusta')
  @HttpCode(HttpStatus.OK)
  darMeGusta(@Param('id') id: string, @Body() dto: AccionUsuarioDto) {
    return this.service.darMeGusta(id, dto.usuarioId);
  }

  @Delete(':id/me-gusta')
  quitarMeGusta(@Param('id') id: string, @Body() dto: AccionUsuarioDto) {
    return this.service.quitarMeGusta(id, dto.usuarioId);
  }
}
