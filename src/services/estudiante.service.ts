import { Estudiante } from "../models/estudiante";
import { StorageUtil } from "../utils/storage";

export class EstudianteService {
    private estudiantes: Estudiante[] = StorageUtil.get<Estudiante>("estudiantes");

    getAll(): Estudiante[] { return this.estudiantes; }

    add(est: Estudiante): void {
        if (this.estudiantes.some(e => e.correo === est.correo)) throw new Error("Correo ya registrado");
        this.estudiantes.push(est);
        this.save();
    }

    update(id: number, updated: Partial<Estudiante>): void {
        const index = this.estudiantes.findIndex(e => e.id === id);
        if (index !== -1) {
            this.estudiantes[index] = { ...this.estudiantes[index], ...updated };
            this.save();
        }
    }

    delete(id: number): void {
        this.estudiantes = this.estudiantes.filter(e => e.id !== id);
        this.save();
    }

    private save() { StorageUtil.save("estudiantes", this.estudiantes); }
}