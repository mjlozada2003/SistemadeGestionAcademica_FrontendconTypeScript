export class StorageUtil {
    static save(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static get<T>(key: string): T[] {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}