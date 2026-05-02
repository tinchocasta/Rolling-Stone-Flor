/* ======================================
   ROLLING STONE FEST 2026 — SCRIPT
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       1. SCROLL PROGRESS BAR
       ============================== */
    const progressBar = document.getElementById('scroll-progress');

    function updateProgress() {
        const scrollTop    = window.scrollY;
        const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();


    /* ==============================
       2. HEADER SCROLL SHADOW
       ============================== */
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }
    }, { passive: true });


    /* ==============================
       3. SCROLL REVEAL (Intersection Observer)
       ============================== */
    const revealEls = document.querySelectorAll(
        '.reveal-fade-up, .reveal-slide-left, .reveal-slide-right'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ==============================
       4. CONTADOR REGRESIVO
       ============================== */
    const fechaFestival = new Date('2026-11-13T14:00:00');
    const spanDias     = document.getElementById('dias');
    const spanHoras    = document.getElementById('horas');
    const spanMinutos  = document.getElementById('minutos');
    const spanSegundos = document.getElementById('segundos');

    // Guarda valores previos para animar solo cuando cambian
    let prevValues = { dias: null, horas: null, minutos: null, segundos: null };

    function animateDigit(el, newVal) {
        const cajaEl = el.closest('.caja');
        if (cajaEl) {
            cajaEl.classList.remove('flip');
            void cajaEl.offsetWidth; // reflow para reiniciar animación
            cajaEl.classList.add('flip');
        }
        el.textContent = newVal;
    }

    function actualizarContador() {
        const ahora      = new Date();
        const diferencia = fechaFestival - ahora;

        if (diferencia <= 0) {
            [spanDias, spanHoras, spanMinutos, spanSegundos].forEach(el => {
                if (el) el.textContent = '00';
            });
            return;
        }

        const dias     = String(Math.floor(diferencia / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const horas    = String(Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutos  = String(Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const segundos = String(Math.floor((diferencia % (1000 * 60)) / 1000)).padStart(2, '0');

        if (spanDias     && dias     !== prevValues.dias)     { animateDigit(spanDias,     dias);     prevValues.dias     = dias; }
        if (spanHoras    && horas    !== prevValues.horas)    { animateDigit(spanHoras,    horas);    prevValues.horas    = horas; }
        if (spanMinutos  && minutos  !== prevValues.minutos)  { animateDigit(spanMinutos,  minutos);  prevValues.minutos  = minutos; }
        if (spanSegundos && segundos !== prevValues.segundos) { animateDigit(spanSegundos, segundos); prevValues.segundos = segundos; }
    }

    setInterval(actualizarContador, 1000);
    actualizarContador();


    /* ==============================
       5. FAQ ACCORDION
       ============================== */
    const filas = document.querySelectorAll('.fila');

    filas.forEach(fila => {
        const header = fila.querySelector('.pregunta-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const estaAbierta = fila.classList.contains('abierta');

            // Cerrar todas
            filas.forEach(f => f.classList.remove('abierta'));

            // Abrir la clickeada si estaba cerrada
            if (!estaAbierta) {
                fila.classList.add('abierta');
            }
        });

        // Accesibilidad: teclado
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });


    /* ==============================
       6. DROPDOWNS (click-toggled)
       ============================== */
    function setupDropdown(btnId, contentId) {
        const btn     = document.getElementById(btnId);
        const content = document.getElementById(contentId);
        if (!btn || !content) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = content.classList.contains('open');

            // Cerrar todos los dropdowns
            document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('open'));

            if (!isOpen) content.classList.add('open');
        });
    }

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('open'));
    });

    setupDropdown('btn-genero', 'dropdown-genero');
    setupDropdown('btn-fuente', 'dropdown-fuente');

    // Actualizar texto del botón géneros (checkboxes)
    const checkboxes = document.querySelectorAll('input[name="genero"]');
    const btnGenero  = document.getElementById('btn-genero');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const seleccionados = Array.from(checkboxes)
                .filter(i => i.checked)
                .map(i => i.parentElement.textContent.trim());

            if (btnGenero) {
                btnGenero.textContent = seleccionados.length > 0
                    ? seleccionados.join(', ') + ' ▼'
                    : 'Seleccionar géneros ▼';
            }
        });
    });

    // Actualizar texto del botón fuente (radios)
    const radios    = document.querySelectorAll('input[name="fuente"]');
    const btnFuente = document.getElementById('btn-fuente');

    radios.forEach(rd => {
        rd.addEventListener('change', () => {
            if (rd.checked && btnFuente) {
                btnFuente.textContent = rd.parentElement.textContent.trim() + ' ▼';
            }
        });
    });


    /* ==============================
       7. MENU MOBILE — cerrar al hacer click en un link
       ============================== */
    const menuCheck  = document.getElementById('menu-check');
    const navLinks   = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuCheck) menuCheck.checked = false;
        });
    });


    /* ==============================
       8. POP-UP LINEUP
       ============================== */
    const btnLineup     = document.getElementById('btn-lineup-popup');
    const popupLineup   = document.getElementById('popup-lineup');
    const cerrarLineup  = document.getElementById('cerrar-lineup');

    function abrirPopup(popup) {
        if (!popup) return;
        popup.classList.add('activo');
        document.body.style.overflow = 'hidden';
        popup.focus();
    }

    function cerrarPopup(popup) {
        if (!popup) return;
        popup.classList.remove('activo');
        document.body.style.overflow = '';
    }

    if (btnLineup)    btnLineup.addEventListener('click', () => abrirPopup(popupLineup));
    if (cerrarLineup) cerrarLineup.addEventListener('click', () => cerrarPopup(popupLineup));

    // Cerrar al hacer click en el overlay (fuera del contenido)
    if (popupLineup) {
        popupLineup.addEventListener('click', e => {
            if (e.target === popupLineup) cerrarPopup(popupLineup);
        });
    }


    /* ==============================
       9. POP-UP CONFIRMACIÓN REGISTRO
       ============================== */
    const formRegistro       = document.getElementById('form-registro');
    const popupConfirmacion  = document.getElementById('popup-confirmacion');
    const cerrarConfirmacion = document.getElementById('cerrar-confirmacion');

    function validarForm() {
        let valido = true;

        const nombre      = document.getElementById('nombre');
        const email       = document.getElementById('email');
        const errorNombre = document.getElementById('error-nombre');
        const errorEmail  = document.getElementById('error-email');

        // Reset
        [nombre, email].forEach(el => el && el.classList.remove('invalido'));
        if (errorNombre) errorNombre.textContent = '';
        if (errorEmail)  errorEmail.textContent  = '';

        // Validar nombre
        if (!nombre || nombre.value.trim().length < 2) {
            valido = false;
            if (nombre)      nombre.classList.add('invalido');
            if (errorNombre) errorNombre.textContent = 'Por favor ingresá tu nombre.';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.value.trim())) {
            valido = false;
            if (email)      email.classList.add('invalido');
            if (errorEmail) errorEmail.textContent = 'Ingresá un email válido.';
        }

        return valido;
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', e => {
            e.preventDefault();
            if (validarForm()) {
                abrirPopup(popupConfirmacion);
                formRegistro.reset();
                // Resetear textos de dropdowns
                if (btnGenero) btnGenero.textContent = 'Seleccionar géneros ▼';
                if (btnFuente) btnFuente.textContent = 'Seleccionar opción ▼';
            }
        });
    }

    if (cerrarConfirmacion) {
        cerrarConfirmacion.addEventListener('click', () => cerrarPopup(popupConfirmacion));
    }

    if (popupConfirmacion) {
        popupConfirmacion.addEventListener('click', e => {
            if (e.target === popupConfirmacion) cerrarPopup(popupConfirmacion);
        });
    }


    /* ==============================
       10. CERRAR POPUPS CON ESC
       ============================== */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            cerrarPopup(popupLineup);
            cerrarPopup(popupConfirmacion);
        }
    });

});
