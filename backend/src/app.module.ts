import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { UsuarioModule } from './usuario/usuario.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    PublicacionesModule,
    AutenticacionModule,
    UsuarioModule,
],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
