export class StorageUtil {
    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}
