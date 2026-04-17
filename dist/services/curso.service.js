import { StorageUtil } from "../utils/storage";
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
    save() { StorageUtil.save("cursos", this.cursos); }
}
