// Ahora recibe un arreglo de estudiantes directamente para soportar los filtros
export const renderEstudiantes = (estudiantes) => {
    const container = document.getElementById("tabla-estudiantes");
    container.innerHTML = estudiantes.map(e => `
        <tr>
            <td>${e.nombre}</td>
            <td>${e.correo}</td>
            <td>${e.carrera}</td>
            <td><span class="badge ${e.estado === 'activo' ? 'bg-success' : 'bg-danger'}">${e.estado}</span></td>
            <td>
                <button class="btn-action edit-est" data-id="${e.id}">Editar</button>
                <button class="btn-action toggle-est" data-id="${e.id}">Estado</button>
                <button class="btn-action bg-danger delete-est" data-id="${e.id}">Eliminar</button>
            </td>
        </tr>
    `).join("");
};
