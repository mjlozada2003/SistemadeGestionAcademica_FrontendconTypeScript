export class Validators {
    static isEmailValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    static isNotEmpty(value: string | number): boolean {
        return value.toString().trim() !== "";
    }
}