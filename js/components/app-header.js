// ==========================================
// ACME SCHOOL - COMPONENTE HEADER
// ==========================================

class AppHeader extends HTMLElement {

    // Atributos que pueden cambiar
    static get observedAttributes() {
        return ["user-name", "user-role"];
    }

    // Cuando el componente aparece en pantalla
    connectedCallback() {
        this.render();
    }

    // Detectar cambios en los atributos
    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    // Construir el componente
    render() {

        const userName = this.getAttribute("user-name") || "Administrador";

        const userRole = this.getAttribute("user-role") || "Administrativo";

        const initial = userName.charAt(0).toUpperCase();

        this.innerHTML = `

            <header class="dashboard-header">

                <a href="dashboard.html" class="brand">

                    <div class="brand-icon">A</div>

                    <div class="brand-text">
                        <span class="brand-name">ACME</span>
                        <span class="brand-subtitle">SCHOOL</span>
                    </div>

                </a>

                <div class="header-user">

                    <div class="user-avatar">
                        ${initial}
                    </div>

                    <div class="user-info">
                        <strong>${userName}</strong>
                        <span>${userRole}</span>
                    </div>

                </div>

            </header>

        `;

    }

}

// Registrar componente
customElements.define("app-header", AppHeader);