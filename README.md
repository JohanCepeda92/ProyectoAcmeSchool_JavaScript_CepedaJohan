# 🎓 Acme School

### Plataforma web de gestión académica y evaluación de conocimientos

**Acme School** es una aplicación web diseñada para administrar usuarios, gestionar evaluaciones académicas y permitir que los estudiantes presenten exámenes en línea.

La plataforma cuenta con un panel administrativo, un espacio de trabajo para docentes y un portal público para estudiantes. Su desarrollo utiliza tecnologías web nativas y una arquitectura modular basada en JavaScript.

---

## 📌 Objetivo del proyecto

Desarrollar una plataforma web que permita centralizar la administración académica y la presentación de evaluaciones, facilitando la gestión de usuarios, la creación de exámenes y la calificación automática de los estudiantes.

El proyecto busca aplicar conocimientos de HTML5, CSS3 y JavaScript, mediante la implementación de módulos, componentes reutilizables, manipulación del DOM y almacenamiento local de información.

---

## ✨ Características principales

### 🔐 Autenticación y gestión de acceso
- Inicio de sesión mediante correo electrónico y contraseña.
- Validación de credenciales.
- Protección de las páginas administrativas.
- Control de permisos según el cargo del usuario.
- Cierre de sesión.

### 👥 Gestión de usuarios
- Registro de nuevos usuarios.
- Consulta de usuarios registrados.
- Edición de información personal.
- Eliminación de usuarios.
- Administración de datos de identificación, nombre, correo electrónico, teléfono, cargo y contraseña.

### 📝 Gestión de exámenes
- Creación de evaluaciones.
- Consulta de exámenes registrados.
- Edición de información de las evaluaciones.
- Eliminación de exámenes.
- Configuración del código, título, descripción, duración y porcentaje mínimo de aprobación.

### ❓ Constructor de preguntas
- Creación de preguntas de selección múltiple.
- Incorporación y eliminación de opciones de respuesta.
- Selección de la respuesta correcta.
- Validación de preguntas y respuestas incompletas.
- Asociación de preguntas con sus respectivos exámenes.

### 🧑‍🎓 Portal de estudiantes
- Consulta pública de evaluaciones disponibles.
- Acceso sin necesidad de crear una cuenta.
- Identificación mediante número de documento y nombre completo.
- Presentación de evaluaciones.
- Visualización del tiempo restante.

### ⏱️ Evaluación y calificación
- Cronómetro en tiempo real.
- Selección única de respuestas por pregunta.
- Finalización manual de las evaluaciones.
- Finalización automática cuando se agota el tiempo.
- Calificación automática.
- Cálculo del porcentaje obtenido.
- Determinación del resultado: aprobado o reprobado.
- Identificación del estudiante en los resultados.

### 📊 Dashboard administrativo
- Visualización de usuarios registrados.
- Consulta de exámenes creados.
- Consulta de evaluaciones realizadas.
- Acceso a los módulos de administración según los permisos del usuario.

### 🎨 Diseño e interfaz
- Diseño responsive para escritorio y dispositivos móviles.
- Identidad visual basada en la paleta de colores de Acme School.
- Ilustraciones SVG locales.
- Animaciones y transiciones CSS.
- Estados visuales para interacciones y navegación.
- Adaptación a preferencias de movimiento reducido.

---

## 👤 Roles y permisos

La plataforma contempla dos perfiles de personal autorizado y un acceso público para estudiantes.

| Funcionalidad | Administrativo | Docente |
|---|:---:|:---:|
| Acceder al Dashboard | ✅ | ✅ |
| Consultar estadísticas | ✅ | ✅ |
| Gestionar usuarios | ✅ | ❌ |
| Registrar usuarios | ✅ | ❌ |
| Editar usuarios | ✅ | ❌ |
| Eliminar usuarios | ✅ | ❌ |
| Gestionar exámenes | ✅ | ✅ |
| Crear y editar preguntas | ✅ | ✅ |
| Administrar respuestas | ✅ | ✅ |
| Cerrar sesión | ✅ | ✅ |

**Estudiantes:** pueden consultar el catálogo público, identificarse y presentar las evaluaciones disponibles sin necesidad de iniciar sesión.

El control de permisos se realiza mediante la validación del cargo del usuario autenticado y la protección de las rutas correspondientes.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| HTML5 | Estructura y contenido de las páginas. |
| CSS3 | Diseño visual, estilos y diseño responsive. |
| JavaScript ES6+ | Lógica e interactividad de la aplicación. |
| JavaScript Modules | Organización y separación del código. |
| Custom Elements | Creación de componentes personalizados. |
| Shadow DOM | Encapsulamiento de la estructura y los estilos de componentes. |
| HTML Templates | Definición de estructuras reutilizables. |
| LocalStorage | Persistencia de la información en el navegador. |
| SVG | Ilustraciones y recursos gráficos. |

El proyecto utiliza tecnologías nativas del navegador, sin depender de frameworks externos.

---

## 🧩 Web Components

Acme School incorpora cuatro componentes personalizados que permiten reutilizar elementos de interfaz y organizar mejor la aplicación.

| Componente | Archivo | Función |
|---|---|---|
| `<app-header>` | `app-header.js` | Encabezado de la plataforma y presentación del usuario autenticado. |
| `<app-sidebar>` | `app-sidebar.js` | Menú lateral de navegación según los permisos del usuario. |
| `<acme-stat-card>` | `stat-card.js` | Tarjetas dinámicas para mostrar estadísticas del Dashboard. |
| `<acme-exam-card>` | `exam-card.js` | Tarjetas reutilizables para presentar los exámenes del catálogo público. |

Los componentes personalizados utilizan Custom Elements. Las tarjetas estadísticas y de exámenes implementan HTML Templates y Shadow DOM para encapsular su estructura y estilos.

Además, `acme-exam-card` utiliza eventos personalizados para comunicar al módulo de resolución qué evaluación ha seleccionado el estudiante.

---

## 📁 Estructura del proyecto

La aplicación está organizada mediante una estructura modular que separa las páginas HTML, los estilos CSS, los componentes reutilizables, los módulos funcionales y las utilidades de almacenamiento.

```text
ProyectoAcmeSchool_JavaScript_CepedaJohan/
│
├── assets/
│   └── images/
│       ├── exam-catalog.svg
│       └── student-portal.svg
│
├── css/
│   ├── dashboard.css
│   ├── exam.css
│   ├── exams.css
│   ├── login.css
│   ├── questions.css
│   ├── styles.css
│   └── users.css
│
├── js/
│   ├── components/
│   │   ├── app-header.js
│   │   ├── app-sidebar.js
│   │   ├── exam-card.js
│   │   └── stat-card.js
│   │
│   ├── modules/
│   │   ├── auth.js
│   │   ├── exam-resolver.js
│   │   ├── exams.js
│   │   ├── questions.js
│   │   └── users.js
│   │
│   ├── utils/
│   │   └── storage.js
│   │
│   └── app.js
│
├── dashboard.html
├── exams.html
├── index.html
├── questions.html
├── resolver.html
├── users.html
│
└── README.md
```

### Descripción de los directorios

**`assets/images/`**

Contiene las ilustraciones SVG utilizadas en las interfaces del portal estudiantil y el catálogo de evaluaciones.

**`css/`**

Contiene las hojas de estilo responsables de la identidad visual, distribución, componentes y adaptación responsive de cada sección.

**`js/components/`**

Almacena los Web Components reutilizables de la aplicación.

**`js/modules/`**

Contiene los módulos principales de autenticación, gestión de usuarios, gestión de exámenes, constructor de preguntas y resolución de evaluaciones.

**`js/utils/`**

Contiene funciones auxiliares relacionadas con el almacenamiento y recuperación de información.

**`js/app.js`**

Es el punto de entrada de JavaScript y se encarga de inicializar los componentes y módulos correspondientes a cada página.

---

## ⚙️ Instalación y ejecución

### Requisitos previos

- Visual Studio Code.
- Navegador web actualizado (Google Chrome recomendado).
- Extensión Live Server para Visual Studio Code.

### Pasos para ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Comprobar que la estructura de carpetas se encuentre completa.
4. Instalar la extensión **Live Server**, si todavía no está instalada.
5. Abrir el archivo `index.html`.
6. Hacer clic derecho sobre el archivo y seleccionar **Open with Live Server**.
7. La aplicación se abrirá en el navegador mediante un servidor local.

**Importante:** el proyecto utiliza módulos JavaScript y debe ejecutarse mediante un servidor HTTP local. No se recomienda abrir directamente los archivos HTML utilizando el protocolo `file://`.

No requiere instalación de dependencias mediante npm ni configuración de un backend.

---

## 💾 Almacenamiento de información

Acme School utiliza **LocalStorage** del navegador para almacenar y recuperar la información de la aplicación.

La persistencia contempla:

- Usuarios registrados.
- Exámenes creados.
- Preguntas y respuestas asociadas.
- Información de sesión.
- Resultados de las evaluaciones realizadas.

La información se almacena en el navegador mediante estructuras JSON, permitiendo conservar los registros después de actualizar o cerrar y volver a abrir la página, siempre que se mantenga el almacenamiento del mismo origen.

---

## 🧪 Pruebas funcionales

Durante el desarrollo se realizaron comprobaciones manuales de los principales flujos de la aplicación.

| Prueba | Resultado |
|---|---|
| Registro de usuarios | ✅ |
| Edición de usuarios | ✅ |
| Persistencia de usuarios después de actualizar | ✅ |
| Inicio de sesión administrativo | ✅ |
| Inicio de sesión docente | ✅ |
| Restricción de acceso a gestión de usuarios para docentes | ✅ |
| Redirección al intentar acceder a una ruta no autorizada | ✅ |
| Consulta y edición de exámenes | ✅ |
| Consulta del catálogo público | ✅ |
| Identificación del estudiante | ✅ |
| Presentación de evaluaciones | ✅ |
| Calificación automática | ✅ |
| Resultado de aprobación y reprobación | ✅ |
| Finalización automática por tiempo agotado | ✅ |
| Registro de resultados en LocalStorage | ✅ |
| Visualización responsive | ✅ |

Las comprobaciones fueron realizadas manualmente durante el desarrollo. No se implementó un sistema de pruebas automatizadas.

---

## 🔐 Seguridad y consideraciones técnicas

Acme School es un prototipo académico desarrollado como una aplicación frontend.

La autenticación, la gestión de permisos y la persistencia de datos se realizan desde el navegador mediante JavaScript y LocalStorage.

Por esta razón, el sistema no debe considerarse una solución de seguridad para producción. La información almacenada en el navegador puede ser consultada o modificada por el usuario y los controles de acceso del lado del cliente pueden manipularse.

Para un entorno de producción sería necesario incorporar un backend, una base de datos, autenticación segura, gestión de sesiones en el servidor y validación de permisos del lado del servidor.

---

## 🎯 Consideraciones para la demostración

Para facilitar la presentación académica de Acme School, la evaluación de JavaScript (código ACME-001) se encuentra configurada con una duración de **1 minuto**.

Esta configuración permite demostrar durante la sustentación:

- Inicio de una evaluación.
- Funcionamiento del cronómetro.
- Finalización automática cuando el tiempo llega a cero.
- Calificación automática.
- Presentación del resultado.
- Registro del intento realizado.

La duración puede modificarse desde el módulo de gestión de exámenes.

---

## 👨‍💻 Autoría

**Proyecto:** Acme School – Plataforma web de gestión académica y evaluación.

**Autor:** Johan Cepeda.

**Tipo de proyecto:** Desarrollo académico.

**Tecnologías principales:** HTML5, CSS3 y JavaScript.

---

### © Acme School

Plataforma académica desarrollada con fines educativos.