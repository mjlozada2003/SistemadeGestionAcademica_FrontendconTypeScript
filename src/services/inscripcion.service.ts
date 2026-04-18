import { Inscripcion } from "../models/inscripcion.js";
import { EstudianteService } from "./estudiante.service.js";
import { CursoService } from "./curso.service.js";
import { StorageUtil } from "../utils/storage.js";

export class InscripcionService {
    private inscripciones: Inscripcion[] = StorageUtil.get<Inscripcion>("inscripciones");

    constructor(private estService: EstudianteService, private cursoService: CursoService) {}

    getAll() { return this.inscripciones; }

    inscribir(estId: number, curId: number): void {
        const est = this.estService.getAll().find(e => e.id === estId);
        const cur = this.cursoService.getAll().find(c => c.id === curId);

        if (!est || est.estado === "inactivo") throw new Error("Estudiante inactivo");
        if (!cur || cur.estado === "cerrado") throw new Error("Curso cerrado");
        
        const inscritos = this.inscripciones.filter(i => i.cursoId === curId).length;
        if (inscritos >= cur.cupoMaximo) throw new Error("Cupo lleno");

        if (this.inscripciones.some(i => i.estudianteId === estId && i.cursoId === curId)) 
            throw new Error("Ya está inscrito");

        this.inscripciones.push({
            id: Date.now(), estudianteId: estId, cursoId: curId,
            fecha: new Date().toLocaleDateString(), estado: "activa"
        });
        StorageUtil.save("inscripciones", this.inscripciones);
    }
}