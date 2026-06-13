import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: Usuario.name, schema: UsuarioSchema}])],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
