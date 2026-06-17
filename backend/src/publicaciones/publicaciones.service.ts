import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, SortOrder } from 'mongoose';
import { Publicacion, PublicacionDocument } from './entities/publicaciones.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

interface OpcionesListado {
  orden?: 'fecha' | 'likes';
  autor?: string;
  offset?: number;
  limit?: number;
}

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private pubModel: Model<PublicacionDocument>,
    private usuarioService: UsuarioService,
    private cloudinary: CloudinaryService
  ) {}

  // ----- ALTA -----
  async crear(
    titulo: string,
    descripcion: string,
    autorId: string,
    imagen?: Express.Multer.File, 
  ) {
    const url = imagen
    ? await this.cloudinary.subirImagen(imagen.buffer, 'publicaciones')
    : null;

    const pub = await this.pubModel.create({
      titulo,
      descripcion,
      imagen: url,
      autor: new Types.ObjectId(autorId),
    });
    // Devolvemos el autor poblado para que el front pueda mostrarlo enseguida
    return pub.populate('autor', 'nombre apellido nick imagenPerfil');
  }

  // ----- LISTADO (orden + filtro por autor + paginado) -----
  async listar({ orden = 'fecha', autor, offset = 0, limit = 10 }: OpcionesListado) {
    const filtro: Record<string, unknown> = { activo: true };
    if (autor) filtro.autor = new Types.ObjectId(autor);

    // Por defecto, las más nuevas primero. Si piden "likes", por cantidad
    // de me gusta (y a igualdad, por fecha).
    const orderBy: Record<string, SortOrder> =
  orden === 'likes'
    ? { cantidadMeGusta: -1, createdAt: -1 }
    : { createdAt: -1 };

    // Traemos la página y el total en paralelo. El total sirve para que el
    // front sepa cuántas páginas hay.
    const [publicaciones, total] = await Promise.all([
      this.pubModel
        .find(filtro)
        .sort(orderBy)
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('autor', 'nombre apellido nick imagenPerfil')
        .exec(),
      this.pubModel.countDocuments(filtro),
    ]);

    return { total, publicaciones };
  }

  // ----- BAJA LÓGICA (solo autor o administrador) -----
  async eliminar(idPublicacion: string, solicitanteId: string) {
    const pub = await this.pubModel.findOne({ _id: idPublicacion, activo: true });
    if (!pub) throw new NotFoundException('La publicación no existe');

    const solicitante = await this.usuarioService.buscarPorId(solicitanteId);
    if (!solicitante) throw new UnauthorizedException('Usuario no válido');

    const esAutor = pub.autor.toString() === solicitanteId;
    // OJO: esto asume que renombraste el campo de rol a "perfil".
    // Si lo dejaste como "usuario", cambiá la línea por solicitante.usuario.
    const esAdmin = (solicitante as any).perfil === 'administrador';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('No podés eliminar esta publicación');
    }

    pub.activo = false;
    await pub.save();
    return { mensaje: 'Publicación eliminada' };
  }

  // ----- DAR ME GUSTA (uno solo por usuario) -----
  async darMeGusta(idPublicacion: string, usuarioId: string) {
    const pub = await this.pubModel.findOne({ _id: idPublicacion, activo: true });
    if (!pub) throw new NotFoundException('La publicación no existe');

    const yaDio = pub.meGusta.some((u) => u.toString() === usuarioId);
    if (yaDio) {
      throw new ConflictException('Ya diste me gusta a esta publicación');
    }

    pub.meGusta.push(new Types.ObjectId(usuarioId));
    pub.cantidadMeGusta = pub.meGusta.length; // se recalcula siempre
    await pub.save();
    return { cantidadMeGusta: pub.cantidadMeGusta };
  }

  // ----- QUITAR ME GUSTA (solo si lo había dado) -----
  async quitarMeGusta(idPublicacion: string, usuarioId: string) {
    const pub = await this.pubModel.findOne({ _id: idPublicacion, activo: true });
    if (!pub) throw new NotFoundException('La publicación no existe');

    const yaDio = pub.meGusta.some((u) => u.toString() === usuarioId);
    if (!yaDio) {
      throw new BadRequestException('No habías dado me gusta a esta publicación');
    }

    pub.meGusta = pub.meGusta.filter((u) => u.toString() !== usuarioId);
    pub.cantidadMeGusta = pub.meGusta.length;
    await pub.save();
    return { cantidadMeGusta: pub.cantidadMeGusta };
  }
}
