var _a;
import { EstudianteService } from "./services/estudiante.service";
import { CursoService } from "./services/curso.service";
import { InscripcionService } from "./services/inscripcion.service";
import { renderEstudiantes } from "./ui/render.estudiantes";
const estService = new EstudianteService();
const curService = new CursoService();
const insService = new InscripcionService(estService, curService);
const updateStats = () => {
    document.getElementById("stat-est").innerText = estService.getAll().length.toString();
};
(_a = document.getElementById("est-form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        estService.add({
            id: Date.now(),
            nombre: document.getElementById("est-nombre").value,
            correo: document.getElementById("est-correo").value,
            edad: parseInt(document.getElementById("est-edad").value),
            carrera: document.getElementById("est-carrera").value,
            estado: "activo"
        });
        renderEstudiantes(estService);
        updateStats();
    }
    catch (err) {
        alert(err.message);
    }
});
// Inicialización
renderEstudiantes(estService);
updateStats();
