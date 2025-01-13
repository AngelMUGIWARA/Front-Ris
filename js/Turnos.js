// Llenar la tabla de turnos con datos del servidor
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
            <td>${turno.insumo.nombre}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarTurno(${turno.id})">Editar</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Obtener los datos de los turnos al cargar la página
function cargarTurnos() {
    fetch('http://localhost:8080/turnos') // Cambia esta URL si tu backend está en otra dirección
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
}

// Abrir el modal para agregar un nuevo turno
function agregarTurno() {
    document.querySelector("#formTurno").reset();
    document.querySelector("#turnoId").value = ""; // Limpia el ID
    const modal = new bootstrap.Modal(document.querySelector("#turnoModal"));
    modal.show();
}

// Guardar un turno (nuevo o editado)
function guardarTurno() {
    const form = document.querySelector("#formTurno");
    const turnoId = document.querySelector("#turnoId").value;
    const turnoData = {
        id: turnoId || null, // Si es vacío, es un nuevo turno
        paciente: form.paciente.value,
        fechaHora: form.fechaHora.value,
        doctor: { nombre: form.doctor.value },
        insumo: { nombre: form.insumo.value }
    };

    const method = turnoId ? "PUT" : "POST";
    const url = turnoId ? `http://localhost:8080/turnos/${turnoId}` : "http://localhost:8080/turnos";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turnoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al guardar el turno");
        }
        return response.json();
    })
    .then(() => {
        alert("Turno guardado con éxito");
        const modal = bootstrap.Modal.getInstance(document.querySelector("#turnoModal"));
        modal.hide();
        cargarTurnos(); // Recargar la tabla de turnos
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al guardar el turno.");
    });
}

// Cargar los datos de un turno en el modal para editar
function editarTurno(id) {
    fetch(`http://localhost:8080/turnos/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el turno");
            }
            return response.json();
        })
        .then(turno => {
            document.querySelector("#paciente").value = turno.paciente;
            document.querySelector("#fechaHora").value = turno.fechaHora;
            document.querySelector("#doctor").value = turno.doctor.nombre;
            document.querySelector("#insumo").value = turno.insumo.nombre || "";
            document.querySelector("#turnoId").value = turno.id;

            const modal = new bootstrap.Modal(document.querySelector("#turnoModal"));
            modal.show();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo cargar el turno.");
        });
}

// Cargar turnos al cargar la página
cargarTurnos();
