// ==========================================
// ACME SCHOOL - RESOLUCIÓN DE EXÁMENES
// ==========================================

import {
    getExams,
    getResults,
    saveResults
} from "../utils/storage.js";


// ==========================================
// ELEMENTOS HTML
// ==========================================

const examCatalog = document.getElementById("exam-catalog");

const availableExams = document.getElementById("available-exams");

const studentIdentification = document.getElementById("student-identification");

const studentForm = document.getElementById("student-form");

const examView = document.getElementById("exam-view");

const examForm = document.getElementById("exam-form");

const examQuestions = document.getElementById("exam-questions");

const examResult = document.getElementById("exam-result");

const resolverMessage = document.getElementById("resolver-message");

const examTimer = document.getElementById("exam-timer");

const timerCard = document.querySelector(".timer-card");

// Elementos del encabezado del examen
const examTitleDisplay = document.getElementById("exam-title-display");

const examDescriptionDisplay = document.getElementById("exam-description-display");

const examQuestionCount = document.getElementById("exam-question-count");

const examPassingDisplay = document.getElementById("exam-passing-display");


// ==========================================
// VARIABLES DE CONTROL
// ==========================================

let selectedExam = null;

let student = null;

let timerInterval = null;

let deadline = null;

let startTime = null;

let finished = false;


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function showMessage(message, type) {

    resolverMessage.textContent = message;

    resolverMessage.className = `resolver-message ${type}`;

}


// ==========================================
// CONSULTAR EXÁMENES DISPONIBLES
// ==========================================

function getAvailableExams() {

    const exams = getExams();

    return exams.filter(exam => {

        if (!Array.isArray(exam.questions)) {
            return false;
        }

        if (exam.questions.length === 0) {
            return false;
        }

        // Comprobar que todas las preguntas estén completas
        return exam.questions.every(question => {

            if (
                !Array.isArray(question.answers) ||
                question.answers.length < 2
            ) {
                return false;
            }

            const correctAnswers = question.answers.filter(
                answer => answer.correct
            );

            return correctAnswers.length === 1;

        });

    });

}


// ==========================================
// MOSTRAR CATÁLOGO DE EXÁMENES
// ==========================================

function renderAvailableExams() {

    const exams = getAvailableExams();

    availableExams.replaceChildren();


    if (exams.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-exams";

        message.textContent =
            "Actualmente no hay exámenes disponibles.";

        availableExams.appendChild(message);

        return;

    }


    exams.forEach(exam => {

        const card = document.createElement("article");

        card.className = "available-exam-card";


        // Título
        const title = document.createElement("h3");

        title.textContent = exam.title;


        // Descripción
        const description = document.createElement("p");

        description.textContent = exam.description;


        // Información
        const details = document.createElement("div");

        details.className = "available-exam-details";


        const duration = document.createElement("span");

        duration.textContent = `${exam.duration} minutos`;


        const passing = document.createElement("span");

        passing.textContent = `Aprobación: ${exam.passingPercentage}%`;


        const questionCount = document.createElement("span");

        questionCount.textContent =
            `${exam.questions.length} preguntas`;


        details.append(duration, passing, questionCount);


        // Botón para comenzar
        const button = document.createElement("button");

        button.type = "button";

        button.className = "start-exam-button";

        button.textContent = "Presentar examen →";

        button.dataset.examId = String(exam.id);


        card.append(title, description, details, button);

        availableExams.appendChild(card);

    });

}


// ==========================================
// SELECCIONAR EXAMEN
// ==========================================

function selectExam(id) {

    const exams = getAvailableExams();

    selectedExam = exams.find(exam =>

        String(exam.id) === String(id)

    );


    if (!selectedExam) {

        showMessage("No se encontró el examen seleccionado.", "error");

        return;

    }


    examCatalog.hidden = true;

    studentIdentification.hidden = false;

    examView.hidden = true;

    examResult.hidden = true;

    resolverMessage.textContent = "";

    studentForm.reset();

}


// ==========================================
// MOSTRAR PREGUNTAS
// ==========================================

function renderExamQuestions() {

    examQuestions.replaceChildren();


    selectedExam.questions.forEach((question, index) => {

        const card = document.createElement("article");

        card.className = "student-question-card";


        // Número y enunciado
        const number = document.createElement("span");

        number.className = "student-question-number";

        number.textContent = `PREGUNTA ${index + 1}`;


        const title = document.createElement("h3");

        title.textContent = question.text;


        // Contenedor de respuestas
        const answersList = document.createElement("div");

        answersList.className = "student-answer-list";


        question.answers.forEach(answer => {

            const label = document.createElement("label");

            label.className = "student-answer-option";


            const radio = document.createElement("input");

            radio.type = "radio";

            radio.name = `question-${question.id}`;

            radio.value = String(answer.id);


            const answerText = document.createElement("span");

            answerText.textContent = answer.text;


            label.append(radio, answerText);

            answersList.appendChild(label);

        });


        card.append(number, title, answersList);

        examQuestions.appendChild(card);

    });

}


// ==========================================
// INICIAR EXAMEN
// ==========================================

function startExam() {

    if (!selectedExam || !student) {

        return;

    }


    examTitleDisplay.textContent = selectedExam.title;

    examDescriptionDisplay.textContent = selectedExam.description;

    examQuestionCount.textContent = selectedExam.questions.length;

    examPassingDisplay.textContent =
        `${selectedExam.passingPercentage}%`;


    renderExamQuestions();


    studentIdentification.hidden = true;

    examView.hidden = false;

    examCatalog.hidden = true;

    examResult.hidden = true;


    finished = false;


    // Configurar tiempo límite
    startTime = Date.now();

    deadline = startTime + selectedExam.duration * 60 * 1000;


    updateTimer();

    timerInterval = setInterval(updateTimer, 250);

}


// ==========================================
// ACTUALIZAR CRONÓMETRO
// ==========================================

function updateTimer() {

    const remainingMilliseconds = deadline - Date.now();

    const remainingSeconds = Math.max(
        0,
        Math.ceil(remainingMilliseconds / 1000)
    );


    const minutes = Math.floor(remainingSeconds / 60);

    const seconds = remainingSeconds % 60;


    examTimer.textContent =

        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;


    // Advertencia cuando queda un minuto
    if (remainingSeconds <= 60) {

        timerCard.classList.add("warning");

    } else {

        timerCard.classList.remove("warning");

    }


    // Finalización automática
    if (remainingSeconds <= 0) {

        finishExam(true);

    }

}


// ==========================================
// CALIFICAR EXAMEN
// ==========================================

function finishExam(timeExpired = false) {

    if (finished || !selectedExam || !student) {

        return;

    }

    finished = true;

    clearInterval(timerInterval);


    const questions = selectedExam.questions;

    const totalQuestions = questions.length;


    // Obtener respuestas seleccionadas
    const selectedAnswers = new Map(

        Array.from(

            examQuestions.querySelectorAll(
                'input[type="radio"]:checked'
            )

        ).map(input => [

            input.name,

            input.value

        ])

    );


    let correctCount = 0;


    // Comprobar respuestas
    const answerDetails = questions.map(question => {

        const selectedAnswerId = selectedAnswers.get(
            `question-${question.id}`
        );


        const correctAnswer = question.answers.find(
            answer => answer.correct
        );


        const isCorrect =
            selectedAnswerId === String(correctAnswer.id);


        if (isCorrect) {

            correctCount++;

        }


        return {

            questionId: question.id,

            selectedAnswerId: selectedAnswerId || null,

            correct: isCorrect

        };

    });


    // Calcular porcentaje
    const percentage = Math.round(

        (correctCount / totalQuestions) * 100

    );


    // Determinar aprobación
    const passed = percentage >= selectedExam.passingPercentage;


    const completedAt = new Date().toISOString();


    // Crear registro del resultado
    const result = {

        id: crypto.randomUUID(),

        examId: selectedExam.id,

        examCode: selectedExam.code,

        examTitle: selectedExam.title,

        studentIdentification: student.identification,

        studentName: student.name,

        totalQuestions,

        correctAnswers: correctCount,

        percentage,

        passingPercentage: selectedExam.passingPercentage,

        status: passed ? "Aprobado" : "No aprobado",

        timeExpired,

        startedAt: new Date(startTime).toISOString(),

        completedAt,

        answers: answerDetails

    };


    // Guardar resultado
    try {

        const results = getResults();

        results.push(result);

        saveResults(results);

    } catch (error) {

        console.error("Error al guardar resultado:", error);

        showMessage(
            "No fue posible guardar el resultado.",
            "error"
        );

    }


    // Mostrar resultado
    examView.hidden = true;

    examResult.hidden = false;


    const resultCard = document.querySelector(".result-card");

    resultCard.className = passed
        ? "result-card approved"
        : "result-card not-approved";


    document.getElementById("result-status").textContent =

        passed
            ? "¡Felicidades! Has aprobado."
            : "No has aprobado el examen.";


    document.getElementById("result-percentage").textContent =

        `${percentage}%`;


    document.getElementById("result-student").textContent =

        `Estudiante: ${student.name}`;


    let detail =

        `Respuestas correctas: ${correctCount} de ${totalQuestions}. ` +

        `Porcentaje mínimo requerido: ${selectedExam.passingPercentage}%.`;


    if (timeExpired) {

        detail += " El tiempo de la evaluación ha finalizado.";

    }


    document.getElementById("result-detail").textContent = detail;

}


// ==========================================
// VOLVER AL CATÁLOGO
// ==========================================

function returnToCatalog() {

    clearInterval(timerInterval);

    timerInterval = null;

    deadline = null;

    startTime = null;

    selectedExam = null;

    student = null;

    finished = false;


    studentForm.reset();


    examCatalog.hidden = false;

    studentIdentification.hidden = true;

    examView.hidden = true;

    examResult.hidden = true;


    resolverMessage.textContent = "";


    timerCard.classList.remove("warning");

    renderAvailableExams();

}


// ==========================================
// INICIALIZAR MÓDULO
// ==========================================

export function initializeExamResolver() {

    if (
        !examCatalog ||
        !availableExams ||
        !studentForm ||
        !examForm
    ) {

        return;

    }


    // Cargar catálogo
    renderAvailableExams();


    // Seleccionar examen
    availableExams.addEventListener("click", event => {

        const button = event.target.closest("button[data-exam-id]");

        if (!button) {

            return;

        }

        selectExam(button.dataset.examId);

    });


    // Iniciar con identificación
    studentForm.addEventListener("submit", event => {

        event.preventDefault();


        const identification = document
            .getElementById("student-identification")
            .value.trim();


        const name = document
            .getElementById("student-name")
            .value.trim();


        if (!identification || !name) {

            showMessage(
                "Debes completar tus datos para continuar.",
                "error"
            );

            return;

        }


        student = {

            identification,

            name

        };


        startExam();

    });


    // Finalizar manualmente
    examForm.addEventListener("submit", event => {

        event.preventDefault();

        finishExam(false);

    });


    // Regresar al catálogo
    document
        .getElementById("back-to-catalog")
        .addEventListener("click", returnToCatalog);


    document
        .getElementById("return-catalog")
        .addEventListener("click", returnToCatalog);

}