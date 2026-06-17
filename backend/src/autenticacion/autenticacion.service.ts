import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AutenticacionService {
  constructor(private readonly usuariosService: UsuarioService, private readonly cloudinary: CloudinaryService,
  ) {}

  async registrar(dto: RegistroDto, imagen?: Express.Multer.File) {
    // Correo y nombre de usuario deben ser únicos -> 409 Conflict si ya existen
    const existente = await this.usuariosService.buscarCorreoNick(
      dto.correo.toLowerCase(),
      dto.nick,
    );
    if (existente) {
      throw new ConflictException(
        'El correo o el nombre de usuario ya están registrados',
      );
    }

    // La contraseña queda encriptada (hash con salt)
    const hash = await bcrypt.hash(dto.pass, 10);

    // Si vino imagen, multer ya la guardó en /uploads/perfiles
    // y acá persistimos solo su URL
    const imagenPerfil = imagen
    ? await this.cloudinary.subirImagen(imagen.buffer, 'perfiles')
    : null;

    const usuario = await this.usuariosService.crear({
      ...dto,
      correo: dto.correo.toLowerCase(),
      pass: hash,
      fecha: new Date(dto.fecha),
      imagenPerfil, 
    });

    return this.sinContrasena(usuario.toObject());
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.buscarLogin(dto.usuario);

    // Mismo mensaje exista o no el usuario, para no filtrar información
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // bcrypt.compare hashea la contraseña recibida con el mismo salt
    // y la compara contra la guardada
    const coincide = await bcrypt.compare(dto.pass, usuario.pass);
    if (!coincide) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Devuelve todos los datos del usuario (sin la contraseña)
    return this.sinContrasena(usuario.toObject());
  }

  private sinContrasena(usuario: any) {
    const { pass, ...resto } = usuario;
    return resto;
  }
}
