// ==========================================
// ACME SCHOOL - CONSTRUCTOR DE PREGUNTAS
// ==========================================

import {
    getExams,
    saveExams
} from "../utils/storage.js";


// ==========================================
// ELEMENTOS HTML
// ==========================================

const questionForm = document.getElementById("question-form");

const questionIdInput = document.getElementById("question-id");

const questionTextInput = document.getElementById("question-text");

const answersContainer = document.getElementById("answers-container");

const addAnswerButton = document.getElementById("add-answer");

const questionsList = document.getElementById("questions-list");

const questionsMessage = document.getElementById("questions-message");

const formTitle = document.getElementById("question-form-title");

const submitButton = document.getElementById("submit-question");

const cancelButton = document.getElementById("cancel-question-edit");


// ==========================================
// IDENTIFICAR EXAMEN SELECCIONADO
// ==========================================

const examId = new URLSearchParams(window.location.search)
    .get("examId");

let selectedExam = null;


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function showMessage(message, type) {

    questionsMessage.textContent = message;

    questionsMessage.className = `questions-message ${type}`;

}


// ==========================================
// CREAR FILA DE RESPUESTA
// ==========================================

function createAnswerRow(answer = {}) {

    const answerId = answer.id || crypto.randomUUID();

    const row = document.createElement("div");

    row.className = "answer-item";


    // Selector de respuesta correcta
    const radio = document.createElement("input");

    radio.type = "radio";

    radio.name = "correct-answer";

    radio.value = answerId;

    radio.checked = Boolean(answer.correct);

    radio.title = "Marcar como respuesta correcta";


    // Campo de texto
    const input = document.createElement("input");

    input.type = "text";

    input.className = "answer-text";

    input.placeholder = "Escribe una posible respuesta...";

    input.value = answer.text || "";

    input.required = true;


    // Botón para eliminar respuesta
    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "remove-answer-button";

    removeButton.textContent = "×";

    removeButton.title = "Eliminar respuesta";


    row.append(radio, input, removeButton);

    answersContainer.appendChild(row);

}


// ==========================================
// AGREGAR RESPUESTA
// ==========================================

function addAnswer() {

    createAnswerRow();

}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function resetQuestionForm() {

    questionForm.reset();

    questionIdInput.value = "";

    answersContainer.replaceChildren();

    // Toda pregunta debe tener al menos dos respuestas
    createAnswerRow();

    createAnswerRow();

    formTitle.textContent = "Crear pregunta";

    submitButton.textContent = "Guardar pregunta";

    cancelButton.hidden = true;

}


// ==========================================
// MOSTRAR INFORMACIÓN DEL EXAMEN
// ==========================================

function renderSelectedExam() {

    const exams = getExams();

    selectedExam = exams.find(exam =>

        String(exam.id) === String(examId)

    );


    if (!selectedExam) {

        showMessage(
            "No se encontró el examen seleccionado.",
            "error"
        );

        document.querySelector(".questions-form-section").hidden = true;

        document.querySelector(".questions-list-section").hidden = true;

        return false;

    }


    // Inicializar preguntas si no existen
    if (!Array.isArray(selectedExam.questions)) {

        selectedExam.questions = [];

        saveExams(exams);

    }


    document.getElementById("selected-exam-title").textContent =
        selectedExam.title;

    document.getElementById("selected-exam-description").textContent =
        selectedExam.description;

    document.getElementById("selected-exam-code").textContent =
        selectedExam.code;

    document.getElementById("selected-exam-duration").textContent =
        `${selectedExam.duration} minutos`;

    document.getElementById("selected-exam-passing").textContent =
        `${selectedExam.passingPercentage}%`;

    return true;

}


// ==========================================
// MOSTRAR PREGUNTAS REGISTRADAS
// ==========================================

function renderQuestions() {

    questionsList.replaceChildren();

    const questions = selectedExam.questions || [];


    if (questions.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-questions";

        emptyMessage.textContent =
            "Este examen todavía no tiene preguntas registradas.";

        questionsList.appendChild(emptyMessage);

        return;

    }


    questions.forEach((question, index) => {

        const card = document.createElement("article");

        card.className = "question-card";


        // Encabezado
        const header = document.createElement("div");

        header.className = "question-card-header";


        const title = document.createElement("div");


        const number = document.createElement("span");

        number.className = "question-number";

        number.textContent = `PREGUNTA ${index + 1}`;


        const heading = document.createElement("h3");

        heading.textContent = question.text;


        title.append(number, heading);

        header.appendChild(title);


        // Respuestas
        const answersList = document.createElement("div");

        answersList.className = "question-answers";


        question.answers.forEach(answer => {

            const answerElement = document.createElement("div");

            answerElement.className = answer.correct
                ? "question-answer correct"
                : "question-answer";

            answerElement.textContent = answer.correct
                ? `✓ ${answer.text} (Correcta)`
                : `○ ${answer.text}`;

            answersList.appendChild(answerElement);

        });


        // Acciones
        const actions = document.createElement("div");

        actions.className = "question-actions";


        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "action-button edit-button";

        editButton.textContent = "Editar";

        editButton.dataset.action = "edit";

        editButton.dataset.questionId = String(question.id);


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "action-button delete-button";

        deleteButton.textContent = "Eliminar";

        deleteButton.dataset.action = "delete";

        deleteButton.dataset.questionId = String(question.id);


        actions.append(editButton, deleteButton);

        card.append(header, answersList, actions);

        questionsList.appendChild(card);

    });

}


// ==========================================
// GUARDAR PREGUNTA
// ==========================================

function handleQuestionSubmit(event) {

    event.preventDefault();


    const exams = getExams();

    const exam = exams.find(item =>

        String(item.id) === String(examId)

    );


    if (!exam) {

        showMessage("No se encontró el examen.", "error");

        return;

    }


    const currentId = questionIdInput.value;

    const questionText = questionTextInput.value.trim();


    // Obtener respuestas
    const answerRows = [...answersContainer.querySelectorAll(".answer-item")];


    if (answerRows.length < 2) {

        showMessage(
            "Cada pregunta debe tener al menos dos respuestas.",
            "error"
        );

        return;

    }


    // Validar enunciado
    if (!questionText) {

        showMessage("Debes escribir el enunciado de la pregunta.", "error");

        return;

    }


    // Obtener respuestas y verificar que estén completas
    const answers = answerRows.map(row => {

        return {

            id: row.querySelector('input[type="radio"]').value,

            text: row.querySelector(".answer-text").value.trim(),

            correct: row.querySelector('input[type="radio"]').checked

        };

    });


    if (answers.some(answer => !answer.text)) {

        showMessage(
            "Todas las respuestas deben tener una descripción.",
            "error"
        );

        return;

    }


    // Verificar que exista exactamente una respuesta correcta
    const correctAnswers = answers.filter(answer => answer.correct);


    if (correctAnswers.length !== 1) {

        showMessage(
            "Debes marcar una única respuesta como correcta.",
            "error"
        );

        return;

    }


    const questionData = {

        id: currentId || crypto.randomUUID(),

        text: questionText,

        answers

    };


    if (!Array.isArray(exam.questions)) {

        exam.questions = [];

    }


    // Actualizar o crear pregunta
    if (currentId) {

        exam.questions = exam.questions.map(question =>

            String(question.id) === String(currentId)

                ? questionData

                : question

        );

        showMessage(
            "Pregunta actualizada correctamente.",
            "success"
        );

    } else {

        exam.questions.push(questionData);

        showMessage(
            "Pregunta registrada correctamente.",
            "success"
        );

    }


    try {

        saveExams(exams);

        selectedExam = exam;

        renderQuestions();

        resetQuestionForm();

    } catch (error) {

        console.error("Error al guardar pregunta:", error);

        showMessage(
            "No fue posible guardar la pregunta.",
            "error"
        );

    }

}


// ==========================================
// EDITAR PREGUNTA
// ==========================================

function editQuestion(id) {

    const question = selectedExam.questions.find(item =>

        String(item.id) === String(id)

    );


    if (!question) {

        showMessage("No se encontró la pregunta.", "error");

        return;

    }


    questionIdInput.value = question.id;

    questionTextInput.value = question.text;


    // Cargar respuestas existentes
    answersContainer.replaceChildren();

    question.answers.forEach(answer => {

        createAnswerRow(answer);

    });


    formTitle.textContent = "Actualizar pregunta";

    submitButton.textContent = "Guardar cambios";

    cancelButton.hidden = false;


    showMessage(
        "Modificando la pregunta seleccionada.",
        "success"
    );


    questionForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ==========================================
// ELIMINAR PREGUNTA
// ==========================================

function deleteQuestion(id) {

    const confirmation = confirm(
        "¿Estás seguro de que deseas eliminar esta pregunta?"
    );


    if (!confirmation) {

        return;

    }


    const exams = getExams();

    const exam = exams.find(item =>

        String(item.id) === String(examId)

    );


    if (!exam) {

        showMessage("No se encontró el examen.", "error");

        return;

    }


    exam.questions = exam.questions.filter(question =>

        String(question.id) !== String(id)

    );


    saveExams(exams);

    selectedExam = exam;

    renderQuestions();

    resetQuestionForm();

    showMessage(
        "Pregunta eliminada correctamente.",
        "success"
    );

}


// ==========================================
// ACCIONES DE PREGUNTAS
// ==========================================

function handleQuestionActions(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {

        return;

    }


    const action = button.dataset.action;

    const questionId = button.dataset.questionId;


    if (action === "edit") {

        editQuestion(questionId);

    }


    if (action === "delete") {

        deleteQuestion(questionId);

    }

}


// ==========================================
// INICIALIZAR MÓDULO
// ==========================================

export function initializeQuestionsModule() {

    if (!questionForm || !answersContainer) {

        return;

    }


    if (!renderSelectedExam()) {

        return;

    }


    resetQuestionForm();

    renderQuestions();


    addAnswerButton.addEventListener("click", addAnswer);

    questionForm.addEventListener("submit", handleQuestionSubmit);

    questionsList.addEventListener("click", handleQuestionActions);


    // Eliminar respuestas sin permitir menos de dos
    answersContainer.addEventListener("click", event => {

        const button = event.target.closest(".remove-answer-button");

        if (!button) {

            return;

        }


        const answerRows =
            answersContainer.querySelectorAll(".answer-item");


        if (answerRows.length <= 2) {

            showMessage(
                "Cada pregunta debe tener al menos dos respuestas.",
                "error"
            );

            return;

        }


        button.closest(".answer-item").remove();

        questionsMessage.textContent = "";

    });


    cancelButton.addEventListener("click", () => {

        resetQuestionForm();

        questionsMessage.textContent = "";

    });

}