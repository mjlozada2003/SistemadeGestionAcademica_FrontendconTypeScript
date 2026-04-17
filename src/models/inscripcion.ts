export interface Inscripcion {
    id: number;
    estudianteId: number;
    cursoId: number;
    fecha: string;
    estado: "activa" | "cancelada";
}