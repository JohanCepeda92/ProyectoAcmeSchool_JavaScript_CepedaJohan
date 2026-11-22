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

    return getSession();

}


// ==========================================
// VERIFICAR AUTENTICACIÓN
// ==========================================

export function isAuthenticated() {

    return Boolean(getSession());

}