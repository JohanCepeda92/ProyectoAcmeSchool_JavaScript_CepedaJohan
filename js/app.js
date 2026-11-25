// Importar Web Components
import "./components/app-header.js";
import "./components/app-sidebar.js";
import "./components/stat-card.js";
import { initializeUsersModule } from "./modules/users.js";
import { initializeExamsModule } from "./modules/exams.js";
import { initializeQuestionsModule } from "./modules/questions.js";
import { initializeExamResolver } from "./modules/exam-resolver.js";
// ==========================================
// ACME SCHOOL - APLICACIÓN PRINCIPAL
// ==========================================

import {
    initializeDefaultUser,
    getUsers,
    getExams,
    getResults
} from "./utils/storage.js";

import {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    hasPermission
} from "./modules/auth.js";


// ==========================================
// INICIALIZAR APLICACIÓN
// ==========================================

function initializeApp() {

    initializeDefaultUser();

    const currentPage = window.location.pathname.split("/").pop();

    const loginForm = document.getElementById("login-form");

    // Inicializar plataforma pública de exámenes
    if (currentPage === "resolver.html") {

        initializeExamResolver();

        return;

    }


    // PROTEGER DASHBOARD

    if (["dashboard.html", "users.html", "exams.html", "questions.html"].includes(currentPage)) {

        const user = getCurrentUser();

        if (!user) {

            window.location.replace("index.html");
            return;

        }

        if (currentPage === "users.html" && !hasPermission(user, "manage-users")) {

            window.location.replace("dashboard.html");
            return;

        }

        // Actualizar encabezado
        const appHeader = document.querySelector("app-header");

        if (user && appHeader) {

            appHeader.setAttribute("user-name", user.fullName);

            appHeader.setAttribute("user-role", user.position);

        }

        // Escuchar evento de cierre de sesión
        const appSidebar = document.querySelector("app-sidebar");

        if (appSidebar) {
            appSidebar.setAttribute("user-role", user.position);
        }

        if (currentPage === "dashboard.html" && !hasPermission(user, "manage-users")) {
            document.getElementById("users")?.remove();
        }

        if (appSidebar) {

            appSidebar.addEventListener("logout", handleLogout);

        }

        // Inicializar gestión de usuarios
        if (currentPage === "users.html") {

            initializeUsersModule();

        }

        // Inicializar gestión de exámenes
        if (currentPage === "exams.html") {

            initializeExamsModule();

        }

        // Inicializar constructor de preguntas
        if (currentPage === "questions.html") {

            initializeQuestionsModule();

        }

        // Inicializar estadísticas del dashboard
        if (currentPage === "dashboard.html") {

            initializeDashboardStats();

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
// ACTUALIZAR ESTADÍSTICAS DEL DASHBOARD
// ==========================================

function initializeDashboardStats() {

    // Obtener información de LocalStorage
    const users = getUsers();

    const exams = getExams();

    const results = getResults();


    // Actualizar componentes de estadísticas mediante su atributo value
    const usersCount = document.getElementById("users-count");

    const examsCount = document.getElementById("exams-count");

    const resultsCount = document.getElementById("results-count");


    if (usersCount) {
        usersCount.setAttribute("value", String(users.length));
    }

    if (examsCount) {
        examsCount.setAttribute("value", String(exams.length));
    }

    if (resultsCount) {
        resultsCount.setAttribute("value", String(results.length));
    }
}

// ==========================================
// EJECUTAR APLICACIÓN
// ==========================================

initializeApp();
