import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Usuario {
    @Prop({required:'true', default:'nombre'})
    nombre:string

    @Prop({required:'true', default:'apellido'})
    apellido:string

    @Prop({required:'true', default:'mail'})
    correo:string
    
    @Prop({required:'true', default:'nick'})
    nick:string

    @Prop({required:'true', default:'contraseña'})
    pass:string

    @Prop({required:'true', default:'Fecha de nacimiento'})
    fecha:string

    @Prop({required:'true', default:'Breve descripción'})
    descripcion:string

    @Prop({required:'true', default:'usuario'})
    usuario:string
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)

//nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve.