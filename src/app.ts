import { EstudianteService } from "./services/estudiante.service";
import { CursoService } from "./services/curso.service";
import { InscripcionService } from "./services/inscripcion.service";
import { renderEstudiantes } from "./ui/render.estudiantes";

const estService = new EstudianteService();
const curService = new CursoService();
const insService = new InscripcionService(estService, curService);

const updateStats = () => {
    document.getElementById("stat-est")!.innerText = estService.getAll().length.toString();
};

document.getElementById("est-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        estService.add({
            id: Date.now(),
            nombre: (document.getElementById("est-nombre") as HTMLInputElement).value,
            correo: (document.getElementById("est-correo") as HTMLInputElement).value,
            edad: parseInt((document.getElementById("est-edad") as HTMLInputElement).value),
            carrera: (document.getElementById("est-carrera") as HTMLInputElement).value,
            estado: "activo"
        });
        renderEstudiantes(estService);
        updateStats();
    } catch (err: any) { alert(err.message); }
});

// Inicialización
renderEstudiantes(estService);
updateStats();