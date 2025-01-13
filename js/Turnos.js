function llenarTabla(data) {
    const tbody = document.querySelector("#tabla-turnos tbody");
    tbody.innerHTML = '';  

    data.forEach(turno => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${turno.id}</td>
            <td>${turno.paciente}</td>
            <td>${turno.fechaHora}</td>
            <td>${turno.doctor.nombre}</td>
            <td>${turno.doctor.especialidad}</td>
            <td>${turno.insumo.nombre}</td>
            <td>${turno.insumo.descripcion}</td>
            <td>${turno.insumo.stock}</td>
        `;

        tbody.appendChild(row);
    });
}

fetch('http://localhost:8080/turnos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();  
    })
    .then(data => {
        llenarTabla(data);
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        alert('Hubo un problema al cargar los datos. Verifica la conexión o la URL.');
    });
