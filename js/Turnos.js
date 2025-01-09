let turnoId = 2;

function agregarTurno() {
    const tabla = document.getElementById('tabla-turnos');
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${turnoId}</td>
        <td>Nuevo Paciente</td>
        <td>${new Date().toISOString().slice(0, 10)}</td>
        <td><button class="btn btn-warning btn-sm" onclick="editarTurno(${turnoId})">Editar</button></td>
    `;
    tabla.appendChild(nuevaFila);
    turnoId++;
}

function editarTurno(id) {
    alert('Editar turno ' + id);
}