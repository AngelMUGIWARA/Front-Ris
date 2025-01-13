function llenarTabla(data) {
    const tbody = document.querySelector("#tabla-stock tbody");
    tbody.innerHTML = '';  // Limpiar las filas anteriores

    data.forEach(insumo => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${insumo.id}</td>
            <td>${insumo.nombre}</td>
            <td>${insumo.descripcion}</td>
            <td>${insumo.stock}</td>
        `;

        tbody.appendChild(row);
    });
}

fetch('http://localhost:8080/insumos')
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

    // Función para generar el reporte en PDF
function generarReportePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del reporte
    doc.setFontSize(18);
    doc.text('Reporte de Stock de Medicamentos', 20, 20);

    // Cabecera de la tabla
    doc.setFontSize(12);
    doc.text('ID', 20, 30);
    doc.text('Medicamento', 40, 30);
    doc.text('Descripción', 100, 30);
    doc.text('Stock', 160, 30);

    // Rellenar los datos de la tabla
    const tbody = document.querySelector("#tabla-stock tbody");
    let yPosition = 40;  // Posición inicial de la primera fila de datos

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        doc.text(cells[0].textContent, 20, yPosition);
        doc.text(cells[1].textContent, 40, yPosition);
        doc.text(cells[2].textContent, 100, yPosition);
        doc.text(cells[3].textContent, 160, yPosition);
        yPosition += 10;  // Aumentar la posición para la siguiente fila
    });

    // Guardar el PDF y descargarlo
    doc.save('reporte_stock_medicamentos.pdf');
}
