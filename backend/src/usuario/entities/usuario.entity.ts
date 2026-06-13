import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo: string;

  @Prop({ required: true, unique: true, trim: true })
  nick: string;

  // Siempre guardada hasheada con bcrypt, nunca en texto plano.
  // select: false -> no viaja en los find() salvo que se pida explícitamente
  @Prop({ required: true, select: false })
  pass: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ default: '' })
  descripcion: string;

  // URL de la imagen guardada en /uploads/perfiles
  //@Prop({ default: null })
  //imagenPerfil: string | null;

  // Por defecto "usuario", se puede cambiar a "administrador"
  @Prop({ enum: ['usuario', 'administrador'], default: 'usuario' })
  usuario: string;

  // Para la baja lógica de sprints futuros
  @Prop({ default: true })
  activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)

//nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve.

