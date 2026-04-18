export class Validators {
    static isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    static isNotEmpty(value) {
        return value.toString().trim() !== "";
    }
    static isPositiveNumber(value) {
        return value > 0;
    }
}
