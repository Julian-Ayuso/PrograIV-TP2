import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { Usuario, UsuarioSchema } from '../usuario/entities/usuario.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])],
  controllers: [AutenticacionController],
  providers: [AutenticacionService]
})
export class AutenticacionModule {}
