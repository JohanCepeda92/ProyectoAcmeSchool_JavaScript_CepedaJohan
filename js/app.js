// Importar Web Components
import "./components/app-header.js";
import "./components/app-sidebar.js";

// ==========================================
// ACME SCHOOL - APLICACIÓN PRINCIPAL
// ==========================================

import { initializeDefaultUser } from "./utils/storage.js";

import {
    login,
    logout,
    isAuthenticated,
    getCurrentUser
} from "./modules/auth.js";


// ==========================================
// INICIALIZAR APLICACIÓN
// ==========================================

function initializeApp() {

    initializeDefaultUser();

    const currentPage = window.location.pathname.split("/").pop();

    const loginForm = document.getElementById("login-form");


    // PROTEGER DASHBOARD

    if (currentPage === "dashboard.html") {

        if (!isAuthenticated()) {

            window.location.replace("index.html");
            return;

        }

// Obtener información del usuario
const user = getCurrentUser();

// Actualizar encabezado
const appHeader = document.querySelector("app-header");

if (user && appHeader) {

    appHeader.setAttribute("user-name", user.fullName);

    appHeader.setAttribute("user-role", user.position);

}

// Escuchar evento de cierre de sesión
const appSidebar = document.querySelector("app-sidebar");

if (appSidebar) {

    appSidebar.addEventListener("logout", handleLogout);

}

        return;

    }


    // INICIALIZAR LOGIN

    if (loginForm) {

        if (isAuthenticated()) {

            window.location.replace("dashboard.html");
            return;

        }

        loginForm.addEventListener("submit", handleLogin);

    }

}


// ==========================================
// INICIAR SESIÓN
// ==========================================

function handleLogin(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const message = document.getElementById("login-message");

    const result = login(email, password);

    if (!result.success) {

        message.textContent = result.message;

        return;

    }

    window.location.href = "dashboard.html";

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

function handleLogout() {

    logout();

    window.location.replace("index.html");

}


// ==========================================
// EJECUTAR APLICACIÓN
// ==========================================

initializeApp();