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
                <center><button class="btn btn-warning btn-sm" onclick="editarTurno(${turno.id})">Editar</button></center>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Obtener los datos de los turnos al cargar la página
function cargarTurnos() {
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
        paciente: form.querySelector("#paciente").value, 
        fechaHora: form.querySelector("#fechaHora").value, 
        doctor: {
            id: form.querySelector("#doctor").value 
        },
        insumo: form.querySelector("#insumo").value 
            ? { id: form.querySelector("#insumo").value } 
            : null
    };

    console.log("Datos enviados al servidor:", turnoData);

    const method = turnoId ? "PUT" : "POST"; 
    const url = turnoId
        ? `http://localhost:8080/turnos/${turnoId}` // URL para editar
        : "http://localhost:8080/turnos"; // URL para crear

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turnoData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al guardar el turno. Código: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Turno guardado con éxito:", data);
            alert("Turno guardado con éxito");
            const modal = bootstrap.Modal.getInstance(document.querySelector("#turnoModal"));
            modal.hide();
            cargarTurnos(); 
        })
        .catch(error => {
            console.error("Error:", error);
            alert(`Hubo un error al guardar el turno: ${error.message}`);
        });
}

// Cargar los datos de un turno en el modal para editar
function editarTurno(id) {
    fetch(`http://localhost:8080/turnos/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el turno");
            }
            return response.json();
        })
        .then(turno => {
            document.querySelector("#paciente").value = turno.paciente;
            document.querySelector("#fechaHora").value = turno.fechaHora;
            document.querySelector("#doctor").value = turno.doctor.id; // ID del doctor
            document.querySelector("#insumo").value = turno.insumo ? turno.insumo.id : ""; // ID del insumo
            document.querySelector("#turnoId").value = turno.id;

            const modal = new bootstrap.Modal(document.querySelector("#turnoModal"));
            modal.show();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo cargar el turno.");
        });
}

cargarTurnos();
