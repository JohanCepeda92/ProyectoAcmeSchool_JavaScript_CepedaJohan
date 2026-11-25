// ==========================================
// ACME SCHOOL - COMPONENTE DE ESTADÍSTICAS
// ==========================================

const statCardTemplate = document.createElement("template");

statCardTemplate.innerHTML = `
    <style>
        :host {
            display: block;
            min-width: 0;
        }

        article {
            display: flex;
            align-items: center;
            gap: 16px;
            min-height: 96px;
            padding: 24px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            box-shadow: 0 5px 15px rgba(15, 23, 42, 0.03);
            animation: rise-in .45s ease-out backwards;
            transition: transform .2s ease, box-shadow .2s ease;
        }

        :host(:nth-child(2)) article { animation-delay: .08s; }
        :host(:nth-child(3)) article { animation-delay: .16s; }

        article:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 24px rgba(15, 23, 42, .08);
        }

        .icon {
            flex: 0 0 48px;
            width: 48px;
            height: 48px;
            display: grid;
            place-items: center;
            border-radius: 12px;
            font-size: 23px;
        }

        article[data-tone="users"] .icon {
            color: #2563EB;
            background: #DBEAFE;
        }

        article[data-tone="exams"] .icon {
            color: #9333EA;
            background: #F3E8FF;
        }

        article[data-tone="results"] .icon {
            color: #16A34A;
            background: #DCFCE7;
        }

        .content {
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-width: 0;
        }

        .label {
            color: #64748B;
            font-size: 12px;
        }

        .value {
            color: #172554;
            font-size: 25px;
            line-height: 1.2;
        }

        ::slotted(*) {
            color: #64748B;
            font-size: 11px;
        }

        @keyframes rise-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
            article {
                animation: none;
                transition: none;
            }
        }

        @media (max-width: 500px) {
            article { padding: 20px; }
        }
    </style>

    <article aria-label="Estadística">
        <span class="icon" aria-hidden="true"></span>
        <div class="content">
            <span class="label"></span>
            <strong class="value" aria-live="polite" aria-atomic="true"></strong>
            <slot></slot>
        </div>
    </article>
`;

class AcmeStatCard extends HTMLElement {
    static get observedAttributes() {
        return ["label", "value", "icon", "tone"];
    }

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(statCardTemplate.content.cloneNode(true));

        this.cardElement = shadowRoot.querySelector("article");
        this.labelElement = shadowRoot.querySelector(".label");
        this.valueElement = shadowRoot.querySelector(".value");
        this.iconElement = shadowRoot.querySelector(".icon");
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
        const label = this.getAttribute("label") || "Estadística";
        const value = this.getAttribute("value") || "0";
        const icon = this.getAttribute("icon") || "•";
        const tone = ["users", "exams", "results"].includes(
            this.getAttribute("tone")
        ) ? this.getAttribute("tone") : "users";

        this.labelElement.textContent = label;
        this.valueElement.textContent = value;
        this.iconElement.textContent = icon;
        this.cardElement.dataset.tone = tone;
        this.cardElement.setAttribute("aria-label", `${label}: ${value}`);
    }
}

customElements.define("acme-stat-card", AcmeStatCard);
