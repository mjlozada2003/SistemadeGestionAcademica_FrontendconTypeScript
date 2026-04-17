import { Curso } from "../models/curso";
import { StorageUtil } from "../utils/storage";

export class CursoService {
    private cursos: Curso[] = StorageUtil.get<Curso>("cursos");

    getAll(): Curso[] { return this.cursos; }

    add(curso: Curso): void {
        if (this.cursos.some(c => c.sigla === curso.sigla)) throw new Error("Sigla ya registrada");
        this.cursos.push(curso);
        this.save();
    }

    private save() { StorageUtil.save("cursos", this.cursos); }
}