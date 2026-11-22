// ==========================================
// ACME SCHOOL - GESTIÓN DE USUARIOS
// ==========================================

import {
    getUsers,
    saveUsers
} from "../utils/storage.js";

import { getCurrentUser } from "./auth.js";


// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const userForm = document.getElementById("user-form");

const usersTableBody = document.getElementById("users-table-body");

const userIdInput = document.getElementById("user-id");

const identificationInput = document.getElementById("identification");

const fullNameInput = document.getElementById("full-name");

const emailInput = document.getElementById("user-email");

const phoneInput = document.getElementById("phone");

const positionInput = document.getElementById("position");

const passwordInput = document.getElementById("user-password");

const formTitle = document.getElementById("form-title");

const submitButton = document.getElementById("submit-user");

const cancelButton = document.getElementById("cancel-edit");

const usersMessage = document.getElementById("users-message");


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function showMessage(message, type) {

    usersMessage.textContent = message;

    usersMessage.className = type;

}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function resetForm() {

    userForm.reset();

    userIdInput.value = "";

    passwordInput.required = true;

    passwordInput.placeholder = "Ingresa una contraseña";

    formTitle.textContent = "Registrar usuario";

    submitButton.textContent = "Registrar usuario";

    cancelButton.hidden = true;

}


// ==========================================
// CONSULTAR Y MOSTRAR USUARIOS
// ==========================================

function renderUsers() {

    const users = getUsers();

    usersTableBody.replaceChildren();

    // Comprobar si existen usuarios
    if (users.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.className = "empty-users";

        cell.textContent = "No hay usuarios registrados.";

        row.appendChild(cell);

        usersTableBody.appendChild(row);

        return;

    }

    // Recorrer usuarios registrados
    users.forEach(user => {

        const row = document.createElement("tr");

        const userData = [
            user.identification,
            user.fullName,
            user.email,
            user.phone,
            user.position
        ];

        // Crear celdas
        userData.forEach(data => {

            const cell = document.createElement("td");

            cell.textContent = data || "";

            row.appendChild(cell);

        });

        // Celda de acciones
        const actionsCell = document.createElement("td");

        // Botón editar
        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.textContent = "Editar";

        editButton.className = "action-button edit-button";

        editButton.dataset.action = "edit";

        editButton.dataset.userId = String(user.id);


        // Botón eliminar
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Eliminar";

        deleteButton.className = "action-button delete-button";

        deleteButton.dataset.action = "delete";

        deleteButton.dataset.userId = String(user.id);


        actionsCell.append(editButton, deleteButton);

        row.appendChild(actionsCell);

        usersTableBody.appendChild(row);

    });

}


// ==========================================
// VALIDAR DATOS
// ==========================================

function validateUser(userData, users) {

    const identificationExists = users.some(user =>

        String(user.id) !== String(userData.id) &&

        user.identification === userData.identification

    );

    const emailExists = users.some(user =>

        String(user.id) !== String(userData.id) &&

        user.email.toLowerCase() === userData.email.toLowerCase()

    );

    if (identificationExists) {

        return "El número de identificación ya está registrado.";

    }

    if (emailExists) {

        return "El correo electrónico ya está registrado.";

    }

    return null;

}


// ==========================================
// REGISTRAR O ACTUALIZAR USUARIO
// ==========================================

function handleUserSubmit(event) {

    event.preventDefault();

    const users = getUsers();

    const currentId = userIdInput.value;

    const identification = identificationInput.value.trim();

    const fullName = fullNameInput.value.trim();

    const email = emailInput.value.trim().toLowerCase();

    const phone = phoneInput.value.trim();

    const position = positionInput.value;

    const password = passwordInput.value;


    const editingUser = users.find(user =>

        String(user.id) === String(currentId)

    );


    // Validar campos
    if (

        !identification ||

        !fullName ||

        !email ||

        !phone ||

        !position ||

        (!editingUser && !password)

    ) {

        showMessage("Todos los campos obligatorios deben completarse.", "error");

        return;

    }


    // Preparar información del usuario
    const userData = {

        id: currentId || crypto.randomUUID(),

        identification,

        fullName,

        email,

        phone,

        position,

        password: password || (editingUser ? editingUser.password : "")

    };


    // Comprobar duplicados
    const validationError = validateUser(userData, users);

    if (validationError) {

        showMessage(validationError, "error");

        return;

    }


    try {

        if (editingUser) {

            // ACTUALIZAR USUARIO
            const updatedUsers = users.map(user =>

                String(user.id) === String(currentId)

                    ? userData

                    : user

            );

            saveUsers(updatedUsers);

            showMessage("Usuario actualizado correctamente.", "success");

        } else {

            // CREAR USUARIO
            users.push(userData);

            saveUsers(users);

            showMessage("Usuario registrado correctamente.", "success");

        }


        // Actualizar tabla
        renderUsers();

        // Limpiar formulario
        resetForm();

    } catch (error) {

        console.error("Error al guardar usuario:", error);

        showMessage("No fue posible guardar el usuario.", "error");

    }

}


// ==========================================
// PREPARAR EDICIÓN
// ==========================================

function editUser(id) {

    const users = getUsers();

    const user = users.find(user =>

        String(user.id) === String(id)

    );

    if (!user) {

        showMessage("No se encontró el usuario seleccionado.", "error");

        return;

    }

    // Cargar información
    userIdInput.value = user.id;

    identificationInput.value = user.identification;

    fullNameInput.value = user.fullName;

    emailInput.value = user.email;

    phoneInput.value = user.phone;

    positionInput.value = user.position;

    // La contraseña puede conservarse sin modificarla
    passwordInput.value = "";

    passwordInput.required = false;

    passwordInput.placeholder = "Dejar vacío para conservarla";


    // Cambiar textos
    formTitle.textContent = "Actualizar usuario";

    submitButton.textContent = "Guardar cambios";

    cancelButton.hidden = false;


    showMessage(
        "Editando usuario. Deja la contraseña vacía para conservarla.",
        "success"
    );

    // Desplazarse al formulario
    userForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ==========================================
// ELIMINAR USUARIO
// ==========================================

function deleteUser(id) {

    const users = getUsers();

    const currentUser = getCurrentUser();

    // Evitar que el usuario elimine su propia cuenta
    if (currentUser && String(currentUser.id) === String(id)) {

        showMessage(
            "No puedes eliminar tu propia cuenta mientras tienes sesión iniciada.",
            "error"
        );

        return;

    }


    const confirmation = confirm(

        "¿Estás seguro de que deseas eliminar este usuario?"

    );

    if (!confirmation) {

        return;

    }


    const updatedUsers = users.filter(user =>

        String(user.id) !== String(id)

    );


    try {

        saveUsers(updatedUsers);

        renderUsers();

        showMessage("Usuario eliminado correctamente.", "success");

        resetForm();

    } catch (error) {

        console.error("Error al eliminar usuario:", error);

        showMessage("No fue posible eliminar el usuario.", "error");

    }

}


// ==========================================
// EVENTOS DE LA TABLA
// ==========================================

function handleTableActions(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {

        return;

    }

    const action = button.dataset.action;

    const userId = button.dataset.userId;


    if (action === "edit") {

        editUser(userId);

    }

    if (action === "delete") {

        deleteUser(userId);

    }

}


// ==========================================
// INICIALIZAR MÓDULO
// ==========================================

export function initializeUsersModule() {

    if (!userForm || !usersTableBody) {

        return;

    }

    renderUsers();

    userForm.addEventListener("submit", handleUserSubmit);

    usersTableBody.addEventListener("click", handleTableActions);

    cancelButton.addEventListener("click", () => {

        resetForm();

        usersMessage.textContent = "";

    });

}