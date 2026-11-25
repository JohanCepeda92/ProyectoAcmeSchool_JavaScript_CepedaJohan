// ==========================================
// ACME SCHOOL - COMPONENTE DE TARJETA DE EXAMEN
// ==========================================

const examCardTemplate = document.createElement("template");

examCardTemplate.innerHTML = `
    <style>
        :host {
            display: block;
            min-width: 0;
        }

        article {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 25px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            box-shadow: 0 5px 15px rgba(15, 23, 42, .03);
            animation: rise-in .4s ease-out backwards;
            transition: transform .2s ease, box-shadow .2s ease;
        }

        :host(:nth-child(2)) article { animation-delay: .08s; }
        :host(:nth-child(3)) article { animation-delay: .16s; }
        :host(:nth-child(4)) article { animation-delay: .24s; }

        article:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(15, 23, 42, .06);
        }

        h3 {
            margin: 0 0 12px;
            color: #172554;
            font-size: 18px;
            line-height: 1.35;
            overflow-wrap: anywhere;
        }

        .description {
            margin: 0 0 18px;
            color: #64748B;
            font-size: 13px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .details {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 0 0 20px;
            padding: 0;
            list-style: none;
        }

        .details li {
            padding: 7px 10px;
            color: #2563EB;
            background: #EFF6FF;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
        }

        slot:not(:empty) {
            margin-bottom: 16px;
        }

        ::slotted(*) {
            color: #64748B;
            font-size: 12px;
        }

        button {
            width: 100%;
            margin-top: auto;
            padding: 13px;
            color: #FFFFFF;
            background: #2563EB;
            border: 0;
            border-radius: 9px;
            font: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: transform .18s ease, background-color .18s ease, box-shadow .18s ease;
        }

        button:hover {
            background: #1D4ED8;
            transform: translateY(-2px);
            box-shadow: 0 7px 16px rgba(37, 99, 235, .2);
        }

        button:focus-visible {
            outline: 3px solid #60A5FA;
            outline-offset: 3px;
        }

        @keyframes rise-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 500px) {
            article { padding: 22px 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
            article, button {
                animation: none;
                transition: none;
            }
        }
    </style>

    <article aria-labelledby="exam-title">
        <h3 id="exam-title"></h3>
        <p class="description"></p>
        <slot></slot>
        <ul class="details" aria-label="Información del examen">
            <li class="duration"></li>
            <li class="passing"></li>
            <li class="question-count"></li>
        </ul>
        <button type="button">Presentar examen →</button>
    </article>
`;

class AcmeExamCard extends HTMLElement {
    static get observedAttributes() {
        return [
            "exam-id",
            "title",
            "description",
            "duration",
            "passing-percentage",
            "question-count"
        ];
    }

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(examCardTemplate.content.cloneNode(true));

        this.titleElement = shadowRoot.querySelector("#exam-title");
        this.descriptionElement = shadowRoot.querySelector(".description");
        this.durationElement = shadowRoot.querySelector(".duration");
        this.passingElement = shadowRoot.querySelector(".passing");
        this.questionCountElement = shadowRoot.querySelector(".question-count");
        this.buttonElement = shadowRoot.querySelector("button");

        this.buttonElement.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("exam-select", {
                bubbles: true,
                composed: true,
                detail: {
                    examId: this.getAttribute("exam-id")
                }
            }));
        });
    }

    connectedCallback() {
        this.updateContent();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.updateContent();
        }
    }

    updateContent() {
        const title = this.getAttribute("title") || "Examen";
        const description = this.getAttribute("description") || "";
        const duration = this.getAttribute("duration") || "0";
        const passingPercentage = this.getAttribute("passing-percentage") || "0";
        const questionCount = this.getAttribute("question-count") || "0";

        this.titleElement.textContent = title;
        this.descriptionElement.textContent = description;
        this.durationElement.textContent = `${duration} minutos`;
        this.passingElement.textContent = `Aprobación: ${passingPercentage}%`;
        this.questionCountElement.textContent = `${questionCount} preguntas`;
        this.buttonElement.setAttribute("aria-label", `Presentar examen: ${title}`);
    }
}

customElements.define("acme-exam-card", AcmeExamCard);
