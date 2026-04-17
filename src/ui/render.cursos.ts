import { CursoService } from "../services/curso.service";

export const renderCursos = (service: CursoService) => {
    const container = document.getElementById("tabla-cursos");
    if (!container) return;

    const lista = service.getAll();
    container.innerHTML = lista.map(curso => `
        <tr>
            <td>${curso.sigla}</td>
            <td>${curso.nombre}</td>
            <td>${curso.docente}</td>
            <td>${curso.cupoMaximo}</td>
            <td>
                <span class="badge ${curso.estado === 'disponible' ? 'bg-success' : 'bg-danger'}">
                    ${curso.estado}
                </span>
            </td>
            <td>
                <button class="btn-action" onclick="window.cambiarEstadoCurso(${curso.id})">
                    Alternar Estado
                </button>
            </td>
        </tr>
    `).join("");
};