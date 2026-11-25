// ==========================================
// ACME SCHOOL - MÓDULO DE AUTENTICACIÓN
// ==========================================

// Importar funciones de almacenamiento
import {
    getUsers,
    saveSession,
    clearSession,
    getSession
} from "../utils/storage.js";

const ROLE_PERMISSIONS = {
    Administrativo: ["dashboard", "manage-users", "manage-exams", "manage-questions"],
    Docente: ["dashboard", "manage-exams", "manage-questions"]
};

export function hasPermission(user, permission) {
    if (!user || !Array.isArray(ROLE_PERMISSIONS[user.position])) {
        return false;
    }

    return ROLE_PERMISSIONS[user.position].includes(permission);
}


// ==========================================
// INICIAR SESIÓN
// ==========================================

export function login(email, password) {

    // Obtener usuarios registrados
    const users = getUsers();

    // Normalizar el correo electrónico
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario con credenciales coincidentes
    const user = users.find(user =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password
    );

    // Validar credenciales
    if (!user) {

        return {
            success: false,
            message: "Correo electrónico o contraseña incorrectos."
        };

    }

    // Guardar sesión
    saveSession(user);

    // Preparar información del usuario
    const { password: userPassword, ...sessionUser } = user;

    return {
        success: true,
        message: "Inicio de sesión exitoso.",
        user: sessionUser
    };

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

export function logout() {

    clearSession();

}


// ==========================================
// OBTENER USUARIO ACTUAL
// ==========================================

export function getCurrentUser() {

    const session = getSession();

    if (!session) {

        return null;

    }

    // La sesión solo es válida mientras exista su usuario en el registro actual.
    const user = getUsers().find(registeredUser =>

        String(registeredUser.id) === String(session.id)

    );

    if (!user) {

        clearSession();

        return null;

    }

    // Devolver los datos actuales del usuario, sin exponer su contraseña.
    const { password: userPassword, ...currentUser } = user;

    return currentUser;

}


// ==========================================
// VERIFICAR AUTENTICACIÓN
// ==========================================

export function isAuthenticated() {

    return Boolean(getCurrentUser());

}
