// ==========================================
// ACME SCHOOL - COMPONENTE SIDEBAR
// ==========================================

class AppSidebar extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `

            <aside class="dashboard-sidebar">

                <span class="sidebar-label">
                    MENÚ PRINCIPAL
                </span>

                <nav class="sidebar-nav">

                    <a href="dashboard.html" class="nav-item active">
                        <span>▦</span>
                        Resumen
                    </a>

                    <a href="users.html" class="nav-item">
                        <span>♙</span>
                        Gestión de usuarios
                    </a>

                    <a href="#exams" class="nav-item">
                        <span>▤</span>
                        Gestión de exámenes
                    </a>

                </nav>

                <div class="sidebar-bottom">

                    <button id="logout-button" class="logout-button">
                        <span>↪</span>
                        Cerrar sesión
                    </button>

                </div>

            </aside>

        `;

        // Detectar el botón de cerrar sesión
        const logoutButton = this.querySelector("#logout-button");

        logoutButton.addEventListener("click", () => {

            // Enviar evento al componente principal
            this.dispatchEvent(
                new CustomEvent("logout", {
                    bubbles: true
                })
            );

        });

    }

}

// Registrar componente
customElements.define("app-sidebar", AppSidebar);