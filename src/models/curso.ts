export type EstadoCurso = "disponible" | "cerrado";

export interface Curso {
    id: number;
    nombre: string;
    sigla: string;
    docente: string;
    cupoMaximo: number;
    estado: EstadoCurso;
}