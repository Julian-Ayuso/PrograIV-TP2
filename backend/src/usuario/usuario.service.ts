import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuarioService {

  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioCreado = await this.usuarioModel.create(createUsuarioDto)
    return 'This action adds a new usuario';
  }

  async findAll() {
    const usuarios = await this.usuarioModel.find();
    return usuarios;
  }

  async findOne(id: string) {
    const usuario = await this.usuarioModel.findById(id);
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioActualizado = await this.usuarioModel.updateOne({_id: id}, updateUsuarioDto);
    return usuarioActualizado;
  }

  async remove(id: string) {
    const usuarioEliminado = await this.usuarioModel.deleteOne({_id: id});
    return usuarioEliminado;
  }
}
