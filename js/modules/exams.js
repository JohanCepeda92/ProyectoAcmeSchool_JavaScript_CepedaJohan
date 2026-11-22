// ==========================================
// ACME SCHOOL - GESTIÓN DE EXÁMENES
// ==========================================

import {
    getExams,
    saveExams
} from "../utils/storage.js";


// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const examForm = document.getElementById("exam-form");

const examsTableBody = document.getElementById("exams-table-body");

const examIdInput = document.getElementById("exam-id");

const examCodeInput = document.getElementById("exam-code");

const examTitleInput = document.getElementById("exam-title");

const examDurationInput = document.getElementById("exam-duration");

const examPassingInput = document.getElementById("exam-passing");

const examDescriptionInput = document.getElementById("exam-description");

const formTitle = document.getElementById("exam-form-title");

const submitButton = document.getElementById("submit-exam");

const cancelButton = document.getElementById("cancel-exam-edit");

const examsMessage = document.getElementById("exams-message");


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function showMessage(message, type) {

    examsMessage.textContent = message;

    examsMessage.className = `exams-message ${type}`;

}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function resetForm() {

    examForm.reset();

    examIdInput.value = "";

    formTitle.textContent = "Crear examen";

    submitButton.textContent = "Crear examen";

    cancelButton.hidden = true;

}


// ==========================================
// CONSULTAR Y MOSTRAR EXÁMENES
// ==========================================

function renderExams() {

    const exams = getExams();

    examsTableBody.replaceChildren();

    if (exams.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.className = "empty-exams";

        cell.textContent = "No hay exámenes registrados.";

        row.appendChild(cell);

        examsTableBody.appendChild(row);

        return;

    }

    exams.forEach(exam => {

        const row = document.createElement("tr");

        const examData = [

            exam.code,

            exam.title,

            `${exam.duration} minutos`,

            `${exam.passingPercentage}%`,

            exam.description

        ];

        examData.forEach(data => {

            const cell = document.createElement("td");

            cell.textContent = data || "";

            row.appendChild(cell);

        });


        // BOTONES DE ACCIONES

        const actionsCell = document.createElement("td");


        // Editar

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.textContent = "Editar";

        editButton.className = "action-button edit-button";

        editButton.dataset.action = "edit";

        editButton.dataset.examId = String(exam.id);


        // Eliminar

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Eliminar";

        deleteButton.className = "action-button delete-button";

        deleteButton.dataset.action = "delete";

        deleteButton.dataset.examId = String(exam.id);


        actionsCell.append(editButton, deleteButton);

        row.appendChild(actionsCell);

        examsTableBody.appendChild(row);

    });

}


// ==========================================
// VALIDAR DATOS
// ==========================================

function validateExam(examData, exams) {

    const codeExists = exams.some(exam =>

        String(exam.id) !== String(examData.id) &&

        exam.code.toLowerCase() === examData.code.toLowerCase()

    );

    if (codeExists) {

        return "El código del examen ya está registrado.";

    }

    if (examData.duration <= 0 || examData.duration > 300) {

        return "El tiempo debe estar entre 1 y 300 minutos.";

    }

    if (
        examData.passingPercentage < 0 ||
        examData.passingPercentage > 100
    ) {

        return "El porcentaje de aprobación debe estar entre 0 y 100.";

    }

    return null;

}


// ==========================================
// CREAR O ACTUALIZAR EXAMEN
// ==========================================

function handleExamSubmit(event) {

    event.preventDefault();

    const exams = getExams();

    const currentId = examIdInput.value;

    const editingExam = exams.find(exam =>

        String(exam.id) === String(currentId)

    );


    const examData = {

        id: currentId || crypto.randomUUID(),

        code: examCodeInput.value.trim().toUpperCase(),

        title: examTitleInput.value.trim(),

        duration: Number(examDurationInput.value),

        passingPercentage: Number(examPassingInput.value),

        description: examDescriptionInput.value.trim(),

        // Conservar preguntas al editar
        questions: editingExam ? editingExam.questions || [] : []

    };


    // VALIDAR CAMPOS

    if (

        !examData.code ||

        !examData.title ||

        !examData.duration ||

        !examData.description

    ) {

        showMessage("Completa todos los campos obligatorios.", "error");

        return;

    }


    // VALIDAR INFORMACIÓN

    const validationError = validateExam(examData, exams);

    if (validationError) {

        showMessage(validationError, "error");

        return;

    }


    try {

        if (editingExam) {

            // ACTUALIZAR
            const updatedExams = exams.map(exam =>

                String(exam.id) === String(currentId)

                    ? examData

                    : exam

            );

            saveExams(updatedExams);

            showMessage("Examen actualizado correctamente.", "success");

        } else {

            // CREAR
            exams.push(examData);

            saveExams(exams);

            showMessage("Examen creado correctamente.", "success");

        }


        renderExams();

        resetForm();

    } catch (error) {

        console.error("Error al guardar examen:", error);

        showMessage("No fue posible guardar el examen.", "error");

    }

}


// ==========================================
// PREPARAR EDICIÓN
// ==========================================

function editExam(id) {

    const exams = getExams();

    const exam = exams.find(exam =>

        String(exam.id) === String(id)

    );

    if (!exam) {

        showMessage("No se encontró el examen seleccionado.", "error");

        return;

    }


    examIdInput.value = exam.id;

    examCodeInput.value = exam.code;

    examTitleInput.value = exam.title;

    examDurationInput.value = exam.duration;

    examPassingInput.value = exam.passingPercentage;

    examDescriptionInput.value = exam.description;


    formTitle.textContent = "Actualizar examen";

    submitButton.textContent = "Guardar cambios";

    cancelButton.hidden = false;


    showMessage("Modificando información del examen.", "success");


    examForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ==========================================
// ELIMINAR EXAMEN
// ==========================================

function deleteExam(id) {

    const confirmation = confirm(

        "¿Estás seguro de que deseas eliminar este examen?"

    );

    if (!confirmation) {

        return;

    }


    const exams = getExams();

    const updatedExams = exams.filter(exam =>

        String(exam.id) !== String(id)

    );


    try {

        saveExams(updatedExams);

        renderExams();

        resetForm();

        showMessage("Examen eliminado correctamente.", "success");

    } catch (error) {

        console.error("Error al eliminar examen:", error);

        showMessage("No fue posible eliminar el examen.", "error");

    }

}


// ==========================================
// ACCIONES DE LA TABLA
// ==========================================

function handleTableActions(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {

        return;

    }

    const action = button.dataset.action;

    const examId = button.dataset.examId;


    if (action === "edit") {

        editExam(examId);

    }

    if (action === "delete") {

        deleteExam(examId);

    }

}


// ==========================================
// INICIALIZAR MÓDULO
// ==========================================

export function initializeExamsModule() {

    if (!examForm || !examsTableBody) {

        return;

    }

    renderExams();

    examForm.addEventListener("submit", handleExamSubmit);

    examsTableBody.addEventListener("click", handleTableActions);

    cancelButton.addEventListener("click", () => {

        resetForm();

        examsMessage.textContent = "";

    });

}