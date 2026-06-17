import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  crear(datos: Partial<Usuario>) {
    return this.usuarioModel.create(datos);
  }

  // Para validar unicidad en el registro
  buscarCorreoNick(correo: string, nick: string) {
    return this.usuarioModel.findOne({ $or: [{ correo }, { nick }] }).exec();
  }

  // Para el login: "usuario" puede ser el correo o el nombre de usuario.
  // Pedimos explícitamente la contraseña porque tiene select: false.
  buscarLogin(usuario: string) {
    return this.usuarioModel
    .findOne({
      $or: [{ correo: usuario.toLowerCase() }, { nick: usuario }],
    })
    .select('+pass')
    .exec();
  }

  buscarPorId(id: string) {
    return this.usuarioModel.findById(id).exec();
  }
}
