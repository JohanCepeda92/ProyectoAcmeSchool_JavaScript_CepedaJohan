// ==========================================
// ACME SCHOOL - COMPONENTE SIDEBAR
// ==========================================

class AppSidebar extends HTMLElement {

    static get observedAttributes() {
        return ["user-role"];
    }

    attributeChangedCallback(name) {
        if (name === "user-role" && this.isConnected) {
            this.updateUserManagementLink();
        }
    }

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

                    <a href="exams.html" class="nav-item">
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

        this.updateUserManagementLink();

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

    updateUserManagementLink() {

        const navigation = this.querySelector(".sidebar-nav");

        if (!navigation) {
            return;
        }

        const existingLink = navigation.querySelector('a[href="users.html"]');

        if (this.getAttribute("user-role") !== "Administrativo") {
            existingLink?.remove();
            return;
        }

        if (existingLink) {
            return;
        }

        const link = document.createElement("a");
        link.href = "users.html";
        link.className = "nav-item";

        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "♙";

        link.append(icon, document.createTextNode(" Gestión de usuarios"));

        const examsLink = navigation.querySelector('a[href="exams.html"]');
        navigation.insertBefore(link, examsLink);

    }

}

// Registrar componente
customElements.define("app-sidebar", AppSidebar);
