import { StorageUtil } from "../utils/storage.js";
export class CursoService {
    constructor() {
        this.cursos = StorageUtil.get("cursos");
    }
    getAll() { return this.cursos; }
    add(curso) {
        if (this.cursos.some(c => c.sigla === curso.sigla))
            throw new Error("Sigla ya registrada");
        this.cursos.push(curso);
        this.save();
    }
    toggleEstado(id) {
        const est = this.cursos.find(e => e.id === id);
        if (est) {
            est.estado = est.estado === "disponible" ? "cerrado" : "disponible";
            this.save();
        }
    }
    delete(id) {
        this.cursos = this.cursos.filter(e => e.id !== id);
        this.save();
    }
    update(id, updated) {
        const index = this.cursos.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cursos[index] = Object.assign(Object.assign({}, this.cursos[index]), updated);
            this.save();
        }
    }
    save() { StorageUtil.save("cursos", this.cursos); }
}
