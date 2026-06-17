import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema({ timestamps: true }) // crea createdAt / updatedAt automáticamente
export class Publicacion {
  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, trim: true })
  descripcion: string;

  // URL de la imagen, opcional. Se guarda en /uploads/publicaciones
  @Prop({ type: String, default: null })
  imagen: string | null;

  // Relación con el usuario que la creó. ref: 'Usuario' debe coincidir
  // con el nombre del modelo registrado (tu clase se llama Usuario).
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  autor: Types.ObjectId;

  // Ids de los usuarios que dieron me gusta.
  // El array es la fuente de verdad: con él garantizamos "un solo me gusta
  // por usuario" y sabemos quién lo dio (para poder quitarlo).
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  meGusta: Types.ObjectId[];

  // Contador derivado de meGusta.length. Lo guardamos aparte SOLO para poder
  // ordenar por cantidad de me gusta con un find().sort() simple, sin
  // aggregation. Siempre se recalcula desde el array, así que nunca se
  // desincroniza.
  @Prop({ default: 0 })
  cantidadMeGusta: number;

  // Baja lógica: nunca borramos, marcamos activo=false
  @Prop({ default: true })
  activo: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
