import { IsDate, IsEmail, IsString } from "class-validator"

export class CreateUsuarioDto {
    @IsString()
    nombre:string

    @IsString()
    apellido:string

    @IsEmail()
    correo:string

    @IsString()
    nick:string

    @IsString()
    pass:string

    @IsString()
    fecha:string

    @IsString()
    descripcion:string
    
    @IsString()
    usuario:string
}
