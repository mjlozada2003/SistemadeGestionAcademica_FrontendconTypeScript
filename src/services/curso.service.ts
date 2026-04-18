import { Curso } from "../models/curso.js";
import { StorageUtil } from "../utils/storage.js";

export class CursoService {
    private cursos: Curso[] = StorageUtil.get<Curso>("cursos");

    getAll(): Curso[] { return this.cursos; }

    add(curso: Curso): void {
        if (this.cursos.some(c => c.sigla === curso.sigla)) throw new Error("Sigla ya registrada");
        this.cursos.push(curso);
        this.save();
    }

    toggleEstado(id: number): void {
        const est = this.cursos.find(e => e.id === id);
        if (est) {
            est.estado = est.estado === "disponible" ? "cerrado" : "disponible";
            this.save();
        }
    }

    delete(id: number): void {
        this.cursos = this.cursos.filter(e => e.id !== id);
        this.save();
    }
    
    update(id: number, updated: Partial<Curso>): void {
        const index = this.cursos.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cursos[index] = { ...this.cursos[index], ...updated };
            this.save();
        }
    }

    private save() { StorageUtil.save("cursos", this.cursos); }
}