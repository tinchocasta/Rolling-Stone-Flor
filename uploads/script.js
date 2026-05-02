// Lógica para las filas (preguntas frecuentes)
const filas = document.querySelectorAll('.fila');

filas.forEach(fila => {
    fila.addEventListener('click', () => {
        fila.classList.toggle('abierta');
    });
});

// Lógica para Checkboxes - Múltiple
const checkboxes = document.querySelectorAll('input[name="genero"]');
const btnGenero = document.getElementById('btn-genero');

checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        const seleccionados = Array.from(checkboxes)
            .filter(i => i.checked)
            .map(i => i.parentElement.textContent.trim());
        
        if(btnGenero) {
            btnGenero.innerText = seleccionados.length > 0 
                ? seleccionados.join(', ') + " ▼" 
                : "Seleccionar géneros ▼";
        }
    });
});

// Lógica para Fuente (Radio - Único)
const radios = document.querySelectorAll('input[name="fuente"]');
const btnFuente = document.getElementById('btn-fuente');

radios.forEach(rd => {
    rd.addEventListener('change', () => {
        if (rd.checked && btnFuente) {
            btnFuente.innerText = rd.parentElement.textContent.trim() + " ▼";
        }
    });
});

// Contador
const fechaFestival = new Date('2026-11-13T14:00:00');

function actualizarContador() {
    const ahora = new Date();
    const diferencia = fechaFestival - ahora;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById('dias').textContent = String(dias).padStart(2, '0');
    document.getElementById('horas').textContent = String(horas).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

setInterval(actualizarContador, 1000);
actualizarContador();