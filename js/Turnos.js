document.addEventListener('DOMContentLoaded', function() {

    const API_URL = 'http://localhost:8080/turnos';

    function loadTable(){
        fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const tablebody = document.querySelector('#tabla-turnos tbody');
            tablebody.innerHTML = '';
            data.results.forEach((turno, index) => {

                //Columna de id
                const row = document.createElement('tr');
                const numberCell = document.createElement('th');
                numberCell.scope = 'row';
                numberCell.textContent = index + 1;
                row.appendChild(numberCell);

                //Columna de Paciente
                const pacienteCell = document.createElement('td');
                pacienteCell.textContent = turno.paciente;
                row.appendChild(pacienteCell);

                //Columna de Fecha
                const fechaCell = document.createElement('td');
                fechaCell.textContent = turno.fecha;
                row.appendChild(fechaCell);

                //Columnda Acciones
                const actionscell = document.createElement('td');

                //Boton Editar
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-primary btn-sm mr-2';
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => {
                    openEditModal(turno.id, turno.paciente, turno.fecha);
                });
                actionscell.appendChild(editButton);

                row.appendChild(actionscell);
                tablebody.appendChild(row);
            });

        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        }); 
    }

    function openEditModal(id, paciente, fecha){
        document.getElementById('turnoId').value = id;
        document.getElementById('pacienteId').value = paciente;
        document.getElementById('fechaId').value = fecha;
        document.getElementById('editModal').style.display = 'block';
    }

    function closeEditModal() {
        document.getElementById('categoryModal').style.display = 'none';
    }

    loadTable();
});