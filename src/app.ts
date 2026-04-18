import { EstudianteService } from "./services/estudiante.service.js";
import { CursoService } from "./services/curso.service.js";
import { InscripcionService } from "./services/inscripcion.service.js";
import { renderEstudiantes } from "./ui/render.estudiantes.js";
import { renderCursos } from "./ui/render.cursos.js";
import { renderInscripciones } from "./ui/render.inscripciones.js";

const estService = new EstudianteService();
const curService = new CursoService();
const insService = new InscripcionService(estService, curService);

// ==========================================
// 6. ESTADÍSTICAS AVANZADAS
// ==========================================
const updateStats = () => {
    const estudiantes = estService.getAll();
    const cursos = curService.getAll();
    const inscripciones = insService.getAll();

    document.getElementById("stat-est")!.innerText = estudiantes.length.toString();
    document.getElementById("stat-est-activos")!.innerText = estudiantes.filter(e => e.estado === "activo").length.toString();
    document.getElementById("stat-cur")!.innerText = cursos.length.toString();
    document.getElementById("stat-cur-cerrados")!.innerText = cursos.filter(c => c.estado === "cerrado").length.toString();
    document.getElementById("stat-ins")!.innerText = inscripciones.length.toString();

    // Calcular curso con más estudiantes
    if (inscripciones.length > 0) {
        const conteo: Record<number, number> = {};
        inscripciones.forEach(i => conteo[i.cursoId] = (conteo[i.cursoId] || 0) + 1);
        const topCursoId = parseInt(Object.keys(conteo).reduce((a, b) => conteo[parseInt(a)] > conteo[parseInt(b)] ? a : b));
        const cursoTop = cursos.find(c => c.id === topCursoId);
        document.getElementById("stat-top-cur")!.innerText = cursoTop ? cursoTop.nombre : "-";
    } else {
        document.getElementById("stat-top-cur")!.innerText = "-";
    }
};

// ==========================================
// 5. BÚSQUEDA Y FILTROS
// ==========================================
const renderAll = () => {
    // Filtros Estudiantes
    const nombreFiltroEst = (document.getElementById("filtro-est-nombre") as HTMLInputElement).value.toLowerCase();
    const estadoFiltroEst = (document.getElementById("filtro-est-estado") as HTMLSelectElement).value;
    
    let estudiantesFiltrados = estService.getAll().filter(e => e.nombre.toLowerCase().includes(nombreFiltroEst));
    if (estadoFiltroEst !== "todos") estudiantesFiltrados = estudiantesFiltrados.filter(e => e.estado === estadoFiltroEst);
    renderEstudiantes(estudiantesFiltrados);

    // Filtros Cursos
    const nombreFiltroCur = (document.getElementById("filtro-cur-nombre") as HTMLInputElement).value.toLowerCase();
    const estadoFiltroCur = (document.getElementById("filtro-cur-estado") as HTMLSelectElement).value;
    
    let cursosFiltrados = curService.getAll().filter(c => c.nombre.toLowerCase().includes(nombreFiltroCur) || c.sigla.toLowerCase().includes(nombreFiltroCur));
    if (estadoFiltroCur !== "todos") cursosFiltrados = cursosFiltrados.filter(c => c.estado === estadoFiltroCur);
    renderCursos(cursosFiltrados);

    // Obtener los datos puros
    const inscripcionesData = insService.getAll();
    const estudiantesData = estService.getAll();
    const cursosData = curService.getAll();

    // Renderizar la tabla pasando los arreglos
    renderInscripciones(inscripcionesData, estudiantesData, cursosData);

    updateStats();
    cargarSelects();
};

document.getElementById("filtro-est-nombre")?.addEventListener("input", renderAll);
document.getElementById("filtro-est-estado")?.addEventListener("change", renderAll);
document.getElementById("filtro-cur-nombre")?.addEventListener("input", renderAll);
document.getElementById("filtro-cur-estado")?.addEventListener("change", renderAll);

// ==========================================
// 1 y 2. GUARDAR / EDITAR (ESTUDIANTES Y CURSOS)
// ==========================================
document.getElementById("est-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        const idInput = (document.getElementById("est-id") as HTMLInputElement).value;
        const estData = {
            id: idInput ? parseInt(idInput) : Date.now(),
            nombre: (document.getElementById("est-nombre") as HTMLInputElement).value,
            correo: (document.getElementById("est-correo") as HTMLInputElement).value,
            edad: parseInt((document.getElementById("est-edad") as HTMLInputElement).value),
            carrera: (document.getElementById("est-carrera") as HTMLInputElement).value,
            estado: "activo" as const
        };

        if (idInput) estService.update(parseInt(idInput), estData); // EDITAR
        else estService.add(estData); // REGISTRAR

        (e.target as HTMLFormElement).reset();
        (document.getElementById("est-id") as HTMLInputElement).value = ""; 
        renderAll();
    } catch (err: any) { alert(err.message); }
});

// Delegación de eventos para la tabla estudiantes (Editar, Estado, Eliminar)
document.getElementById("tabla-estudiantes")?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const id = Number(target.getAttribute("data-id"));

    if (target.classList.contains("delete-est")) {
        estService.delete(id);
        renderAll();
    } else if (target.classList.contains("toggle-est")) {
        estService.toggleEstado(id);
        renderAll();
    } else if (target.classList.contains("edit-est")) {
        const est = estService.getAll().find(e => e.id === id);
        if (est) {
            (document.getElementById("est-id") as HTMLInputElement).value = est.id.toString();
            (document.getElementById("est-nombre") as HTMLInputElement).value = est.nombre;
            (document.getElementById("est-correo") as HTMLInputElement).value = est.correo;
            (document.getElementById("est-edad") as HTMLInputElement).value = est.edad.toString();
            (document.getElementById("est-carrera") as HTMLInputElement).value = est.carrera;
        }
    }
});

// ==========================================
// GUARDAR / EDITAR CURSOS (Lo que faltaba)
// ==========================================
document.getElementById("cur-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        const idInput = (document.getElementById("cur-id") as HTMLInputElement).value;
        const curData = {
            id: idInput ? parseInt(idInput) : Date.now(),
            nombre: (document.getElementById("cur-nombre") as HTMLInputElement).value,
            sigla: (document.getElementById("cur-sigla") as HTMLInputElement).value,
            docente: (document.getElementById("cur-docente") as HTMLInputElement).value,
            cupoMaximo: parseInt((document.getElementById("cur-cupo") as HTMLInputElement).value),
            estado: "disponible" as const
        };

        // Si hay un ID, asume que es una edición (requiere que tengas el método update en CursoService)
        // Si no tienes método update en CursoService, elimina el if y deja solo curService.add(curData);
        if (idInput) {
            // curService.update(parseInt(idInput), curData); // Descomenta si tienes método editar
        } else {
            curService.add(curData); // REGISTRAR NUEVO
        }

        (e.target as HTMLFormElement).reset();
        (document.getElementById("cur-id") as HTMLInputElement).value = "";
        
        renderAll(); // Esto actualizará las tablas, selects y estadísticas automáticamente
    } catch (err: any) { 
        alert(err.message); // Por si la sigla está duplicada
    }
});

// Delegación de eventos para la tabla cursos (Estado, Eliminar)
document.getElementById("tabla-cursos")?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const id = Number(target.getAttribute("data-id"));

    if (target.classList.contains("delete-curso")) {
        curService.delete(id);
        renderAll();
    } else if (target.classList.contains("toggle-curso")) {
        curService.toggleEstado(id);
        renderAll();
    }
});

// ==========================================
// 3. GESTIÓN DE INSCRIPCIONES
// ==========================================
const cargarSelects = () => {
    const selEst = document.getElementById("ins-estudiante")!;
    const selCur = document.getElementById("ins-curso")!;
    const relCur = document.getElementById("rel-curso-select")!;
    const relEst = document.getElementById("rel-est-select")!;

    const estOptions = estService.getAll().map(e => `<option value="${e.id}">${e.nombre} (${e.estado})</option>`).join("");
    const curOptions = curService.getAll().map(c => `<option value="${c.id}">${c.nombre} (${c.estado})</option>`).join("");

    selEst.innerHTML = `<option value="">Seleccione Estudiante...</option>` + estOptions;
    selCur.innerHTML = `<option value="">Seleccione Curso...</option>` + curOptions;
    relEst.innerHTML = `<option value="">Seleccione Estudiante...</option>` + estOptions;
    relCur.innerHTML = `<option value="">Seleccione Curso...</option>` + curOptions;
};

document.getElementById("ins-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        const estId = parseInt((document.getElementById("ins-estudiante") as HTMLSelectElement).value);
        const curId = parseInt((document.getElementById("ins-curso") as HTMLSelectElement).value);
        insService.inscribir(estId, curId); // Aquí se validan cupos y estados cerrados automáticamente
        renderAll();
    } catch (err: any) {
        alert("Error de inscripción: " + err.message);
    }
});



// ==========================================
// 4. VISUALIZACIÓN DE RELACIONES
// ==========================================
document.getElementById("rel-curso-select")?.addEventListener("change", (e) => {
    const curId = parseInt((e.target as HTMLSelectElement).value);
    const lista = document.getElementById("rel-curso-lista")!;
    const inscritos = insService.getAll().filter(i => i.cursoId === curId);
    
    lista.innerHTML = inscritos.map(i => {
        const est = estService.getAll().find(e => e.id === i.estudianteId);
        return `<li>${est ? est.nombre : 'Desconocido'}</li>`;
    }).join("") || "<li>No hay estudiantes inscritos en este curso.</li>";
});

document.getElementById("rel-est-select")?.addEventListener("change", (e) => {
    const estId = parseInt((e.target as HTMLSelectElement).value);
    const lista = document.getElementById("rel-est-lista")!;
    const misCursos = insService.getAll().filter(i => i.estudianteId === estId);
    
    lista.innerHTML = misCursos.map(i => {
        const cur = curService.getAll().find(c => c.id === i.cursoId);
        return `<li>${cur ? cur.nombre : 'Desconocido'}</li>`;
    }).join("") || "<li>El estudiante no está en ningún curso.</li>";
});

// ==========================================
// LÓGICA DE PESTAÑAS (UI)
// ==========================================
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tab-content, .tab-btn").forEach(el => el.classList.remove("active"));
        const target = (e.target as HTMLElement).getAttribute("data-target");
        document.getElementById(`tab-${target}`)?.classList.add("active");
        (e.target as HTMLElement).classList.add("active");
    });
});

// Inicio
renderAll();