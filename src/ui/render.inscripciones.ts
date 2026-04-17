import { InscripcionService } from "../services/inscripcion.service";
import { EstudianteService } from "../services/estudiante.service";
import { CursoService } from "../services/curso.service";

export const renderInscripciones = (
    insService: InscripcionService, 
    estService: EstudianteService, 
    curService: CursoService
) => {
    const container = document.getElementById("tabla-inscripciones");
    if (!container) return;

    const inscripciones = insService.getAll();
    const estudiantes = estService.getAll();
    const cursos = curService.getAll();

    container.innerHTML = inscripciones.map(ins => {
        const est = estudiantes.find(e => e.id === ins.estudianteId);
        const cur = cursos.find(c => c.id === ins.cursoId);

        return `
            <tr>
                <td>${ins.fecha}</td>
                <td>${est ? est.nombre : 'No encontrado'}</td>
                <td>${cur ? cur.nombre : 'No encontrado'}</td>
                <td>
                    <span class="badge ${ins.estado === 'activa' ? 'bg-info' : 'bg-warning'}">
                        ${ins.estado}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
};