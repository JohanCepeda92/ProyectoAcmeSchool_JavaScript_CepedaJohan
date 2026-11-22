// ==========================================
// ACME SCHOOL - GESTIÓN DE ALMACENAMIENTO
// ==========================================

// Claves utilizadas en localStorage
const USERS_KEY = "acme_users";
const SESSION_KEY = "acme_session";
const EXAMS_KEY = "acme_exams";

// ==========================================
// OBTENER USUARIOS
// ==========================================

export function getUsers() {

    try {
        const users = localStorage.getItem(USERS_KEY);

        return users ? JSON.parse(users) : [];

    } catch (error) {

        console.error("Error al obtener usuarios:", error);

        return [];
    }
}


// ==========================================
// GUARDAR USUARIOS
// ==========================================

export function saveUsers(users) {

    if (!Array.isArray(users)) {
        throw new TypeError("Los usuarios deben estar en un arreglo.");
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


// ==========================================
// OBTENER SESIÓN ACTUAL
// ==========================================

export function getSession() {

    try {
        const session = localStorage.getItem(SESSION_KEY);

        return session ? JSON.parse(session) : null;

    } catch (error) {

        console.error("Error al obtener la sesión:", error);

        return null;
    }
}


// ==========================================
// GUARDAR SESIÓN
// ==========================================

export function saveSession(user) {

    const { password, ...sessionUser } = user;

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
}


// ==========================================
// CERRAR SESIÓN
// ==========================================

export function clearSession() {

    localStorage.removeItem(SESSION_KEY);
}


// ==========================================
// CREAR USUARIO ADMINISTRADOR INICIAL
// ==========================================

export function initializeDefaultUser() {

    const users = getUsers();

    // Evitar duplicar el administrador
    if (users.length > 0) {
        return;
    }

    const defaultAdmin = {

        id: Date.now(),

        identification: "1000000000",

        fullName: "Administrador Acme",

        email: "admin@acmeschool.com",

        phone: "3000000000",

        position: "Administrativo",

        password: "Acme2026*"

    };

    saveUsers([defaultAdmin]);
}

// ==========================================
// OBTENER EXÁMENES
// ==========================================

export function getExams() {

    try {

        const exams = localStorage.getItem(EXAMS_KEY);

        return exams ? JSON.parse(exams) : [];

    } catch (error) {

        console.error("Error al obtener exámenes:", error);

        return [];

    }

}


// ==========================================
// GUARDAR EXÁMENES
// ==========================================

export function saveExams(exams) {

    if (!Array.isArray(exams)) {

        throw new TypeError("Los exámenes deben estar en un arreglo.");

    }

    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));

}