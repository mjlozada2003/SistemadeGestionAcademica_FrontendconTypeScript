// Importamos el modelo Curso en lugar del Servicio
import { Curso } from "../models/curso.js";

// Ahora la función recibe directamente el arreglo filtrado: Curso[]
export const renderCursos = (cursos: Curso[]) => {
    const container = document.getElementById("tabla-cursos");
    if (!container) return;

    if (cursos.length === 0) {
        container.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay cursos registrados.</td></tr>`;
        return;
    }

    // Usamos directamente "cursos.map" en lugar de "service.getAll().map"
    container.innerHTML = cursos.map(curso => `
        <tr>
            <td>${curso.sigla}</td>
            <td>${curso.nombre}</td>
            <td>${curso.cupoMaximo}</td>
            <td>
                <span class="badge ${curso.estado === 'disponible' ? 'bg-success' : 'bg-danger'}">
                    ${curso.estado}
                </span>
            </td>
            <td>
                <button class="btn-action toggle-curso" data-id="${curso.id}">
                    Alternar Estado
                </button>
                <button class="btn-action bg-danger delete-curso" data-id="${curso.id}">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join("");
};