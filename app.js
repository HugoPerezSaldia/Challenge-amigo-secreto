// Almacenamiento de datos
let participantes = JSON.parse(localStorage.getItem('participantes')) || [];
let participantesSinEmparejar = JSON.parse(localStorage.getItem('participantesSinEmparejar')) || [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    actualizarEstadisticas();
    
    // Si hay participantes pero no hay lista de sin emparejar, inicializar
    if (participantes.length > 0 && participantesSinEmparejar.length === 0) {
        participantesSinEmparejar = [...participantes];
        guardarEnLocalStorage();
    }
    
    // Tecla Enter para agregar
    document.getElementById('amigo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') agregarParticipante();
    });
});

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo}`;
    notification.classList.add('show');
    
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Agregar participante
function agregarParticipante() {
    const input = document.getElementById('amigo');
    const nombre = input.value.trim();
    
    if (!nombre) {
        mostrarNotificacion('Escribe un nombre válido', 'error');
        return;
    }
    
    if (participantes.includes(nombre)) {
        mostrarNotificacion('Este nombre ya está en la lista', 'error');
        return;
    }
    
    participantes.push(nombre);
    participantesSinEmparejar.push(nombre);
    input.value = '';
    
    guardarEnLocalStorage();
    actualizarEstadisticas();
    mostrarNotificacion('Participante agregado');
}

// Realizar sorteo
function realizarSorteo() {
    if (participantes.length < 2) {
        mostrarNotificacion('Se necesitan al menos 2 participantes', 'error');
        return;
    }
    
    if (participantesSinEmparejar.length === 0) {
        mostrarNotificacion('Todos ya tienen pareja. Reinicia el juego.', 'error');
        return;
    }
    
    // Seleccionar un participante aleatorio de los que no tienen pareja
    const indiceAleatorio = Math.floor(Math.random() * participantesSinEmparejar.length);
    const elegido = participantesSinEmparejar[indiceAleatorio];
    
    // Crear lista de posibles parejas (excluyéndose a sí mismo)
    let posiblesParejas = participantes.filter(p => p !== elegido);
    
    // Si no hay posibles parejas, mostrar error
    if (posiblesParejas.length === 0) {
        mostrarNotificacion('No hay parejas disponibles', 'error');
        return;
    }
    
    // Seleccionar pareja aleatoria
    const pareja = posiblesParejas[Math.floor(Math.random() * posiblesParejas.length)];
    
    // Eliminar al participante de la lista de sin emparejar
    participantesSinEmparejar = participantesSinEmparejar.filter(p => p !== elegido);
    
    // Mostrar resultado
    document.getElementById('resultado').innerHTML = `
        <div><strong>${elegido}</strong> tiene como amigo secreto a <strong>${pareja}</strong></div>
    `;
    
    guardarEnLocalStorage();
    actualizarEstadisticas();
    mostrarNotificacion('Sorteo realizado con éxito');
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    document.getElementById('total-participantes').textContent = participantes.length;
    document.getElementById('restantes').textContent = participantesSinEmparejar.length;
}

// Limpiar todo (sin popup de confirmación)
function limpiarTodo() {
    participantes = [];
    participantesSinEmparejar = [];
    
    document.getElementById('resultado').innerHTML = '';
    
    guardarEnLocalStorage();
    actualizarEstadisticas();
    mostrarNotificacion('Juego reiniciado');
}

// Guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('participantes', JSON.stringify(participantes));
    localStorage.setItem('participantesSinEmparejar', JSON.stringify(participantesSinEmparejar));
}
