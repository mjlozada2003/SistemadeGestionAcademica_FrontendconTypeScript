import { EstudianteService } from "../services/estudiante.service";

export const renderEstudiantes = (service: EstudianteService) => {
    const container = document.getElementById("tabla-estudiantes")!;
    container.innerHTML = service.getAll().map(e => `
        <tr>
            <td>${e.nombre}</td>
            <td>${e.correo}</td>
            <td>${e.estado}</td>
            <td><button onclick="window.eliminarEst(${e.id})">Eliminar</button></td>
        </tr>
    `).join("");
};