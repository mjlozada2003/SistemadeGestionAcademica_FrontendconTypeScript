var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
    document.getElementById("stat-est").innerText = estudiantes.length.toString();
    document.getElementById("stat-est-activos").innerText = estudiantes.filter(e => e.estado === "activo").length.toString();
    document.getElementById("stat-cur").innerText = cursos.length.toString();
    document.getElementById("stat-cur-cerrados").innerText = cursos.filter(c => c.estado === "cerrado").length.toString();
    document.getElementById("stat-ins").innerText = inscripciones.length.toString();
    // Calcular curso con más estudiantes
    if (inscripciones.length > 0) {
        const conteo = {};
        inscripciones.forEach(i => conteo[i.cursoId] = (conteo[i.cursoId] || 0) + 1);
        const topCursoId = parseInt(Object.keys(conteo).reduce((a, b) => conteo[parseInt(a)] > conteo[parseInt(b)] ? a : b));
        const cursoTop = cursos.find(c => c.id === topCursoId);
        document.getElementById("stat-top-cur").innerText = cursoTop ? cursoTop.nombre : "-";
    }
    else {
        document.getElementById("stat-top-cur").innerText = "-";
    }
};
// ==========================================
// 5. BÚSQUEDA Y FILTROS
// ==========================================
const renderAll = () => {
    // Filtros Estudiantes
    const nombreFiltroEst = document.getElementById("filtro-est-nombre").value.toLowerCase();
    const estadoFiltroEst = document.getElementById("filtro-est-estado").value;
    let estudiantesFiltrados = estService.getAll().filter(e => e.nombre.toLowerCase().includes(nombreFiltroEst));
    if (estadoFiltroEst !== "todos")
        estudiantesFiltrados = estudiantesFiltrados.filter(e => e.estado === estadoFiltroEst);
    renderEstudiantes(estudiantesFiltrados);
    // Filtros Cursos
    const nombreFiltroCur = document.getElementById("filtro-cur-nombre").value.toLowerCase();
    const estadoFiltroCur = document.getElementById("filtro-cur-estado").value;
    let cursosFiltrados = curService.getAll().filter(c => c.nombre.toLowerCase().includes(nombreFiltroCur) || c.sigla.toLowerCase().includes(nombreFiltroCur));
    if (estadoFiltroCur !== "todos")
        cursosFiltrados = cursosFiltrados.filter(c => c.estado === estadoFiltroCur);
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
(_a = document.getElementById("filtro-est-nombre")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", renderAll);
(_b = document.getElementById("filtro-est-estado")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", renderAll);
(_c = document.getElementById("filtro-cur-nombre")) === null || _c === void 0 ? void 0 : _c.addEventListener("input", renderAll);
(_d = document.getElementById("filtro-cur-estado")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", renderAll);
// ==========================================
// 1 y 2. GUARDAR / EDITAR (ESTUDIANTES Y CURSOS)
// ==========================================
(_e = document.getElementById("est-form")) === null || _e === void 0 ? void 0 : _e.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        const idInput = document.getElementById("est-id").value;
        const estData = {
            id: idInput ? parseInt(idInput) : Date.now(),
            nombre: document.getElementById("est-nombre").value,
            correo: document.getElementById("est-correo").value,
            edad: parseInt(document.getElementById("est-edad").value),
            carrera: document.getElementById("est-carrera").value,
            estado: "activo"
        };
        if (idInput)
            estService.update(parseInt(idInput), estData); // EDITAR
        else
            estService.add(estData); // REGISTRAR
        e.target.reset();
        document.getElementById("est-id").value = "";
        renderAll();
    }
    catch (err) {
        alert(err.message);
    }
});
// Delegación de eventos para la tabla estudiantes (Editar, Estado, Eliminar)
(_f = document.getElementById("tabla-estudiantes")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", (e) => {
    const target = e.target;
    const id = Number(target.getAttribute("data-id"));
    if (target.classList.contains("delete-est")) {
        estService.delete(id);
        renderAll();
    }
    else if (target.classList.contains("toggle-est")) {
        estService.toggleEstado(id);
        renderAll();
    }
    else if (target.classList.contains("edit-est")) {
        const est = estService.getAll().find(e => e.id === id);
        if (est) {
            document.getElementById("est-id").value = est.id.toString();
            document.getElementById("est-nombre").value = est.nombre;
            document.getElementById("est-correo").value = est.correo;
            document.getElementById("est-edad").value = est.edad.toString();
            document.getElementById("est-carrera").value = est.carrera;
        }
    }
});
// ==========================================
// GUARDAR / EDITAR CURSOS (Lo que faltaba)
// ==========================================
(_g = document.getElementById("cur-form")) === null || _g === void 0 ? void 0 : _g.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        const idInput = document.getElementById("cur-id").value;
        const curData = {
            id: idInput ? parseInt(idInput) : Date.now(),
            nombre: document.getElementById("cur-nombre").value,
            sigla: document.getElementById("cur-sigla").value,
            docente: document.getElementById("cur-docente").value,
            cupoMaximo: parseInt(document.getElementById("cur-cupo").value),
            estado: "disponible"
        };
        // Si hay un ID, asume que es una edición (requiere que tengas el método update en CursoService)
        // Si no tienes método update en CursoService, elimina el if y deja solo curService.add(curData);
        if (idInput) {
            // curService.update(parseInt(idInput), curData); // Descomenta si tienes método editar
        }
        else {
            curService.add(curData); // REGISTRAR NUEVO
        }
        e.target.reset();
        document.getElementById("cur-id").value = "";
        renderAll(); // Esto actualizará las tablas, selects y estadísticas automáticamente
    }
    catch (err) {
        alert(err.message); // Por si la sigla está duplicada
    }
});
// Delegación de eventos para la tabla cursos (Estado, Eliminar)
(_h = document.getElementById("tabla-cursos")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", (e) => {
    const target = e.target;
    const id = Number(target.getAttribute("data-id"));
    if (target.classList.contains("delete-curso")) {
        curService.delete(id);
        renderAll();
    }
    else if (target.classList.contains("toggle-curso")) {
        curService.toggleEstado(id);
        renderAll();
    }
});
// ==========================================
// 3. GESTIÓN DE INSCRIPCIONES
// ==========================================
const cargarSelects = () => {
    const selEst = document.getElementById("ins-estudiante");
    const selCur = document.getElementById("ins-curso");
    const relCur = document.getElementById("rel-curso-select");
    const relEst = document.getElementById("rel-est-select");
    const estOptions = estService.getAll().map(e => `<option value="${e.id}">${e.nombre} (${e.estado})</option>`).join("");
    const curOptions = curService.getAll().map(c => `<option value="${c.id}">${c.nombre} (${c.estado})</option>`).join("");
    selEst.innerHTML = `<option value="">Seleccione Estudiante...</option>` + estOptions;
    selCur.innerHTML = `<option value="">Seleccione Curso...</option>` + curOptions;
    relEst.innerHTML = `<option value="">Seleccione Estudiante...</option>` + estOptions;
    relCur.innerHTML = `<option value="">Seleccione Curso...</option>` + curOptions;
};
(_j = document.getElementById("ins-form")) === null || _j === void 0 ? void 0 : _j.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
        const estId = parseInt(document.getElementById("ins-estudiante").value);
        const curId = parseInt(document.getElementById("ins-curso").value);
        insService.inscribir(estId, curId); // Aquí se validan cupos y estados cerrados automáticamente
        renderAll();
    }
    catch (err) {
        alert("Error de inscripción: " + err.message);
    }
});
// ==========================================
// 4. VISUALIZACIÓN DE RELACIONES
// ==========================================
(_k = document.getElementById("rel-curso-select")) === null || _k === void 0 ? void 0 : _k.addEventListener("change", (e) => {
    const curId = parseInt(e.target.value);
    const lista = document.getElementById("rel-curso-lista");
    const inscritos = insService.getAll().filter(i => i.cursoId === curId);
    lista.innerHTML = inscritos.map(i => {
        const est = estService.getAll().find(e => e.id === i.estudianteId);
        return `<li>${est ? est.nombre : 'Desconocido'}</li>`;
    }).join("") || "<li>No hay estudiantes inscritos en este curso.</li>";
});
(_l = document.getElementById("rel-est-select")) === null || _l === void 0 ? void 0 : _l.addEventListener("change", (e) => {
    const estId = parseInt(e.target.value);
    const lista = document.getElementById("rel-est-lista");
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
        var _a;
        document.querySelectorAll(".tab-content, .tab-btn").forEach(el => el.classList.remove("active"));
        const target = e.target.getAttribute("data-target");
        (_a = document.getElementById(`tab-${target}`)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
        e.target.classList.add("active");
    });
});
// Inicio
renderAll();
