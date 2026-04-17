export type EstadoEstudiante = "activo" | "inactivo";

export interface Estudiante {
    id: number;
    nombre: string;
    correo: string;
    edad: number;
    carrera: string;
    estado: EstadoEstudiante;
}