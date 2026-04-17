import { StorageUtil } from "../utils/storage";
export class EstudianteService {
    constructor() {
        this.estudiantes = StorageUtil.get("estudiantes");
    }
    getAll() { return this.estudiantes; }
    add(est) {
        if (this.estudiantes.some(e => e.correo === est.correo))
            throw new Error("Correo ya registrado");
        this.estudiantes.push(est);
        this.save();
    }
    update(id, updated) {
        const index = this.estudiantes.findIndex(e => e.id === id);
        if (index !== -1) {
            this.estudiantes[index] = Object.assign(Object.assign({}, this.estudiantes[index]), updated);
            this.save();
        }
    }
    delete(id) {
        this.estudiantes = this.estudiantes.filter(e => e.id !== id);
        this.save();
    }
    save() { StorageUtil.save("estudiantes", this.estudiantes); }
}
