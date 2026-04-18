export const renderInscripciones = (inscripciones, estudiantes, cursos) => {
    const container = document.getElementById("tabla-inscripciones");
    if (!container)
        return;
    if (inscripciones.length === 0) {
        container.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay inscripciones registradas.</td></tr>`;
        return;
    }
    container.innerHTML = inscripciones.map(ins => {
        // Buscamos los datos cruzados directamente en los arreglos que recibimos
        const est = estudiantes.find(e => e.id === ins.estudianteId);
        const cur = cursos.find(c => c.id === ins.cursoId);
        return `
            <tr>
                <td>${ins.fecha}</td>
                <td>
                    <strong>${est ? est.nombre : 'Estudiante eliminado/no encontrado'}</strong><br>
                    <small>${est ? est.correo : ''}</small>
                </td>
                <td>
                    <strong>${cur ? cur.nombre : 'Curso eliminado/no encontrado'}</strong><br>
                    <small>${cur ? cur.sigla : ''}</small>
                </td>
                <td>
                    <span class="badge ${ins.estado === 'activa' ? 'bg-info' : 'bg-warning'}">
                        ${ins.estado}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
};
